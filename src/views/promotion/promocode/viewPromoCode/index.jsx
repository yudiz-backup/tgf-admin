import React, { useEffect } from 'react'
import { getPromoCodeByID } from 'query/promotion/promoCode/promoCode.query'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import Wrapper from 'shared/components/Wrap'
import { Col, Row } from 'react-bootstrap'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'

const ViewPromoCode = () => {
  const { id } = useParams()

  // GET SPECIFIC PROTOTYPE
  const { data } = useQuery('promoCodeDataById', () => getPromoCodeByID(id), {
    enabled: !!id,
    select: (data) => data?.data?.data,
  })

  useEffect(() => {
    document.title = 'View PromoCode | Promotion | PokerGold'
  }, [])

  return (
    <>
      <Wrapper>
        <div className='details-card-data'>
          <Row className='details-data-row p-0 m-0'>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Promo-Code</span>
              <span className='data-value tournament-type'>{data?.sPromoCode || '-'}</span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Description</span>
              <span className='data-value'>{data?.sDescription || '-'}</span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Bonus</span>
              <span className='data-value'><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {data?.nValue?.toFixed(2) || '0.00'}</span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Capped Amount</span>
              <span className='data-value'>{data?.nCapped || '0.00'}</span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Is First Time Depositor?</span>
              <span className='data-value'>{data?.isFTD ? 'true' : 'false'}</span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Bonus Expires</span>
              <span className='data-value'>{`${data?.nValueValidity} Days` || '0 Days'}</span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Value Range (Minimum to Maximum)</span>
              <span className='data-value'>{`${data?.oAmountRange?.nMinimum || '-'} to ${data?.oAmountRange?.nMaximum || ''}`}</span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>No. of Time User can Claims</span>
              <span className='data-value'>{data?.nUserClaims || 0}</span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Promo-Code Validity from Start to End Date</span>
              <span className='data-value'>
                From <span className='from'>{moment(data?.oCodeValidity?.dStartAt).format('DD-MM-YYYY')}</span> To <span className='to'>{moment(data?.oCodeValidity?.dEndAt).format('DD-MM-YYYY')}</span>
              </span>
            </Col>
            <Col xxl={6} xl={12} className="details-data-column">
              <span className='data-title'>Created Date</span>
              <span className='data-value'>{moment(data?.dCreatedDate).format('DD-MM-YYYY') || 0}</span>
            </Col>
          </Row>
        </div>
      </Wrapper>
    </>
  )
}

export default ViewPromoCode
