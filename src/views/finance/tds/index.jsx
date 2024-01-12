import React, { useEffect, useRef, useState } from 'react'
import { getTDSList } from 'query/finance/tds/tdsManagement.query'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import TDSListFilter from 'shared/components/TDSListFilter'
import { RakeManagementColumn, TDSManagementColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import TDSManagementList from 'shared/components/TDSManagementList'
import RakeManagementList from 'shared/components/RakeManagementList'

const TDSManagement = () => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const { handleSubmit, control, reset, watch } = useForm({ mode: 'all' })

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            eState: data?.eState || 'false',
            eType: data?.eType || 'tds',
            eUserType: data?.eUserType || '',
            dateFrom: data.dateFrom || '',
            dateTo: data.dateTo || '',
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
    const [columns, setColumns] = useState(getSortedColumns(TDSManagementColumn, parsedData))
    const [rakeColumns, setRakeColumns] = useState(getSortedColumns(RakeManagementColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['TDSList', requestParams], () => getTDSList(requestParams), {
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
        setRakeColumns(filter)
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
        setRequestParams({ ...requestParams, eType: e?.eType || '', eUserType: e?.eUserType || '', dateFrom: e?.dateFrom || '', dateTo: e?.dateTo || '' })
    }

    useEffect(() => {
        document.title = 'TDS Management | Finance | PokerGold'
    }, [])

    return (
        <>
            {watch('eType')?.value === 'rake' ?
                <DataTable
                    columns={rakeColumns}
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
                    {data && data?.users?.map((rake, index) => {
                        return (
                            <RakeManagementList 
                                rake={rake}
                                index={index}
                            />
                        )
                    })}
                </DataTable>
                :
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
                    {data && data?.users?.map((tds, index) => {
                    return (
                        <TDSManagementList
                            key={tds._id}
                            index={index}
                            tds={tds}
                        />
                    )
                })}
                </DataTable>
            }
            <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='TDS List Filter'>
                <TDSListFilter
                    filterChange={handleFilterChange}
                    closeDrawer={() => setModal({ open: false, type: '' })}
                    defaultValue={requestParams}
                    location={location}
                    handleSubmit={handleSubmit}
                    control={control}
                    reset={reset}
                />
            </Drawer>
        </>
    )
}

export default TDSManagement
