import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ScheduleTournamentTableColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import DataTable from '../DataTable'
import Drawer from '../Drawer'
import ScheduleTournamentTableFilter from '../ScheduleTournamentTableFilter'
import { useQuery } from 'react-query'
import { getFinishedScheduleTable, getLiveScheduleTable } from 'query/schedule/schedule.query'
import moment from 'moment'
import { route } from 'shared/constants/AllRoutes'

const ScheduleTournamentTable = ({ id, isLive }) => {
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
            eStatus: data.eStatus || 'running',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            totalElements: data?.totalElements || 0,
            dateFrom: data?.dateFrom || '',
            dateTo: data?.dateTo || ''
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(ScheduleTournamentTableColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // GET FINISHED SCHEDULE
    const { data, isLoading, isFetching } = useQuery(['finishedScheduleData', requestParams], () => getFinishedScheduleTable(id, requestParams), {
        enabled: !!(isLive !== true) || !!(requestParams?.eStatus === 'finished'),
        select: (data) => data?.data?.data,
    })

    // GET LIVE SCHEDULE
    const { data: liveData, isLoading: liveDataLoading, isFetching: liveDataFetching } = useQuery(['liveScheduleData', requestParams], () => getLiveScheduleTable(id, requestParams), {
        enabled: !!(isLive === true) || !!(requestParams?.eStatus === 'running'),
        select: (data) => data?.data.data,
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
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || 'running', dateFrom: e?.dateFrom || '', dateTo: e?.dateTo || '' })
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
                            search: true,
                            filter: true
                        }
                    }}
                    sortEvent={handleSort}
                    headerEvent={(name, value) => handleHeaderEvent(name, value)}
                    totalRecord={(isLive === true || requestParams?.eStatus === 'running') ? (liveData?.count?.totalData || 0) : data && (data?.count?.total || 0)}
                    pageChangeEvent={handlePageEvent}
                    isLoading={(isLive === true || requestParams?.eStatus === 'running') ? (liveDataLoading || liveDataFetching) : (isLoading || isFetching)}
                    pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
                >
                    {(isLive === true || requestParams?.eStatus === 'running') ?
                        liveData && liveData?.tournament?.map((table, index) => {
                            return (
                                <tr key={table?._id}>
                                    <td>{index + 1}</td>
                                    <td>{table?._id}</td>
                                    <td className='single-line'>{table?.sName || '-'}</td>
                                    <td>{table?.ePokerType || '-'}</td>
                                    <td className='single-line'>{`${table?.nSmallBlind || '0'}/ ${table?.nBigBlind || '0'}` || '-'}</td>
                                    <td>{(table?.oSetting?.nTurnTime / 1000) || '0'}</td>
                                    <td>{table?.nCurrentLevel || '0'}</td>
                                    <td>{table?.paidAddOn || '0'}</td>
                                    <td>{table?.paidReBuy || '0'}</td>
                                    <td>{table?.eStatus || '-'}</td>
                                    <td className='single-line'>{moment(table?.dCreatedDate)?.format('DD-MM-YYYY') || '-'}</td>
                                    <td>
                                        <div className='dropdown-datatable-items-icon' onClick={() => navigate(route?.viewGameLogs(table?._id), { state: { state: table?.eStatus, isLive: isLive } })}>
                                            <i className='icon-visibility d-block' />
                                        </div>
                                    </td>
                                </tr>
                            )
                        }) : data && data?.bonus?.map((bonus, index) => {
                            return (
                                <span>Hi</span>
                                // <BonusList
                                //     key={bonus._id}
                                //     index={index}
                                //     bonus={bonus}
                                //     userData={userData}
                                // />
                            )
                        })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Tournament List Filter'>
                        <ScheduleTournamentTableFilter
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

export default ScheduleTournamentTable
