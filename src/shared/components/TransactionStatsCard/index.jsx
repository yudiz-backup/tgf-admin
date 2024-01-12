import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'

function TransactionStatsCard ({ Title, TotalMoney, TotalRequest, YearlyMoney, QuaterlyMoney, MonthlyMoney, TodayMoney, YearlyRequest, QuaterlyRequest, MonthlyRequest, TodayRequest, transactionCardNumber }) {
    return (
        <>
            <Card className='transaction-card'>
                <Card.Body className='transaction-card-body'>
                    <div className={`${transactionCardNumber} up-transaction-card-body`}>
                        <div className='transaction-title'>{Title}</div>
                        <div className='transaction-total-money'>₹ {TotalMoney}</div>
                        <div className='transaction-total-request'>{TotalRequest} Request</div>
                    </div>
                    <div className='down-transaction-card-body'>
                        <Row className='p-0 m-0'>
                            <Col className='p-0 m-0'>
                                <span className='transaction-time'>Yearly</span>
                                <span className='transaction-amount'>₹ {YearlyMoney}</span>
                                <span className='transaction-request'>{YearlyRequest} Request</span>
                            </Col>
                            <Col className='p-0 m-0'>
                                <span className='transaction-time'>Quaterly</span>
                                <span className='transaction-amount'>₹ {QuaterlyMoney}</span>
                                <span className='transaction-request'>{QuaterlyRequest} Request</span>
                            </Col>
                            <Col className='p-0 m-0'>
                                <span className='transaction-time'>Monthly</span>
                                <span className='transaction-amount'>₹ {MonthlyMoney}</span>
                                <span className='transaction-request'>{MonthlyRequest} Request</span>
                            </Col>
                            <Col className='p-0 m-0'>
                                <span className='transaction-time'>Today</span>
                                <span className='transaction-amount'>₹ {TodayMoney}</span>
                                <span className='transaction-request'>{TodayRequest} Request</span>
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default TransactionStatsCard