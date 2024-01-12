import React from 'react'
import { getEagleEyeList } from 'query/logs/gameLogs/gameLogs.query'
import { useQuery } from 'react-query'
import Wrapper from '../Wrap'
import { Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollar, faIndianRupee, faRobot, faUser } from '@fortawesome/free-solid-svg-icons'

const GameLogsEagleEye = ({ id, isLive }) => {
    // GET TABLE LOGS LIST
    const { data } = useQuery('eagleEye', () => getEagleEyeList(id), {
        enabled: !!id,
        select: (data) => data?.data?.data,
    })

    function getCard (card) {
        if (!card) return require('assets/images/noCard.jpeg');
        return require(`assets/images/cards/${card}.png`);
    }
    return (
        <>
        {isLive ? <>
            <Wrapper><h1 className='text-danger'>This game may be finished first.</h1></Wrapper>
        </> : 
            <div className='table-logs'>
                <Row>
                    <Col xxl={8} xl={8}>
                        <Wrapper>
                            <h3>Player List</h3><hr />

                            {data?.aParticipant?.map((player, index) => {
                                return (
                                    <tr key={id} className='player-detail'>
                                        <td className='d-flex justify-content-between gap-3 flex-wrap'>
                                            <div className='left-side'>
                                                <div className='profile_icon'>
                                                    {player?.sAvatar ? <img src={player?.sAvatar} alt={`${player?.sUserName} profile`} /> : <FontAwesomeIcon icon={faUser} />}
                                                </div>
                                                <div className={player?.eState === 'playing' ? `player-state` : 'player-state left'}>
                                                    <span>{player?.eState}</span>
                                                </div>
                                            </div>
                                            <div className='right-side'>
                                                <Wrapper>
                                                    <h2>{player?.sUserName} {player?.eUserType === 'ubot' && <FontAwesomeIcon icon={faRobot} size='xs' color='#f5365c' />}</h2>
                                                    <p>Winning Amount: <span className='card-value'>
                                                        <FontAwesomeIcon icon={faIndianRupee} size='sm' /> {player?.aStatistic?.length > 0 ? player?.aStatistic?.map(item =>
                                                            <span>{item?.nAmount} <span className='status'>Win</span></span>
                                                        ) : '0'}
                                                    </span></p>
                                                    <p className='d-flex flex-wrap'>
                                                        <span>Rank Value: <span className='card-value'>{player?.rankValue}</span>, </span>
                                                        <span>Rank Description: <span className='card-value'>{player?.rankDescription}</span></span>
                                                    </p>
                                                    <div className='card-detail'>
                                                        <div className='card-view'>
                                                            <Row>
                                                                <Col lg={6}>
                                                                    <p className='card-header'>Hold Card</p>
                                                                    <div className='d-flex'>
                                                                        {player?.aHoleCard?.map(holdCard => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td className='poker-card'>{holdCard ? <img src={getCard(holdCard)} alt='temp' /> : ''}</td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </Col>
                                                                <Col lg={6}>
                                                                    <p className='card-header'>Hand Card</p>
                                                                    <div className='d-flex flex-wrap'>
                                                                        {player?.hand?.map(handCard => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td className='poker-card'>{handCard ? <img src={getCard(handCard)} alt='temp' /> : ''}</td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </Col>
                                                            </Row>

                                                        </div>
                                                    </div>
                                                </Wrapper>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </Wrapper>
                    </Col>
                    <Col xxl={4} xl={4} className='mt-xxl-0 mt-xl-0 mt-lg-3 mt-3'>
                        <Row>
                            <Col sm={12}>
                                <Wrapper>
                                    <h3>Table Details</h3><hr />
                                    <Row>
                                        <Col xxl={6} xl={12} lg={6} sm={6}>
                                            <Wrapper>
                                                <div className='player-card'>
                                                    <span className='card-header'>Table Name</span>
                                                    <span className='card-value text-wrap mt-3'>{data?.sName}</span>
                                                </div>
                                            </Wrapper>
                                        </Col>

                                        <Col xxl={6} xl={12} lg={6} sm={6} className='mt-xxl-0 mt-xl-2 mt-md-0 mt-2 mt-lg-0'>
                                            <Wrapper>
                                                <div className='player-card'>
                                                    <span className='card-header'>Table Blinds</span>
                                                    <span className='card-value d-flex flex-row justify-content-between flex-wrap pt-md-2'>
                                                        <span className='card-value'>Small: {data?.nSmallBlind}</span>
                                                        <span className='card-value'>Big: {data?.nBigBlind}</span>
                                                    </span>
                                                </div>
                                            </Wrapper>
                                        </Col>
                                        <Col xxl={6} xl={12} lg={6} sm={6} className='mt-2'>
                                            <Wrapper>
                                                <div className='player-card p-xxl-2'>
                                                    <span className='card-header'>Table Ante</span>
                                                    <span className='card-value'><FontAwesomeIcon icon={faDollar} size='md' color='#f7b750' /> {data?.nAnte}</span>
                                                </div>
                                            </Wrapper>
                                        </Col>
                                        <Col xxl={6} xl={12} lg={6} sm={6} className='mt-2'>
                                            <Wrapper>
                                                <div className='player-card'>
                                                    <span className='card-header text-wrap'>Min BuyIn - Max BuyIn</span>
                                                    <span className='card-value'>{data?.nMinimumBuyIn} - {data?.nMaximumBuyIn}</span>
                                                </div>
                                            </Wrapper>
                                        </Col>
                                    </Row>
                                </Wrapper>
                            </Col>
                            <Col sm={12} className='mt-3'>
                                <Wrapper>
                                    <h3>Community Card</h3><hr />
                                </Wrapper>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        }
        </>
    )
}

export default GameLogsEagleEye
