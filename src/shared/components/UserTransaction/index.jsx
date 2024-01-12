import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { UserTransactionListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import Drawer from '../Drawer'
import DataTable from '../DataTable'
import TransactionFilter from '../TransactionFilter'
import { getUserTransactionList } from 'query/user/user.query'
import UserTransactionList from '../UserTransactionList'

const UserTransaction = ({ id, buttonToggle, userDetail }) => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            search: data?.search || '',
            eType: data.eType || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            totalElements: data?.totalElements || 0,
            iUserId: id,
            eMedium: data?.eMedium || '',
            ePokerType: data?.ePokerType || '',
            eSource: data?.eSource || '',
            eStatus: data?.eStatus || '',
            sDescription: data?.sDescription || ''
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(UserTransactionListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['userTransactionList', requestParams], () => getUserTransactionList(requestParams), {
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
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', eCategory: e?.eCategory, dateFrom: e?.dateFrom, dateTo: e?.dateTo, dExpiredStartDate: e?.dExpiredStartDate, dExpiredEndDate: e?.dExpiredEndDate })
    }

    useEffect(() => {
        document.title = 'User Transaction | PokerGold'
    }, [])
    return (
        <>
            <div>
                <DataTable
                    label={'Transaction Detail'}
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
                    {data && data?.transactions?.map((transaction, index) => {
                        return (
                            <UserTransactionList
                                index={index}
                                transaction={transaction}
                                userDetail={userDetail}
                            />
                        )
                    })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Transaction List Filter'>
                        <TransactionFilter
                            filterChange={handleFilterChange}
                            closeDrawer={() => setModal({ open: false, type: '' })}
                            defaultValue={requestParams}
                            buttonToggle={buttonToggle}
                        />
                    </Drawer>
                </DataTable>
            </div>
        </>
    )
}

export default UserTransaction
