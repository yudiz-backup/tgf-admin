import React, { useEffect, useRef, useState } from 'react';
import { fileToDataUri, toaster } from 'helper/helper';
import { addStore, deleteStore, getStoreList, updateStoreStatus } from 'query/promotion/store/store.query';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import CommonInput from 'shared/components/CommonInput';
import DataTable from 'shared/components/DataTable';
import CustomModal from 'shared/components/Modal';
import StoreManagementList from 'shared/components/StoreManagementList';
import TopBar from 'shared/components/Topbar';
import { StoreListColumn } from 'shared/constants/TableHeaders';
import { appendParams, parseParams } from 'shared/utils';
import Select from 'react-select'
import Drawer from 'shared/components/Drawer';
import StoreListFilter from 'shared/components/StoreListFilter';

function StoreManagement () {
    const query = useQueryClient()
    const location = useLocation()

    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const { control, watch, register, formState: { errors }, reset, handleSubmit } = useForm({ mode: 'all' })

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            search: data?.search || '',
            nLimit: data?.nLimit || 10,
            eStatus: data.eStatus || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            dateFrom: data?.dateFrom || '',
            dateTo: data?.dateTo || '',
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(StoreListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    const listTypeOption = [
        { label: 'Offer', value: 'Offer' },
        { label: 'Store', value: 'Store' },
    ]

    // List
    const { isLoading, isFetching, data } = useQuery(['storeList', requestParams], () => getStoreList(requestParams), {
        select: (data) => data.data.data,
    })

    // ADD STORE
    const { mutate } = useMutation(addStore, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('storeList')
            setModal({ open: false, type: '' })
            reset()
        }
    })

    // EDIT STATUS
    const { mutate: updateMutate } = useMutation(updateStoreStatus, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('storeList')
            setModal({ open: false, type: '' })
            reset({})
        }
    })

    // DELETE STORE
    const { isLoading: deleteLoading, mutate: deleteMutate } = useMutation(deleteStore, {
        onSuccess: (res) => {
            query.invalidateQueries('storeList')
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

    const onDelete = (id) => {
        setModal({ open: true, type: 'delete', id: id })
    }

    const onSubmit = async (storeData) => {
        let addData = {
            eType: storeData?.eType?.value,
            iPromoCodeId: storeData?.iPromoCodeId?.value || null,
            nAmount: storeData?.nAmount,
            nChips: storeData?.nAmount,
            sIcon: '',
            sLabel: storeData?.sLabel,
        };
        const sIconFile = storeData.sIcon;

        if (sIconFile) {
            const dataUri = await fileToDataUri(sIconFile);
            addData.sIcon = dataUri;
        }

        mutate(addData);
    }

    function handleFilterChange (e) {
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', dateFrom: e?.dateFrom || '', dateTo: e?.dateTo })
    }

    const handleClear = () => {
        setModal({ open: false, type: '' })
    }

    useEffect(() => {
        document.title = 'Store | Promotion | PokerGold'
    }, [])
    return (
        <>
            <TopBar
                buttons={[
                    {
                        text: 'Add Store',
                        icon: 'icon-add',
                        type: 'primary',
                        clickEventName: 'createUserName',
                        btnEvent: () => { setModal({ open: true, type: 'add-modal' }); reset({}) }
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
                            filter: true
                        }
                    }}
                    sortEvent={handleSort}
                    headerEvent={(name, value) => handleHeaderEvent(name, value)}
                    totalRecord={data && (data?.count?.totalData || 0)}
                    pageChangeEvent={handlePageEvent}
                    isLoading={isLoading || isFetching}
                    pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
                >
                    {data && data?.stores?.map((store, index) => {
                        return (
                            <StoreManagementList
                                store={store}
                                onDelete={onDelete}
                                updateMutate={updateMutate}
                            />
                        )
                    })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Store List Filter'>
                        <StoreListFilter
                            filterChange={handleFilterChange}
                            closeDrawer={() => setModal({ open: false, type: '' })}
                            defaultValue={requestParams}
                        />
                    </Drawer>
                </DataTable>

                {modal?.type === 'add-modal' &&
                    <Form className='step-one' autoComplete='off'>
                        <Modal show={modal?.open} onHide={() => setModal({ open: false, id: '' })} id='add-ticket' size='md'>
                            <Modal.Header closeButton>
                                <Modal.Title className='add-ticket-header'>Add New Store</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col sm={6}>
                                        <CommonInput
                                            type='text'
                                            register={register}
                                            errors={errors}
                                            className={`form-control ${errors?.sLabel && 'error'}`}
                                            name='sLabel'
                                            label='Label'
                                            placeholder='Enter the label'
                                            required
                                            onChange={(e) => {
                                                e.target.value =
                                                    e.target.value?.trim() &&
                                                    e.target.value.replace(/^[0-9]+$/g, '')
                                            }}
                                            validation={{
                                                required: {
                                                    value: true,
                                                    message: 'Label is required.'
                                                },
                                            }}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <CommonInput
                                            type='text'
                                            register={register}
                                            errors={errors}
                                            className={`form-control ${errors?.nAmount && 'error'}`}
                                            name='nAmount'
                                            label='Amount'
                                            placeholder='Enter the amount'
                                            required
                                            validation={{
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: 'Only numbers are allowed'
                                                },
                                                required: {
                                                    value: true,
                                                    message: 'Amount is required'
                                                },
                                            }}
                                            onChange={(e) => {
                                                e.target.value =
                                                    e.target.value?.trim() &&
                                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                            }}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className='form-group'>
                                            <Form.Label>
                                                <span>
                                                    List Type (Offer/ Store)
                                                    <span className='inputStar'>*</span>
                                                </span>
                                            </Form.Label>
                                            <Controller
                                                name='eType'
                                                control={control}
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: 'List type is required'
                                                    }
                                                }}
                                                render={({ field: { onChange, value = [], ref } }) => (
                                                    <Select
                                                        ref={ref}
                                                        value={value}
                                                        options={listTypeOption}
                                                        className={`react-select border-0 ${errors.eType && 'error'}`}
                                                        classNamePrefix='select'
                                                        closeMenuOnSelect={true}
                                                        onChange={(e) => {
                                                            onChange(e)
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.eType && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.eType.message}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className='form-group'>
                                            <Form.Label>PromoCode</Form.Label>
                                            <Controller
                                                name='iPromoCodeId'
                                                control={control}
                                                render={({ field: { onChange, value = [], ref } }) => (
                                                    <Select
                                                        ref={ref}
                                                        value={value}
                                                        // options={listTypeOption}
                                                        className={`react-select border-0 ${errors.iPromoCodeId && 'error'}`}
                                                        classNamePrefix='select'
                                                        closeMenuOnSelect={true}
                                                        onChange={(e) => {
                                                            onChange(e)
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.iPromoCodeId && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.iPromoCodeId.message}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <div className='fileinput'>
                                            <label>Add Store Logo<span className='inputStar'>*</span></label>
                                            <div className='inputtypefile'>
                                                <div className='inputMSG'>
                                                    <span>Upload Store Logo</span>
                                                </div>
                                                <Controller
                                                    name={`sIcon`}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Store logo",
                                                        validate: {
                                                            fileType: (value) => {
                                                                if (value && typeof (watch(`sIcon`)) !== 'string') {
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
                                                                name={`sIcon`}
                                                                // disabled={updateFlag}
                                                                accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                                                errors={errors}
                                                                className={errors?.sIcon && 'error'}
                                                                onChange={(e) => {
                                                                    onChange(e.target.files[0])
                                                                }}
                                                            />
                                                        </>
                                                    }}
                                                />
                                            </div>

                                            <span className='card-error'>{errors && errors?.sIcon && <Form.Control.Feedback type="invalid">{errors?.sIcon.message}</Form.Control.Feedback>}</span>
                                            <div className="document-preview-group">
                                                {watch('sIcon') && (
                                                    typeof (watch('sIcon')) !== 'string'
                                                        ? <div className="document-preview"> <img src={URL.createObjectURL(watch('sIcon'))} alt='altImage' /> </div>
                                                        : <div className="document-preview"><img src={watch('sIcon')} alt='altImage' /> </div>)}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

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
                    open={modal.type === 'delete' && modal.open}
                    handleClose={() => setModal({ open: false, type: '' })}
                    handleConfirm={handleConfirmDelete}
                    disableHeader
                    bodyTitle='Store Management'
                    isLoading={deleteLoading}
                    confirmValue={modal?.id}
                >
                    <article>
                        <h5>
                            <div>
                                Are you sure, you want to delete this Store?
                            </div>
                        </h5>
                    </article>
                </CustomModal>
            </div>
        </>
    )
}

export default StoreManagement