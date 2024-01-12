import React, { useState } from 'react'
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { useQuery } from 'react-query'
import Wrapper from 'shared/components/Wrap'
import { useLocation, useParams } from 'react-router-dom'
import { getGameLogTableCountList, getTableLogs } from 'query/logs/gameLogs/gameLogs.query'
import TableLogs from 'shared/components/TableLogs'
import PlayerGameInfoTable from 'shared/components/PlayerGameInfoTable'
import GameLogsEagleEye from 'shared/components/GameLogsEagleEye'
import GameLogsSpect from 'shared/components/GameLogsSpect'

const ViewGameLogs = () => {
    const location = useLocation()
    const { id } = useParams()

    const [dataID, setDataID] = useState()
    const [currentPage, setCurrentPage] = useState(+id?.split('-')?.[1])

    const [buttonToggle, setButtonToggle] = useState({
        tableLogs: true,
        gameInfo: false,
        spect: false,
        eagleEye: false,
    })

    // GET TABLE COUNT
    const { data: tableCount } = useQuery('tableCount', () => getGameLogTableCountList(id), {
        enabled: !!id,
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            setDataID(id)
        }
    })

    // GET TABLE LOGS
    const { data: tableLogs } = useQuery(['tableLogs', id, dataID], () => getTableLogs(dataID, location?.state?.state?.toLowerCase()), {
        enabled: !!id || !!dataID,
        select: (data) => data?.data?.data,
    })

    const handleTableLogs = () => {
        setButtonToggle({
            tableLogs: true,
            gameInfo: false,
            spect: false,
            eagleEye: false,
        })
    }

    const handleGameInfo = () => {
        setButtonToggle({
            tableLogs: false,
            gameInfo: true,
            spect: false,
            eagleEye: false,
        })
    }

    const handleSpect = () => {
        setButtonToggle({
            tableLogs: false,
            gameInfo: false,
            spect: true,
            eagleEye: false,
        })
    }

    const handleEagleEye = () => {
        setButtonToggle({
            tableLogs: false,
            gameInfo: false,
            spect: false,
            eagleEye: true,
        })
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            setDataID(tableCount[currentPage - 2]._id)
        }
        setButtonToggle({ tableLogs: true })
    }
    
    const nextPage = () => {
        if (currentPage < tableCount?.length) {
            setCurrentPage(currentPage + 1)
            setDataID(tableCount[currentPage]._id)
        }
        setButtonToggle({ tableLogs: true })
    }

    return (
        <>
            <Wrapper>
                <Row className='view-header'>
                    <Col xs={10}>
                        <h2>Table Information {location?.state?.isLive && <span className='live'>Live</span>}</h2>
                    </Col>
                    <Col xs={2}>
                        <div className='buttons'>
                            <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Prev</Tooltip>}>
                                <button
                                    value={tableCount?.find(item => item?._id !== dataID)?._id}
                                    className='btn pagination'
                                    disabled={currentPage === 1 || tableCount?.length === 1 || location?.state?.isLive}
                                    onClick={prevPage}>
                                    <FontAwesomeIcon icon={faCircleChevronLeft} size='xl' />
                                </button>
                            </OverlayTrigger>
                            <span className='current-page'>{currentPage}</span>
                            <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Next</Tooltip>}>
                                <button
                                    value={tableCount?.find(item => item?._id !== dataID)?._id}
                                    className='btn'
                                    disabled={currentPage === tableCount?.length || tableCount?.length === 1 || location?.state?.isLive}
                                    onClick={nextPage}>
                                    <FontAwesomeIcon icon={faCircleChevronRight} size='xl' />
                                </button>
                            </OverlayTrigger>
                        </div>
                    </Col>
                </Row><hr />

                <Row className='mt-md-2 mt-sm-2'>
                    <Col className='transaction-details-button-group' xxl={4} xl={6} lg={8} md={8} sm={12}>
                        <button className={buttonToggle?.tableLogs && 'userActive'} onClick={() => handleTableLogs()}>
                            Table Logs
                        </button>
                        <button className={buttonToggle?.gameInfo && 'userActive'} onClick={() => handleGameInfo()}>
                            Player Basic Game Info
                        </button>
                        <button className={buttonToggle?.spect && 'userActive'} onClick={() => handleSpect()}>
                            Spect
                        </button>
                        <button className={buttonToggle?.eagleEye && 'userActive'} onClick={() => handleEagleEye()}>
                            Eagle Eye
                        </button>
                    </Col>
                    <Col xxl={8} xl={6} lg={4} md={4} sm={12}></Col>
                </Row>

                <div className='user-basic-lower'>
                    {buttonToggle?.tableLogs && <TableLogs id={dataID} tableLogs={tableLogs} location={location?.state?.state?.toLowerCase()} isLive={location?.state?.isLive} />}
                    {buttonToggle?.gameInfo && <PlayerGameInfoTable id={dataID} isLive={location?.state?.isLive} />}
                    {buttonToggle?.spect && <GameLogsSpect id={dataID} isLive={location?.state?.isLive} />}
                    {buttonToggle?.eagleEye && <GameLogsEagleEye id={dataID} isLive={location?.state?.isLive} />}
                </div>
            </Wrapper>
        </>
    )
}

export default ViewGameLogs
