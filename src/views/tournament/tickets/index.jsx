import React, { useEffect, useRef, useState } from 'react'
import { fileToDataUri, toaster } from 'helper/helper'
import { addTicket, deleteTicket, getTicketById, getTicketsList, updateTicket } from 'query/tickets/tickets.query'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import { TicketsListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import TopBar from 'shared/components/Topbar'
import DataTable from 'shared/components/DataTable'
import CustomModal from 'shared/components/Modal'
import CommonInput from 'shared/components/CommonInput'
import TournamentTicketList from 'shared/components/TournamentTicketList'
import { Button, Form, Modal } from 'react-bootstrap'

const TournamentTickets = () => {
    const query = useQueryClient()
    const location = useLocation()

    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const { control, watch, register, formState: { errors }, reset, handleSubmit } = useForm({ mode: 'all' })

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1),
            search: data?.search || '',
            nLimit: data?.nLimit || 10,
            eStatus: data.eStatus || 'y',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(TicketsListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })
    const [ticketID, setTicketID] = useState()

    const MODAL_TYPE = {
        ADD: 'add-modal',
        VIEW: 'view',
        UPDATE: 'update',
        DELETE: 'delete',
    }

    // List
    const { isLoading, isFetching, data } = useQuery(['ticketList', requestParams], () => getTicketsList(requestParams), {
        select: (data) => data.data.data,
    })

    // GET SPECIFIC TICKET
    const { data: specificTicket } = useQuery('ticketDataById', () => getTicketById(ticketID), {
        enabled: !!ticketID,
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            reset({
                sLogo: data?.sLogo,
                sName: data?.sName,
                eStatus: data?.eStatus
            })
            setTicketID('')
        }
    })

    // ADD TICKET
    const { mutate } = useMutation(addTicket, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('ticketList')
            setModal({ open: false, type: '' })
            reset()
        }
    })

    // EDIT TICKET
    const { mutate: updateMutate } = useMutation(updateTicket, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('ticketList')
            setModal({ open: false, type: '' })
            reset({})
            setTicketID('')
        }
    })

    // DELETE TICKET
    const { isLoading: deleteLoading, mutate: deleteMutate } = useMutation(deleteTicket, {
        onSuccess: (res) => {
            query.invalidateQueries('ticketList')
            toaster(res?.data?.message)
            setModal({ open: false, type: '', status: '' })
        }
    })

    function handleSort (field) {
        let selectedFilter
        const filter = columns.map((data) => {
            if (data.internalName === field.internalName) {
                data.type = +data.type === 1 ? -1 : 1
                selectedFilter = data
            } else {
                data.type = 1
            }
            return data
        })
        setColumns(filter)
        const params = {
            ...requestParams,
            page: 0,
            sort: selectedFilter?.internalName,
            orderBy: selectedFilter.type === 1 ? 'ASC' : 'DESC',
            isEmailVerified: selectedFilter?.isEmailVerified
        }
        setRequestParams(params)
        appendParams({
            sort: selectedFilter.type !== 0 ? selectedFilter.internalName : '',
            orderBy: selectedFilter.type
        })
    }

    async function handleHeaderEvent (name, value) {
        switch (name) {
            case 'rows':
                setRequestParams({ ...requestParams, nLimit: Number(value), pageNumber: 1 })
                appendParams({ nLimit: Number(value), pageNumber: 1 })
                break
            case 'search':
                setRequestParams({ ...requestParams, search: value, pageNumber: 1 })
                appendParams({ pageNumber: 1 })
                break
            case 'filter':
                setModal({ open: value, type: 'filter' })
                break
            default:
                break
        }
    }

    function handlePageEvent (page) {
        setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
        appendParams({ pageNumber: page, nStart: page - 1 })
    }

    const handleConfirmDelete = () => {
        deleteMutate(modal?.id)
    }

    const onUpdate = (id) => {
        setModal({ open: true, type: MODAL_TYPE.UPDATE, id: id })
        setTicketID(id)
    }

    const onDelete = (id) => {
        setModal({ open: true, type: MODAL_TYPE.DELETE, id: id })
    }

    const onSubmit = async (ticketData) => {
        let addData = {
            sLogo: '',
            sName: ticketData?.sName,
            id: modal?.id
        };
        const sLogoFile = ticketData.sLogo;

        if (sLogoFile) {
            const dataUri = await fileToDataUri(sLogoFile);
            addData.sLogo = dataUri;
        }

        modal?.type === MODAL_TYPE.ADD ? mutate(addData) : updateMutate(addData)
    }

    const handleClear = () => {
        setModal({ open: false, type: '' })
    }

    useEffect(() => {
        document.title = 'Tournament Tickets | PokerGold'
    }, [])
    return (
        <>
            <TopBar
                buttons={[
                    {
                        text: 'Add Tickets',
                        icon: 'icon-add',
                        type: 'primary',
                        clickEventName: 'createUserName',
                        btnEvent: () => { setModal({ open: true, type: MODAL_TYPE.ADD }); reset({}) }
                    }
                ]}
            />
            <div>
                <DataTable
                    columns={columns}
                    header={{
                        left: {
                            rows: true
                        },
                        right: {
                            search: false,
                            filter: false
                        }
                    }}
                    sortEvent={handleSort}
                    headerEvent={(name, value) => handleHeaderEvent(name, value)}
                    totalRecord={data && (data?.count?.totalData || 0)}
                    pageChangeEvent={handlePageEvent}
                    isLoading={isLoading || isFetching}
                    pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
                >
                    {data && data?.tournament?.map((ticket, index) => {
                        return (
                            <TournamentTicketList
                                ticket={ticket}
                                index={index}
                                onDelete={onDelete}
                                modal={modal}
                                setModal={setModal}
                                watch={watch}
                                onUpdate={onUpdate}
                                setTicketID={setTicketID}
                                specificTicket={specificTicket}
                                updateMutate={updateMutate}
                            />
                        )
                    })}
                </DataTable>

                {(modal?.type === MODAL_TYPE.ADD || modal?.type === MODAL_TYPE.UPDATE) &&
                    <Form className='step-one' autoComplete='off'>
                        <Modal show={modal?.open} onHide={() => setModal({ open: false, id: '' })} id='add-ticket'>
                            <Modal.Header closeButton>
                                <Modal.Title className='add-ticket-header'>{modal?.type === MODAL_TYPE.ADD ? 'Add New Ticket' : 'Update Ticket'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <CommonInput
                                    type='text'
                                    register={register}
                                    errors={errors}
                                    className={`form-control ${errors?.sName && 'error'}`}
                                    name='sName'
                                    label='Ticket Name'
                                    placeholder='Enter ticket name'
                                    required
                                    onChange={(e) => {
                                        e.target.value =
                                            e.target.value?.trim() &&
                                            e.target.value.replace(/^[0-9]+$/g, '')
                                    }}
                                    validation={{
                                        required: {
                                            value: true,
                                            message: 'Ticket name is required.'
                                        },
                                    }}
                                />

                                <div className='fileinput'>
                                    <label>Add Ticket Logo<span className='inputStar'>*</span></label>
                                    <div className='inputtypefile'>
                                        <div className='inputMSG'>
                                            <span>Add Tournament Ticket Logo</span>
                                        </div>
                                        <Controller
                                            name={`sLogo`}
                                            control={control}
                                            rules={{
                                                required: "Please add ticket logo",
                                                validate: {
                                                    fileType: (value) => {
                                                        if (value && typeof (watch(`sLogo`)) !== 'string') {
                                                            const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                                            const fileExtension = value.name.split('.').pop().toLowerCase();

                                                            if (!allowedFormats.includes(fileExtension)) {
                                                                return "Unsupported file format";
                                                            }

                                                            const maxSize = 1 * 1000 * 1000; // 1MB in bytes
                                                            if (value.size >= maxSize) {
                                                                return "File size must be less than 1MB";
                                                            }
                                                        }
                                                        return true;
                                                    },
                                                }
                                            }}
                                            render={({ field: { onChange, value, ref } }) => {
                                                return <>
                                                    <Form.Control
                                                        ref={ref}
                                                        type='file'
                                                        name={`sLogo`}
                                                        // disabled={updateFlag}
                                                        accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                                        errors={errors}
                                                        className={errors?.sLogo && 'error'}
                                                        onChange={(e) => {
                                                            onChange(e.target.files[0])
                                                        }}
                                                    />
                                                </>
                                            }
                                            }
                                        />
                                    </div>

                                    <span className='card-error'>{errors && errors?.sLogo && <Form.Control.Feedback type="invalid">{errors?.sLogo.message}</Form.Control.Feedback>}</span>
                                    <div className="document-preview-group">
                                        {watch('sLogo') && (
                                            typeof (watch('sLogo')) !== 'string'
                                                ? <div className="document-preview"> <img src={URL.createObjectURL(watch('sLogo'))} alt='altImage' /> </div>
                                                : <div className="document-preview"><img src={watch('sLogo')} alt='altImage' /> </div>)}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => handleClear()}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type='submit' onClick={handleSubmit(onSubmit)}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Form >
                }

                <CustomModal
                    open={modal.type === MODAL_TYPE.DELETE && modal.open}
                    handleClose={() => setModal({ open: false, type: '' })}
                    handleConfirm={handleConfirmDelete}
                    disableHeader
                    bodyTitle='Tournament Ticket?'
                    isLoading={deleteLoading}
                    confirmValue={modal?.id}
                >
                    <article>
                        <h5>
                            <div>
                                Are you sure, you want to delete this Ticket?
                            </div>
                        </h5>
                    </article>
                </CustomModal>
            </div>
        </>
    )
}

export default TournamentTickets
