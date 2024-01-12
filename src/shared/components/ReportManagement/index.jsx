import React, { useEffect, useRef, useState } from 'react'
import { getReportList } from 'query/help/report/report.query'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { ReportListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import DataTable from '../DataTable'
import Drawer from '../Drawer'
import ReportList from '../ReportList'
import ReportListFilter from '../ReportListFilter'

const ReportManagement = () => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const { reset } = useForm({ mode: 'all' })

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            sort: data.sort || '',
            search: data?.search || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            dateFrom: data.dateFrom || '',
            dateTo: data.dateTo || '',
            totalElements: data?.totalElements || 0,
            eState: data?.eState || ''
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(ReportListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['reportList', requestParams], () => getReportList(requestParams), {
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

    function handlePageEvent (page) {
        setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
        appendParams({ pageNumber: page, nStart: page - 1 })
    }

    function handleFilterChange (e) {
        setRequestParams({ ...requestParams, eState: e?.eState || '', dateFrom: e?.dateFrom || '', dateTo: e?.dateTo || '' })
    }

    useEffect(() => {
        document.title = 'Report | Help Desk | PokerGold'
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [requestParams])

    return (
        <>
            <h1 className='report-header' id={'report-header'}>User Report</h1><hr />
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
                {data && data?.reports?.map((user, index) => {
                    return (
                        <ReportList
                            key={user._id}
                            index={index}
                            user={user}
                            reset={reset}
                        />
                    )
                })}
                <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Report List Filter'>
                    <ReportListFilter
                        filterChange={handleFilterChange}
                        closeDrawer={() => setModal({ open: false, type: '' })}
                        defaultValue={requestParams}
                    />
                </Drawer>
            </DataTable>
        </>
    )
}

export default ReportManagement
