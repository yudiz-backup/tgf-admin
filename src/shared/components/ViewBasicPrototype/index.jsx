import React from 'react'
import Wrapper from '../Wrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Col, Row } from 'react-bootstrap'
import moment from 'moment'

const ViewBasicPrototype = ({ id, data }) => {
    return (
        <Wrapper>
            <div className='profile_icon'>
                {data?.sThumbnail ? <img src={data?.sThumbnail} alt={`${data?.sName} profile`} /> : <FontAwesomeIcon icon={faUser} />}
            </div>
            <div className='prototype-data-name'>{data?.sName}</div>
            <div className='prototype-status'>{data?.eStatus === 'y' ? <span className='active-prototype'>Active</span> : <span className='inactive-prototype'>In-Active</span>}</div><hr className='mt-3' />

            <div className='details-card-data'>
                <Row className='details-data-row p-0 m-0'>
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Tournament Type</span>
                        <span className='data-value tournament-type'>{data?.eType || '-'}</span>
                    </Col>
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Poker Type</span>
                        <span className='data-value'>{data?.ePokerType || '-'}</span>
                    </Col>
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Entry Fee</span>
                        <span className='data-value'>{data?.oEntryFee?.nAmount || 0}</span>
                    </Col>
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Buy In</span>
                        <span className='data-value'>{data?.nBuyIn || '-'}</span>
                    </Col>
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Starting Chip</span>
                        <span className='data-value'>{data?.nStartingChip || '-'}</span>
                    </Col>
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Pool Amount</span>
                        <span className='data-value'>{data?.nPoolAmount || 0}</span>
                    </Col>
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Player Per Table</span>
                        <span className='data-value'>{data?.nPlayerPerTable || '-'}</span>
                    </Col>
                    {data?.eType === 'mtt' ?
                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                            <span className='data-title'>Entry Range</span>
                            <span className='data-value'>{`${data?.oMTTConfiguration?.oMTTEntries?.nMinimum} / ${data?.oMTTConfiguration?.oMTTEntries?.nMaximum}` || '0 / 0'}</span>
                        </Col> :
                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                            <span className='data-title'>Re-Spin Fee</span>
                            <span className='data-value'>{data?.oSpinUpConfiguration?.nReSpinFee || 0}</span>
                        </Col>
                    }
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Blind Up Interval</span>
                        <span className='data-value'>{`${data?.nBlindUp / 1000} sec` || '0 sec'}</span>
                    </Col>
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Re-entry Player Limit</span>
                        <span className='data-value'>{data?.nReEntryPerPlayer || '-'}</span>
                    </Col>
                    {data?.eType === 'mtt' &&
                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                            <span className='data-title'>Break (Level Interval & Duration)</span>
                            <span className='data-value'>{`${data?.oDynamicControl?.oBreak?.nLevelInterval || 0} & ${(data?.oDynamicControl?.oBreak?.nDuration / 1000) || 0} sec`}</span>
                        </Col>
                    }
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                        <span className='data-title'>Creation Date</span>
                        <span className='data-value'>{moment(data?.dCreatedDate).format('DD-MM-YYYY') || 0}</span>
                    </Col>
                </Row><hr className='mt-3' />

                {data?.eType === 'mtt' && <>
                    <Row className='details-data-row p-0 m-0 mt-3'>
                        <Col xxl={6} xl={6} lg={6} md={12} sm={12} className="p-2 m-0">
                            <span className='data-title re-buy'>Re-Buy :</span>

                            <Row className='re-buy-details-data-row p-3 m-0 mt-2 wrapper'>
                                <Col xxl={3} xl={4} lg={6} md={4} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Level From: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oReBuy?.nLevelFrom || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} md={4} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Level To: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oReBuy?.nLevelTo || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} md={4} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Fee: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oReBuy?.nFee || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} md={4} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Chips: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oReBuy?.nChips || '-'}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={6} md={6} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Limit per User: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oReBuy?.nLimit || '-'}</span>
                                </Col>
                            </Row>
                        </Col>

                        <Col xxl={6} xl={6} lg={6} md={12} sm={12} className="p-2 m-0">
                            <span className='data-title re-buy'>Add On :</span>

                            <Row className='re-buy-details-data-row p-3 m-0 mt-2 wrapper'>
                                <Col xxl={3} xl={4} lg={6} md={4} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Level: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oAddOn?.nLevel || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} md={4} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Fee: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oAddOn?.nFee || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} md={4} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Chips: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oAddOn?.nChips || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} md={4} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Offset: </span>
                                    <span className='data-value re-buy-value'>{data?.oDynamicControl?.oAddOn?.nOffset || '-'}</span>
                                </Col>
                                <Col xxl={6} xl={6} lg={6} md={6} sm={6} className="p-0 m-0 d-flex">
                                    <span className='data-title'>Duration: </span>
                                    <span className='data-value re-buy-value'>{`${data?.oDynamicControl?.oAddOn?.nDuration / 1000} sec` || '-'}</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>}
            </div>
        </Wrapper>
    )
}

export default ViewBasicPrototype
