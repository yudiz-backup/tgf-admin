import React, { useEffect } from 'react'
import { getNLHByID } from 'query/poker/poker.query'
import { Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'
import Wrapper from 'shared/components/Wrap'

const ViewNLH = () => {
  const { id } = useParams()
  const location = useLocation()

  const { watch, reset } = useForm({ mode: 'all' })

  // GET SPECIFIC NLH
  const { data } = useQuery('NLHDataByID', () => getNLHByID(id), {
    enabled: !!id,
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({
        ...data,
        sBanner: data?.sBanner,
        sThumbnail: data?.sThumbnail
      })
    }
  })

  useEffect(() => {
    document.title = location?.state?.endsWith('PLO') ? 'View PLO | Poker | PokerGold' : location?.state?.endsWith('OFC') ? 'View OFC | Poker | PokerGold' : 'View NLH | Poker | PokerGold'
  }, [location.state])

  return (
    <>
      <div className='view-card'>
        <Row>
          <Col xxl={5} xl={7} lg={8} md={10} className='view-nlh'>
            <Wrapper>
              <div className="banner">
                {watch('sBanner') && (
                  typeof (watch('sBanner')) !== 'string'
                    ? <div className='parent'>
                      <img src={URL.createObjectURL(watch('sBanner'))} alt='altImage' />
                      <div className='thumbnail'>
                        <img src={URL.createObjectURL(watch('sThumbnail'))} alt='altImage' />
                      </div>
                    </div>
                    : <div className='parent'>
                      <img src={watch('sBanner')} alt='altImage' />
                      <div className='thumbnail'>
                        <img src={watch('sThumbnail')} alt='altImage' />
                      </div>
                    </div>)}
              </div>
              <div className='profile'>
                <h1>{data?.sName}</h1>
                <p className='game-type'>{`${data?.ePokerType} / ${data?.eGameType}`}</p>

                <div className='m-3'>
                  <Wrapper>
                    <Row className='table-data p-3'>
                      <Col sm={3} xs={4} className="p-0 m-0">
                        <span className='data-value tournament-type'>{data?.nAnte || 0}</span>
                        <span className='data-title'>Ante</span>
                      </Col>
                      {location?.state?.endsWith('OFC') ? <>
                        <Col sm={3} xs={4} className="p-0 m-0">
                          <span className='data-value'>{data?.nBlind || 0}</span>
                          <span className='data-title'>Blind</span>
                        </Col>
                        <Col sm={3} xs={4} className="p-0 m-0">
                          <span className='data-value'>{`${data?.nTurnTime / 1000} sec` || 0}</span>
                          <span className='data-title'>Turn Time</span>
                        </Col>
                      </> :
                        <>
                          <Col sm={3} xs={4} className="p-0 m-0">
                            <span className='data-value'>{data?.nSmallBlind || 0}</span>
                            <span className='data-title'>Small Blind</span>
                          </Col>
                          <Col sm={3} xs={4} className="p-0 m-0">
                            <span className='data-value'>{data?.nBigBlind || 0}</span>
                            <span className='data-title'>Big Blind</span>
                          </Col>
                        </>
                      }
                      <Col sm={3} xs={4} className="p-0 m-0 mt-xxl-0 mt-xl-0 mt-md-0 mt-sm-0 mt-2">
                        <span className='data-value'>{data?.nMaxBot || 0}</span>
                        <span className='data-title'>Max Bot</span>
                      </Col>

                      <Col sm={4} xs={4} className="p-0 m-0 mt-2">
                        <span className='data-value'>{data?.nMinimumBuyIn || 0}</span>
                        <span className='data-title'>Minimum Buy In</span>
                      </Col>
                      <Col sm={4} xs={4} className="p-0 m-0 mt-2">
                        <span className='data-value'>{`${data?.nRake}%` || 0}</span>
                        <span className='data-title'>Rake</span>
                      </Col>
                      <Col sm={4} xs={4} className="p-0 m-0 mt-2">
                        <span className='data-value'>{data?.nMaximumBuyIn || 0}</span>
                        <span className='data-title'>Maximum Buy In</span>
                      </Col>
                    </Row>
                  </Wrapper>
                </div>
              </div>
            </Wrapper>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ViewNLH
