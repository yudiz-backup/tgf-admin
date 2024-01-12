import React, { useEffect, useRef, useState } from 'react'
import DataTable from '../DataTable'
import { UserOperationListColumn } from 'shared/constants/TableHeaders'
import { useLocation } from 'react-router-dom'
import { appendParams, parseParams } from 'shared/utils'
import UserOperationFilter from '../UserOperationFilter'
import Drawer from '../Drawer'
import UserOperationList from '../UserOperationList'

const UserOperation = ({ userOperation, operationLoading, operationFetching }) => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1),
            search: data?.search || '',
            nLimit: data?.nLimit || 10,
            eStatus: data.eStatus || 'y',
            dateFrom: data.dateFrom || '',
            dateTo: data.dateTo || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            eGender: data.eGender || '',
        }
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(UserOperationListColumn, parsedData))
    const [isFilterOpen, setIsFilterOpen] = useState(false)

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
                setIsFilterOpen(value)
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
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', eGender: e?.eGender || '' })
    }

    useEffect(() => {
        document.title = 'User Operation | PokerGold'
    }, [])
    return (
        <>
            <div>
                <DataTable
                    label='Operation Details'
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
                    totalRecord={userOperation && (userOperation?.count?.total || 0)}
                    pageChangeEvent={handlePageEvent}
                    isLoading={operationLoading || operationFetching}
                    pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
                    >
                    {userOperation && userOperation?.operationLog?.map((operation, index) => {
                        return (
                            <UserOperationList
                                key={operation._id}
                                index={index}
                                operation={operation}
                            />
                        )
                    })}
                    <Drawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(!isFilterOpen)} title='Operation List Filter'>
                        <UserOperationFilter
                            filterChange={handleFilterChange}
                            closeDrawer={() => setIsFilterOpen(!isFilterOpen)}
                            defaultValue={requestParams}
                        />
                    </Drawer>
                </DataTable>
            </div>
        </>
    )
}

export default UserOperation
