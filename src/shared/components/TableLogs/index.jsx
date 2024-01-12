import React, { useRef, useState } from 'react'
import Wrapper from '../Wrap'
import { Col, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollar, faWonSign } from '@fortawesome/free-solid-svg-icons'
import { getLiveTableGameLogs, getTableLogsList } from 'query/logs/gameLogs/gameLogs.query'
import { useQuery } from 'react-query'
import DataTable from '../DataTable'
import { appendParams, parseParams } from 'shared/utils'
import { TableLogsListColumn } from 'shared/constants/TableHeaders'
import moment from 'moment'
import TriggerTooltip from '../Tooltip/tooltip'

const TableLogs = ({ id, tableLogs, location, isLive }) => {
    const parsedData = parseParams()
    const params = useRef(parseParams)

    const navigate = useNavigate()

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            eStatus: location || 'finished',
            totalElements: data?.totalElements || 0,
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(TableLogsListColumn, parsedData))

    // GET TABLE LOGS LIST
    const { data: tableLogsList, isLoading, isFetching } = useQuery(['tableLogsList', requestParams, id, isLive], () => getTableLogsList(id, requestParams), {
        enabled: !!id || !!requestParams || !!isLive,
        select: (data) => data?.data?.data,
    })

    // GET LIVE TABLE LOGS LIST
    const { data } = useQuery(['tableLogsList', requestParams, id], () => getLiveTableGameLogs(id, requestParams), {
        enabled: !!id || !!requestParams,
        select: (data) => data?.data?.data,
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
        setRequestParams({ ...requestParams, nLimit: Number(value), pageNumber: 1 })
        appendParams({ nLimit: Number(value), pageNumber: 1 })
    }

    function handlePageEvent (page) {
        setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
        appendParams({ pageNumber: page, nStart: page - 1 })
    }
    return (
        <>
            <div className='table-logs'>
                <Wrapper>
                    <h3>Players</h3><hr />

                    <Row className='pb-3'>
                        <Col xxl={2} xl={3} lg={4} md={6} sm={6} xs={12}>
                            <Wrapper>
                                <div className='player-card'>
                                    <span className='card-header'>Table Name</span>
                                    <span className='link' onClick={() => navigate(route.viewNLH(tableLogs?.iProtoId))}>{tableLogs?.sName || '-'}</span>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={2} xl={3} lg={4} md={6} sm={6} xs={12} className='mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-0 mt-sm-0 mt-3'>
                            <Wrapper>
                                <div className='player-card'>
                                    <span className='card-header'>Table Ante</span>
                                    <span className='card-value'><FontAwesomeIcon icon={faDollar} size='md' color='#f7b750' /> {tableLogs?.nAnte}</span>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={2} xl={3} lg={4} md={6} sm={6} xs={12} className='mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-3 mt-3'>
                            <Wrapper>
                                <div className='player-card'>
                                    <span className='card-header'>Table Type</span>
                                    <span className='card-value'>{tableLogs?.ePokerType || '-'}</span>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={2} xl={3} lg={4} md={6} sm={6} xs={12} className='mt-xxl-0 mt-xl-0 mt-lg-3 mt-md-3 mt-3'>
                            <Wrapper>
                                <div className='player-card'>
                                    <span className='card-header'>Total Player</span>
                                    <span className='card-value'>{tableLogs?.nTotalParticipant}</span>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={2} xl={3} lg={4} md={6} sm={6} xs={12} className='mt-xxl-0 mt-xl-3 mt-lg-3 mt-md-3 mt-3'>
                            <Wrapper>
                                <div className='player-card'>
                                    <span className='card-header'>Table Round</span>
                                    <span className='card-value'>{tableLogs?.nRound || '0'}</span>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={2} xl={3} lg={4} md={6} sm={6} xs={12} className='mt-xxl-0 mt-xl-3 mt-lg-3 mt-md-3 mt-3'>
                            <Wrapper>
                                <div className='player-card'>
                                    <span className='card-header'>Game State</span>
                                    <span className='card-value'>{tableLogs?.aLog?.[0]?.oData?.eGameState || '-'}</span>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={2} xl={3} lg={4} md={6} sm={6} xs={12} className='mt-3'>
                            <Wrapper>
                                <div className='player-card'>
                                    <span className='card-header'>VIP</span>
                                    <span className='card-value'>{tableLogs?.oSetting?.oReward?.nVipBonus || '0'}</span>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={4} xl={6} lg={8} md={12} className='mt-3'>
                            <Wrapper>
                                <Row>
                                    <Col xl={6} md={6} xs={6} className='player-card'>
                                        <span className='card-header'>Table Winning Amount</span>
                                        <span className='card-value'><FontAwesomeIcon icon={faWonSign} size='sm' color='var(--primary-color)' /> {tableLogs?.aLog?.[0]?.oData?.aParticipant?.find(item => item?.nWinningAmount > 0)?.nWinningAmount?.toFixed(2)}</span>
                                    </Col>
                                    <Col xl={6} md={6} xs={6} className='player-card'>
                                        <span className='card-header'>Winner</span>
                                        <span className='link' onClick={() => navigate(route?.viewUser(tableLogs?.aLog?.[0]?.oData?.aParticipant?.find(item => item?.nWinningAmount > 0)?.iUserId))}>{tableLogs?.aLog?.[0]?.oData?.aParticipant?.find(item => item?.nWinningAmount > 0)?.sUserName}</span>
                                    </Col>
                                </Row>
                            </Wrapper>
                        </Col>
                    </Row>
                </Wrapper>
            </div>
            <div className='mt-3'>
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
                    totalRecord={isLive ? data && (data?.count?.totalData || 0) : tableLogsList && (tableLogsList?.count?.totalData || 0)}
                    pageChangeEvent={handlePageEvent}
                    isLoading={isLoading || isFetching}
                    pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
                >
                    {isLive ? data && data?.logs?.map((log, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <TriggerTooltip className='user single-line text-capitalize' data={log.sUserName || '-'} display={log.sUserName || '-'} onClick={() => navigate(route.viewUser(log?.iUserId))} />
                                </td>
                                <td className='text-capitalize'>{log?.sAction || '-'}</td>
                                <td>{log?.nAmount && log?.iPotIndex === 0 ? `${Math.abs(log?.nAmount)?.toFixed(2)} (Pot: 0)` : Math.abs(log?.nAmount)?.toFixed(2) || '0.00'}</td>
                                <td>{log?.nClosingBalance || '0'}</td>
                                <td className="date-data-field">{moment(log.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
                            </tr>
                        )
                    }) :
                        tableLogsList && tableLogsList?.logs?.map((log, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <TriggerTooltip className='user single-line text-capitalize' data={log.sUserName || '-'} display={log.sUserName || '-'} onClick={() => navigate(route.viewUser(log?.iUserId))} />
                                    </td>
                                    <td className='text-capitalize'>{log?.sAction || '-'}</td>
                                    <td>{log?.nAmount && log?.iPotIndex === 0 ? `${Math.abs(log?.nAmount)?.toFixed(2)} ${log?.eAmountType === 'cash' ? '(Cash)' : '(Pot: 0)'}`
                                        : `${Math.abs(log?.nAmount)?.toFixed(2)} ${log?.eAmountType === 'cash' ? '(Cash)' : log?.iPotIndex ? `(Pot: ${log?.iPotIndex})` : ''}` || '0.00'}
                                    </td>
                                    <td>{log?.nClosingBalance || '0'}</td>
                                    <td className="date-data-field">{moment(log.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
                                </tr>
                            )
                        })}
                </DataTable>
            </div>
        </>
    )
}

export default TableLogs
