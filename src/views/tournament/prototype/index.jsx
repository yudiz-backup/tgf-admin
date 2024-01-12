import React, { useEffect, useRef, useState } from 'react'
import { toaster } from 'helper/helper'
import { deletePrototype, getPrototypeList, updatePrototype } from 'query/prototype/prototype.query'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import CustomModal from 'shared/components/Modal'
import PrototypeFilter from 'shared/components/PrototypeFilter'
import PrototypeList from 'shared/components/PrototypeList'
import TopBar from 'shared/components/Topbar'
import { route } from 'shared/constants/AllRoutes'
import { PrototypeListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'

const Prototype = () => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const navigate = useNavigate()
    const query = useQueryClient()

    const { reset } = useForm({ mode: 'all' })

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            search: data?.search || '',
            eStatus: data.eStatus || '',
            eType: data.eType || '',
            ePokerType: data.ePokerType || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(PrototypeListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['prototypeList', requestParams], () => getPrototypeList(requestParams), {
        select: (data) => data.data.data,
    })

    // Status
    const { mutate: statusMutation, } = useMutation(updatePrototype, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            setModal({ open: false, type: '' })
            query.invalidateQueries('prototypeList')
            reset({})
        }
    })

    // DELETE PROTOTYPE
    const { isLoading: deleteLoading, mutate } = useMutation(deletePrototype, {
        onSuccess: (res) => {
            query.invalidateQueries('prototypeList')
            toaster(res?.data?.message)
            setModal({ open: false, type: '' })
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

    const handleConfirmDelete = (id) => {
        mutate(id)
    }

    const onDelete = (id) => {
        setModal({ open: true, type: 'delete', id: id })
    }

    function handleFilterChange (e) {
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', ePokerType: e?.ePokerType || '', eType: e?.eType || '' })
    }

    useEffect(() => {
        document.title = 'Prototype | Tournament | PokerGold'
    }, [])
    return (
        <>
            <TopBar
                buttons={[
                    {
                        text: 'Add Prototype',
                        icon: 'icon-add',
                        type: 'primary',
                        clickEventName: 'createUserName',
                        btnEvent: () => navigate(route.addPrototype)
                    }
                ]}
            />
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
                {data && data?.prototype?.map((prototype, index) => {
                    return (
                        <PrototypeList
                            prototype={prototype}
                            index={index}
                            statusMutation={statusMutation}
                            onDelete={onDelete}
                        />
                    )
                })}
                <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Prototype List Filter'>
                    <PrototypeFilter
                        filterChange={handleFilterChange}
                        closeDrawer={() => setModal({ open: false, type: '' })}
                        defaultValue={requestParams}
                    />
                </Drawer>
            </DataTable>

            <CustomModal
                open={modal.type === 'delete' && modal.open}
                handleClose={() => setModal({ open: false, type: '' })}
                handleConfirm={() => handleConfirmDelete(modal?.id)}
                disableHeader
                bodyTitle='Tournament Prototype'
                isLoading={deleteLoading}
                confirmValue={modal.id}
            >
                <article>
                    <h5>
                        <div>
                            Are you sure that you want to delete this prototype?
                        </div>
                    </h5>
                </article>
            </CustomModal>
        </>
    )
}

export default Prototype
