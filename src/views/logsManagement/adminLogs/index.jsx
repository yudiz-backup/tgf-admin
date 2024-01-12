import React, { useEffect, useRef, useState } from 'react'
import { getAdminLogsList } from 'query/logs/adminLogs/adminLogs.query'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import AdminLogsFilter from 'shared/components/AdminLogsFilter'
import AdminLogsList from 'shared/components/AdminLogsList'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import { AdminLogsListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'

const AdminLogs = () => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            dStartDate: data.dStartDate || '',
            dEndDate: data.dEndDate || '',
            sort: data.sort || '',
            search: data?.search || '',
            orderBy: 'ASC',
            state: data?.state || '',
            totalElements: data?.totalElements || 0,
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(AdminLogsListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['adminLiveLogsList', requestParams], () => getAdminLogsList(requestParams), {
        select: (data) => data.data.data,
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

    function handleFilterChange (e) {
        setRequestParams({ ...requestParams, dStartDate: e?.dStartDate || '', dEndDate: e?.dEndDate || '' })
    }

    function handlePageEvent (page) {
        setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
        appendParams({ pageNumber: page, nStart: page - 1 })
    }

    useEffect(() => {
        document.title = 'Game Logs | Logs | PokerGold'
    }, [])

    return (
        <>
            <DataTable
                columns={columns}
                header={{
                    left: {
                        rows: true
                    },
                    right: {
                        search: true,
                        filter: true
                    }
                }}
                sortEvent={handleSort}
                headerEvent={(name, value) => handleHeaderEvent(name, value)}
                totalRecord={data && (data?.count?.total || 0)}
                pageChangeEvent={handlePageEvent}
                isLoading={isLoading || isFetching}
                pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
            >
                {data && data?.logs?.map((adminLog, index) => {
                    return (
                        <AdminLogsList
                            key={adminLog._id}
                            index={index}
                            adminLog={adminLog}
                        />
                    )
                })}
                <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Admin Logs List Filter'>
                    <AdminLogsFilter
                        filterChange={handleFilterChange}
                        closeDrawer={() => setModal({ open: false, type: '' })}
                    />
                </Drawer>
            </DataTable>
        </>
    )
}

export default AdminLogs
