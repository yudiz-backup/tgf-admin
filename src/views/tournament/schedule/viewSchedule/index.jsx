import React, { useState } from 'react'
import { faArrowUp, faChair, faClock, faGamepad, faHandHoldingDollar, faHourglass2, faIndianRupee, faSatellite, faShoePrints } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { getScheduleByID } from 'query/schedule/schedule.query'
import { Col, Modal, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'
import Wrapper from 'shared/components/Wrap'
import PrototypeBlindStructure from 'shared/components/PrototypeBlindStructure'
import PrototypePrizeStructure from 'shared/components/PrototypePrizeStructure'
import ScheduleTournamentTable from 'shared/components/ScheduleTournamentTable'
import ScheduleTournamentInfo from 'shared/components/ScheduleTournamentInfo'
import ScheduleTournamentWinner from 'shared/components/ScheduleTournamentWinner'

const ViewSchedule = () => {
    const { id } = useParams()
    const location = useLocation()

    const [show, setShow] = useState(false);
    const [buttonToggle, setButtonToggle] = useState({
        blindStructure: true,
        prizeStructure: false,
    })
    const [tournamentButton, setTournamentButton] = useState({
        table: true,
        info: false,
        winner: false
    })

    // GET SPECIFIC SCHEDULE
    const { data: specificSchedule } = useQuery('scheduleDataById', () => getScheduleByID(id), {
        enabled: !!id,
        select: (data) => data?.data?.data,
    })
    
    const handleClose = () => setShow(false);
    return (
        <>
            <Row>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
                    <Wrapper>
                        <div className='details-card-data'>
                            <span className='data-title tournament'>Tournament Profile :</span><hr />
                            <Row className='details-data-row p-0 m-0'>
                                <Col xxl={3} xl={3} lg={4} md={6} sm={3} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Name</span>
                                    <span className='data-value'>{specificSchedule?.sName || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={3} lg={4} md={6} sm={3} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Type</span>
                                    <span className='data-value tournament-type'>{specificSchedule?.eType || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={3} lg={4} md={6} sm={3} xs={6} className="p-0 m-0">
                                    <span className='data-title'>State <FontAwesomeIcon icon={faSatellite} size='lg' color='#338ef7' /></span>
                                    <span className='data-value tournament-type'>{specificSchedule?.eState || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={3} lg={4} md={6} sm={3} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Poker</span>
                                    <span className='data-value'>{specificSchedule?.ePokerType || '-'}</span>
                                </Col>
                            </Row>
                        </div>
                    </Wrapper>
                </Col>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} className='mt-lg-0 mt-md-0 mt-sm-3 mt-3'>
                    <Wrapper>
                        <div className='details-card-data'>
                            <span className='data-title tournament'>Tournament Fee :</span><hr />
                            <Row className='details-data-row p-0 m-0'>
                                <Col xxl={4} xl={4} lg={6} md={6} sm={4} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Buy ID <FontAwesomeIcon icon={faShoePrints} size='lg' color='#338ef7' /></span>
                                    <span className='data-value tournament-type'><FontAwesomeIcon icon={faIndianRupee} size='sm' color='#338ef7' /> {specificSchedule?.nBuyIn?.toFixed(2) || '-'}</span>
                                </Col>
                                <Col xxl={4} xl={4} lg={6} md={6} sm={4} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Entry Fee <FontAwesomeIcon icon={faShoePrints} size='lg' color='#338ef7' /></span>
                                    <span className='data-value'><FontAwesomeIcon icon={faIndianRupee} size='sm' color='#338ef7' /> {specificSchedule?.oEntryFee?.nAmount?.toFixed(2) || '-'}</span>
                                </Col>
                                <Col xxl={4} xl={4} lg={6} md={6} sm={4} xs={6} className="p-0 m-0">
                                    <span className='data-title d-flex'>Starting Chip <FontAwesomeIcon icon={faHandHoldingDollar} size='xl' color='#f7b750' /></span>
                                    <span className='data-value'><FontAwesomeIcon icon={faIndianRupee} size='sm' color='#f7b750' /> {specificSchedule?.nStartingChip?.toFixed(2) || '-'}</span>
                                </Col>
                            </Row>
                        </div>
                    </Wrapper>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col xl={6} lg={12} md={12} sm={12}>
                    <Wrapper>
                        <div className='details-card-data'>
                            <span className='data-title tournament'>Tournament Player Details :</span><hr />
                            <Row className='details-data-row p-0 m-0'>
                                <Col xxl={6} xl={6} lg={4} md={6} sm={6} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Total Player in each Table <FontAwesomeIcon icon={faChair} size='lg' color='#338ef7' /></span>
                                    <span className='data-value'>{specificSchedule?.nPlayerPerTable || '-'}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={4} md={6} sm={6} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Re-Entry Player Limit</span>
                                    <span className='data-value'>{specificSchedule?.nReEntryPerPlayer || '-'}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={4} md={6} sm={6} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Blind Up <FontAwesomeIcon icon={faSatellite} size='lg' color='#2dce89' /></span>
                                    <span className='data-value'>{`${specificSchedule?.nBlindUp} sec` || 0}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={4} md={6} sm={6} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Tournament Level <FontAwesomeIcon icon={faArrowUp} size='lg' color='#2dce89' /></span>
                                    <span className='data-value'>{specificSchedule?.nCurrentLevel || 0}</span>
                                </Col>
                            </Row>
                        </div>
                    </Wrapper>
                </Col>
                <Col xl={6} lg={12} md={12} sm={12} className='mt-xxl-0 mt-xl-0 mt-lg-3 mt-md-3 mt-sm-3 mt-3'>
                    <Wrapper>
                        <div className='details-card-data'>
                            <span className='data-title tournament'>Tournament Date :</span><hr />
                            <Row className='details-data-row p-0 m-0'>
                                <Col xxl={6} xl={6} lg={3} md={4} sm={6} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Announce Date <FontAwesomeIcon icon={faClock} size='lg' color='#ff3636' /></span>
                                    <span className='data-value'>{moment(specificSchedule?.dAnnounce)?.format('DD-MM-YYYY, h:mm:ss a') || '-'}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={3} md={4} sm={6} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Registration Start <FontAwesomeIcon icon={faHourglass2} size='lg' color='#2dce89' /></span>
                                    <span className='data-value tournament-type'>{moment(specificSchedule?.dRegistrationStart)?.format('DD-MM-YYYY, h:mm:ss a') || '-'}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={3} md={4} sm={6} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Registration End <FontAwesomeIcon icon={faHourglass2} size='lg' color='#2dce89' /></span>
                                    <span className='data-value tournament-type'>{moment(specificSchedule?.dRegistrationEnd)?.format('DD-MM-YYYY, h:mm:ss a') || '-'}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={3} md={4} sm={6} xs={6} className="p-0 m-0">
                                    <span className='data-title'>Game Start <FontAwesomeIcon icon={faClock} size='lg' color='#ff3636' /></span>
                                    <span className='data-value'>{moment(specificSchedule?.dScheduledAt)?.format('DD-MM-YYYY, h:mm:ss a') || '-'}</span>
                                </Col>
                            </Row>
                        </div>
                    </Wrapper>
                </Col>
            </Row>

            <Row className='mt-3 mb-3'>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
                    <Wrapper>
                        <div className='details-card-data p-2'>
                            <Row className='details-data-row p-0 m-0'>
                                <Col xxl={4} xl={4} lg={4} md={6} sm={4} xs={4} className="p-0 m-0">
                                    <span className='data-title'>Pool Amount</span>
                                    <span className='data-value tournament-type'><FontAwesomeIcon icon={faIndianRupee} size='sm' color='#338ef7' /> {specificSchedule?.nPoolAmount?.toFixed(2) || 0}</span>
                                </Col>
                                <Col xxl={4} xl={4} lg={4} md={6} sm={4} xs={4} className="p-0 m-0">
                                    <span className='data-title'>Add On Fee</span>
                                    <span className='data-value'><FontAwesomeIcon icon={faIndianRupee} size='sm' color='#338ef7' /> {specificSchedule?.oDynamicControl?.oAddOn?.nFee?.toFixed(2) || '-'}</span>
                                </Col>
                                <Col xxl={4} xl={4} lg={4} md={6} sm={4} xs={4} className="p-0 m-0">
                                    <span className='data-title'>Re-Buy Fee</span>
                                    <span className='data-value'><FontAwesomeIcon icon={faIndianRupee} size='sm' color='#338ef7' /> {specificSchedule?.oDynamicControl?.oReBuy?.nFee?.toFixed(2) || '-'}</span>
                                </Col>
                            </Row>
                        </div>
                    </Wrapper>
                </Col>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} className='mt-lg-0 mt-md-0 mt-sm-3 mt-3'>
                    <Wrapper>
                        <div className='details-card-data p-2'>
                            <Row className='details-data-row p-0 m-0'>
                                <Col xxl={6} xl={6} lg={12} md={12} sm={6} className="p-0 m-0">
                                    <span className='data-title word-break'>Minimum Entry/ Maximum Entry <FontAwesomeIcon icon={faGamepad} size='sm' color='#ff3636' /></span>
                                    <span className='data-value tournament-type'>{`${specificSchedule?.oMTTConfiguration?.oMTTEntries?.nMinimum} / ${specificSchedule?.oMTTConfiguration?.oMTTEntries?.nMaximum}` || '0 / 0'}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={12} md={12} sm={6} className="p-0 m-0">
                                    <span className='data-title'>
                                        <span className='link' onClick={() => setShow(true)}>Blind/ Winning Structures</span>
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </Wrapper>
                </Col>
            </Row>

            <Wrapper>
                <div className='information'>
                    <h3>Tournament Information</h3>
                    <div className='schedule-button-group'>
                        <button className={tournamentButton?.table && 'userActive'} onClick={() => setTournamentButton({ table: true })}>
                            Tournament Table
                        </button>
                        <button className={tournamentButton?.info && 'userActive'} onClick={() => setTournamentButton({ info: true })}>
                            Tournament Player Info
                        </button>
                        <button className={tournamentButton?.winner && 'userActive'} onClick={() => setTournamentButton({ winner: true })}>
                            Tournament Winners
                        </button>
                    </div>
                </div>

                <div className='schedule-header-contain'>
                    {tournamentButton?.table && <ScheduleTournamentTable id={id} isLive={location?.state?.isLive} />}
                    {tournamentButton?.info && <ScheduleTournamentInfo id={id} />}
                    {tournamentButton?.winner && <ScheduleTournamentWinner id={id} />}
                </div>
            </Wrapper>

            <Modal show={show} onHide={handleClose} className="schedule-view-modal" size='xl' id='schedule'>
                <Modal.Header className='modal-header' closeButton>
                    <Modal.Title>Structures Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <div className='schedule-button-group'>
                        <button className={buttonToggle?.blindStructure && 'userActive'} onClick={() => setButtonToggle({ blindStructure: true })}>
                            Blind Structure
                        </button>
                        <button className={buttonToggle?.prizeStructure && 'userActive'} onClick={() => setButtonToggle({ prizeStructure: true })}>
                            Prize Structure
                        </button>
                    </div>

                    <div className='schedule-header-contain'>
                        {buttonToggle?.blindStructure && <PrototypeBlindStructure id={id} data={specificSchedule} />}
                        {buttonToggle?.prizeStructure && <PrototypePrizeStructure id={id} data={specificSchedule} />}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ViewSchedule
