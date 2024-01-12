import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ScheduleTournamentWinnerColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import DataTable from '../DataTable'
import Drawer from '../Drawer'
import BonusFilters from '../BonusFilters'
import { getScheduleTournamentWinner } from 'query/schedule/schedule.query'
import { useQuery } from 'react-query'
import TriggerTooltip from '../Tooltip/tooltip'
import { route } from 'shared/constants/AllRoutes'
import moment from 'moment'

const ScheduleTournamentWinner = ({ id, userData }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            search: data?.search || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            totalElements: data?.totalElements || 0,
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(ScheduleTournamentWinnerColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['scheduleTournamentWinnerList', requestParams], () => getScheduleTournamentWinner(id, requestParams), {
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
        document.title = 'View Schedule | Tournament | PokerGold'
    }, [])
    return (
        <>
            <div className='mt-2'>
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
                    {data && data?.users?.map((user, index) => {
                        return (
                            <tr key={user?._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <TriggerTooltip className='user single-line' data={user?.sUserName || '-'} display={user?.sUserName || '-'} onClick={() => navigate(route.viewUser(user?.iUserId))} />
                                </td>
                                <td>{user?.nWinningAmount?.toFixed(2) || '-'}</td>
                                <td>{user?.nMTTRank || '-'}</td>
                                <td>{moment(user?.dCreatedDate)?.format('DD-MM-YYYY') || '-'}</td>
                            </tr>
                        )
                    })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Tournament List Filter'>
                        <BonusFilters
                            filterChange={handleFilterChange}
                            closeDrawer={() => setModal({ open: false, type: '' })}
                            defaultValue={requestParams}
                        />
                    </Drawer>
                </DataTable>
            </div>
        </>
    )
}

export default ScheduleTournamentWinner
