import React, { useEffect, useRef, useState } from 'react'
import { getWithdrawalList } from 'query/finance/withdrawal/withdrawal.query'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import WithdrawalFilter from 'shared/components/WithdrawalFilter'
import WithdrawalList from 'shared/components/WithdrawalList'
import { WithdrawalManagementColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'

const WithdrawalManagement = () => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            eStatus: data?.eStatus || 'pending',
            eMedium: data?.eMedium || '',
            eSource: data?.eSource || '',
            dateFrom: data.dateFrom || '',
            dateTo: data.dateTo || '',
            dUpdatedStartDate: data?.dUpdatedStartDate || '',
            dUpdatedEndDate: data?.dUpdatedEndDate || '',
            sort: data.sort || '',
            search: data?.search || '',
            orderBy: 'ASC',
            totalElements: data?.totalElements || 0,
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(WithdrawalManagementColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['withdrawalList', requestParams], () => getWithdrawalList(requestParams), {
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
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', eMedium: e?.eMedium || '', eSource: e?.eSource || '', dateFrom: e?.dateFrom || '', dateTo: e?.dateTo || '', dUpdatedStartDate: e?.dUpdatedStartDate || '', dUpdatedEndDate: e?.dUpdatedEndDate || '' })
    }

    useEffect(() => {
        document.title = 'Withdrawal Management | Finance | PokerGold'
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
                totalRecord={data && (data?.count?.totalData || 0)}
                pageChangeEvent={handlePageEvent}
                isLoading={isLoading || isFetching}
                pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
            >
                {data && data?.withdrawal?.map((withdrawal, index) => {
                    return (
                        <WithdrawalList
                            key={withdrawal._id}
                            index={index}
                            withdrawal={withdrawal}
                        />
                    )
                })}
                <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Withdrawal List Filter'>
                    <WithdrawalFilter
                        filterChange={handleFilterChange}
                        closeDrawer={() => setModal({ open: false, type: '' })}
                        defaultValue={requestParams}
                        location={location}
                    />
                </Drawer>
            </DataTable>
        </>
    )
}

export default WithdrawalManagement
