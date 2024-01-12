import React, { useState } from 'react'
import Wrapper from '../Wrap'
import { Col, Form, Row } from 'react-bootstrap';
import Cards from '../Card';
import { faArrowsRotate, faBook, faExclamation, faHandHoldingDollar, faLocationArrow, faPercent, faRobot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from 'react-query';
import { getSpectDataList } from 'query/logs/gameLogs/gameLogs.query';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select'
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GameLogsSpect = ({ isLive }) => {
  const { id } = useParams()
  const { control, watch } = useForm({ mode: 'all' })

  const [turnData, setTurnData] = useState('')

  // GET SPECT DATA
  const { data } = useQuery(['spectData', id, isLive], () => getSpectDataList(id), {
    select: (data) => data?.data?.data,
    onSuccess: (res) => {
      const turnRound = res?.aParticipant?.find(item => item?.nWinningAmount > 0)
      setTurnData(turnRound)
    }
  })

  const playerState = [
    { label: 'All', value: '' },
    { label: 'Stand By', value: 'standBy' },
    { label: 'Playing', value: 'playing' },
    { label: 'Left', value: 'left' },
    { label: 'Spectator', value: 'spectator' },
  ]

  function getCard (card) {
    if (!card) return require('assets/images/noCard.jpeg');
    return require(`assets/images/cards/${card}.png`);
  }
  return (
    <>
      {isLive ? <>
        <Row className='spect'>
          <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='card-box'>
            <Cards cardtitle='Table Name' cardtext={data?.sName || '-'} cardIcon={faLocationArrow} className={'dashboard-card-icon-3'} />
          </Col>
          <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='card-box'>
            <Cards cardtitle='Table State' cardtext={data?.eState || '-'} cardIcon={faLocationArrow} className={'dashboard-card-icon-3'} />
          </Col>
          <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='card-box'>
            <Cards cardtitle='Table Info' cardtext={`${data?.eGameType || ''} - ${data?.ePokerType || ''}`} cardIcon={faExclamation} className={'dashboard-card-icon-1'} />
          </Col>
          <Col xxl={3} xl={6} lg={8} md={6} sm={12} className='card-box'>
            <Cards cardtitle={`Table turn ${turnData ? `(${turnData?.iUserId})` : 'No Turn Found'}`} cardtext={turnData?.sUserName || ''} cardIcon={faUserGroup} className={'dashboard-card-icon-6'} />
          </Col>

          <Col xl={3} lg={4} md={6} sm={6} className='card-box'>
            <Cards cardtitle='Table Ante' cardtext={data?.nAnte || '0.00'} cardIcon={faBook} className={'dashboard-card-icon-1'} />
          </Col>
          <Col xl={3} lg={4} md={6} sm={6} className='card-box'>
            <Cards cardtitle='Table Blinds' cardtext={data?.nBlind ? data?.nBlind : `Small - ${data?.nSmallBlind}, Big - ${data?.nBigBlind}` || '0.00'} cardIcon={faBook} className={'dashboard-card-icon-2'} />
          </Col>
          <Col xxl={3} xl={6} lg={8} md={8} sm={12} className='card-box'>
            <Cards cardtitle='Minimum Buy In - Maximum Buy In' cardtext={`${data?.nMinimumBuyIn || '0.00'} - ${data?.nMaximumBuyIn || '0.00'}` || '-'} cardIcon={faHandHoldingDollar} className={'dashboard-card-icon-3'} />
          </Col>
          <Col xl={3} lg={4} md={4} sm={6} className='card-box'>
            <Cards cardtitle='Table Round' cardtext={data?.nRound || '0'} cardIcon={faArrowsRotate} className={'dashboard-card-icon-4'} />
          </Col>
          <Col xxl={3} xl={3} lg={4} md={6} sm={6} className='card-box'>
            <Cards cardtitle='Rake' cardtext={data?.oSetting?.nRake || '0'} cardIcon={faPercent} className={'dashboard-card-icon-6'} />
          </Col>
        </Row>
        {turnData && <>
          <Row>
            <Col xxl={4} xl={6} lg={8} md={12} sm={12} className='community'>
              <Wrapper>
                <h2 className='title m-0'>Community Cards</h2><hr />
                <div className='d-flex flex-auto'>
                  {turnData?.hand?.map((hand, index) => {
                    return (
                      <tr key={index}>
                        <td className='poker-card'><img src={getCard(hand)} alt='temp' /></td>
                      </tr>
                    )
                  })}
                </div>
              </Wrapper>
            </Col>
          </Row>
        </>}

        <Row className='m-1 mt-3'>
          <Wrapper>
            <h1 className='title'>Live Game</h1><hr />
            {data?.sName &&
              <>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Group className='form-group'>
                    <Form.Label>
                      Select Status
                    </Form.Label>
                    <Controller
                      name='ePlayerState'
                      control={control}
                      render={({ field: { onChange, value = playerState?.[0], ref } }) => (
                        <Select
                          ref={ref}
                          value={value}
                          options={playerState}
                          className='react-select'
                          classNamePrefix='select'
                          closeMenuOnSelect={true}
                          onChange={(e) => {
                            onChange(e)
                          }}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                {data?.aParticipant?.filter(item => item?.eState === watch('ePlayerState')?.value)?.length !== 0 ?
                  (<>
                    <Col sm={4} className='m-auto live-profile'>
                      {data?.aParticipant?.filter(item => item?.eState === watch('ePlayerState')?.value)?.map(user => {
                        return (
                          <Col xl={4} lg={6} md={12} sm={12} xs={12}>
                            <Wrapper>
                              <div className='live-game-profile d-flex justify-content-between'>
                                <tr key={user?._id} className='d-flex flex-column inner-content'>
                                  <td className='state'>
                                    <span className='success'>{user?.eState}</span>
                                    <span className='profile'><img src={user?.sAvatar} alt={user?.sUserName} /></span>
                                  </td>
                                  <td>
                                    <div className='user-name'>
                                      <h2>{user?.sUserName} {user?.eUserType === 'ubot' && <FontAwesomeIcon icon={faRobot} size='xs' color='#f5365c' />}</h2>
                                      <span>Balance: {user?.nBalance || '0.00'}, Seat: {user?.nSeat || '0'}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <span>{data?.iUserTurn ? 'This user has TURN now' : ''}</span>
                                  </td>
                                  <td className='cards'>
                                    <span>User's Card</span>
                                  </td>
                                  <td className='user-pot'>
                                    <h3>User POT</h3>
                                    <table className='table'>
                                      <tbody>
                                        <tr>
                                          <td><span className='label'>Ante</span></td>
                                          <td><span className='value'>-</span> </td>
                                        </tr>
                                        <tr>
                                          <td><span className='label'>Preflop</span></td>
                                          <td><span className='value'>-</span> </td>
                                        </tr>
                                        <tr>
                                          <td><span className='label'>Turn</span></td>
                                          <td><span className='value'>-</span> </td>
                                        </tr>
                                        <tr>
                                          <td><span className='label'>River</span></td>
                                          <td><span className='value'>-</span> </td>
                                        </tr>
                                        <tr>
                                          <td><span className='label'>Slow Down</span></td>
                                          <td><span className='value'>-</span> </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </div>
                            </Wrapper>
                          </Col>
                        )
                      })}
                    </Col>
                  </>) : (watch('ePlayerState')?.value === '' || watch('ePlayerState')?.value === undefined) && <>
                    <Col sm={4} className='m-auto live-profile'>
                      {data?.aParticipant?.filter(user => user?.eState !== 'left' && user?.eState !== 'spectator')?.map((user, index) => {
                        return (
                          <Col xxl={4} xl={6} lg={6} md={12} sm={12} xs={12}>
                            <Wrapper>
                              <div className='live-game-profile d-flex justify-content-between'>
                                <tr key={user?._id} className='d-flex flex-column inner-content'>
                                  <td className='state'>
                                    <span className='success'>{user?.eState}</span>
                                    <span className='profile'><img src={user?.sAvatar} alt={user?.sUserName} /></span>
                                  </td>
                                  <td>
                                    <div className='user-name'>
                                      <h2>{user?.sUserName} {user?.eUserType === 'ubot' && <FontAwesomeIcon icon={faRobot} size='xs' color='#f5365c' />}</h2>
                                      <span>Balance: {user?.nBalance || '0.00'}, Seat: {user?.nSeat || '0'}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='current-user-turn'>{data?.iUserTurn === user?.iUserId ? 'This user has TURN now' : ''}</div>
                                  </td>
                                  <td className='cards'>
                                    <h3>User's Card</h3>
                                    {user?.aHoleCard?.length !== 0 ?
                                      <div className='user-cards'>
                                        {user?.aHoleCard?.map(holdCard => {
                                          return (
                                            <tr key={index}>
                                              <td className='poker-card'>{holdCard ? <img src={getCard(holdCard)} alt='temp' /> : ''}</td>
                                            </tr>
                                          )
                                        })}
                                      </div>
                                      : ''}
                                  </td>
                                  <td className='user-pot'>
                                    <h3>User POT</h3>
                                    <table className='table'>
                                      <tbody>
                                        <tr>
                                          <td><span className='label'>Ante</span></td>
                                          <td><span className='value'>{user?.oPot?.ante?.length > 0 ? user?.oPot?.ante?.map((ante) => ante)?.join(', ') : '-'}</span> </td>
                                        </tr>
                                        <tr>
                                          <td><span className='label'>Preflop</span></td>
                                          <td><span className='value'>{user?.oPot?.preFlop?.length > 0 ? user?.oPot?.preFlop?.map((preFlop) => preFlop)?.join(', ') : '-'}</span> </td>
                                        </tr>
                                        <tr>
                                          <td><span className='label'>Turn</span></td>
                                          <td><span className='value'>{user?.oPot?.turn?.length > 0 ? user?.oPot?.turn?.map((turn) => turn)?.join(', ') : '-'}</span> </td>
                                        </tr>
                                        <tr>
                                          <td><span className='label'>River</span></td>
                                          <td><span className='value'>{user?.oPot?.river?.length > 0 ? user?.oPot?.river?.map((river) => river)?.join(', ') : '-'}</span> </td>
                                        </tr>
                                        <tr>
                                          <td><span className='label'>Slow Down</span></td>
                                          <td><span className='value'>{user?.oPot?.showDown?.length > 0 ? user?.oPot?.showDown?.map((showDown) => showDown)?.join(', ') : '-'}</span> </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </div>
                            </Wrapper>
                          </Col>
                        )
                      })}
                    </Col>
                  </>
                }
              </>
            }
          </Wrapper>
        </Row>
      </> :
        <Wrapper><h1 className='text-danger'>This game may be finished</h1></Wrapper>
      }
    </>
  )
}

export default GameLogsSpect
