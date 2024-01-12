import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import Cards from '../Card'
import { faBitcoinSign, faCheck, faIndianRupeeSign, faXmark, faUsers, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BonusCard from '../BonusCard'

const UserStatistic = ({ id, userStatistic }) => {
    return (
        <>
            <Row>
                <Col xxl={4} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box' >
                    <Cards cardtitle='Total Withdrawal' cardtext={userStatistic?.nTotalActiveUsers || '0.00'} cardIcon={faIndianRupeeSign} className={'dashboard-card-icon-1'} />
                </Col>

                <Col xxl={4} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box' >
                    <Cards cardtitle='Withdrawal Approved' cardtext={userStatistic?.nTotalDeletedUsers || '0.00'} cardIcon={faCheck} className={'dashboard-card-icon-3'} />
                </Col>
                <Col xxl={4} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box' >
                    <Cards cardtitle='Withdrawal Rejected' cardtext={userStatistic?.nTotalEmailVerifiedUsers || '0.00'} cardIcon={faXmark} className={'dashboard-card-icon-6'} />
                </Col>
            </Row>

            <Row className='bouns-bar mt-2'>
                <Col xxl={3} lg={3} md={6} sm={6} className='bonus-card-main'>
                    <BonusCard
                        icon={<FontAwesomeIcon icon={faBitcoinSign} className="bonus-tds-icon" />}
                        cardTitle='Bonus Credit'
                        totalNumber={0}
                    />
                </Col>
                <Col xxl={3} lg={3} md={6} sm={6} className='bonus-card-main'>
                    <BonusCard
                        icon={<FontAwesomeIcon icon={faBitcoinSign} className="bonus-bot-icon" />}
                        cardTitle='Bonus Utilized'
                        totalNumber={0}
                    />
                </Col>
                <Col xxl={3} lg={3} md={6} sm={6} className='bonus-card-main'>
                    <BonusCard
                        icon={<FontAwesomeIcon icon={faBitcoinSign} className="bonus-game-table-icon" />}
                        cardTitle='VIP Point'
                        totalNumber={0}
                    />
                </Col>
                <Col xxl={3} lg={3} md={6} sm={6} className='bonus-card-main'>
                    <BonusCard
                        icon={<FontAwesomeIcon icon={faArrowUp} className="bonus-game-table-icon" />}
                        cardTitle='Total Deposit'
                        totalNumber={userStatistic?.nTotalActiveUsers || '0.00'}
                    />
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col xxl={3} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box dashboard-card-1' >
                    <Card className='dash-card'>
                        <Card.Body className='up-card-1'>
                            <div>
                                <Card.Text>{userStatistic?.nTotalUsers || '0.00'}</Card.Text>
                                <Card.Title>Deposit</Card.Title>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="dashboard-card-icon-1" />
                            </div>
                        </Card.Body>
                        <Row className='down-card-1 card-body'>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nTotalUserBalance?.toExponential(2) || '0.00'}</Card.Text>
                                <Card.Title>User</Card.Title>
                            </Col>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nUserPending?.toFixed(2) || '0.00'}</Card.Text>
                                <Card.Title>Admin</Card.Title>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xxl={3} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box dashboard-card-2' >
                    <Card className='dash-card'>
                        <Card.Body className='up-card-1'>
                            <div>
                                <Card.Text>{userStatistic?.nTotalUsers || '0.00'}</Card.Text>
                                <Card.Title>Table Amount In</Card.Title>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="dashboard-card-icon-2" />
                            </div>
                        </Card.Body>
                        <Row className='down-card-1 card-body'>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nTotalUserBalance?.toExponential(2) || '0.00'}</Card.Text>
                                <Card.Title>NLH</Card.Title>
                            </Col>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nUserPending?.toFixed(2) || '0.00'}</Card.Text>
                                <Card.Title>OMAHA</Card.Title>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xxl={3} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box dashboard-card-3' >
                    <Card className='dash-card'>
                        <Card.Body className='up-card-1'>
                            <div>
                                <Card.Text>{userStatistic?.nTotalUsers || '0.00'}</Card.Text>
                                <Card.Title>Table Amount Out</Card.Title>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="dashboard-card-icon-3" />
                            </div>
                        </Card.Body>
                        <Row className='down-card-1 card-body'>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nTotalUserBalance?.toExponential(2) || '0.00'}</Card.Text>
                                <Card.Title>NLH</Card.Title>
                            </Col>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nUserPending?.toFixed(2) || '0.00'}</Card.Text>
                                <Card.Title>OMAHA</Card.Title>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xxl={3} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box dashboard-card-4' >
                    <Card className='dash-card'>
                        <Card.Body className='up-card-1'>
                            <div>
                                <Card.Text>{userStatistic?.nTotalUsers || '0.00'}</Card.Text>
                                <Card.Title>Game Played</Card.Title>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="dashboard-card-icon-4" />
                            </div>
                        </Card.Body>
                        <Row className='down-card-1 card-body'>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nTotalUserBalance?.toExponential(2) || '0.00'}</Card.Text>
                                <Card.Title>NLH</Card.Title>
                            </Col>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nUserPending?.toFixed(2) || '0.00'}</Card.Text>
                                <Card.Title>OMAHA</Card.Title>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row className='mt-2'>
                <Col xxl={3} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box dashboard-card-1' >
                    <Card className='dash-card'>
                        <Card.Body className='up-card-1'>
                            <div>
                                <Card.Text>{userStatistic?.nTotalUsers || '0.00'}</Card.Text>
                                <Card.Title>Rake Paid</Card.Title>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="dashboard-card-icon-1" />
                            </div>
                        </Card.Body>
                        <Row className='down-card-1 card-body'>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nTotalUserBalance?.toExponential(2) || '0.00'}</Card.Text>
                                <Card.Title>NLH</Card.Title>
                            </Col>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nUserPending?.toFixed(2) || '0.00'}</Card.Text>
                                <Card.Title>OMAHA</Card.Title>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xxl={3} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box dashboard-card-2' >
                    <Card className='dash-card'>
                        <Card.Body className='up-card-1'>
                            <div>
                                <Card.Text>{userStatistic?.nTotalUsers || '0.00'}</Card.Text>
                                <Card.Title>Round Played</Card.Title>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="dashboard-card-icon-2" />
                            </div>
                        </Card.Body>
                        <Row className='down-card-1 card-body'>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nTotalUserBalance?.toExponential(2) || '0.00'}</Card.Text>
                                <Card.Title>NLH</Card.Title>
                            </Col>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nUserPending?.toFixed(2) || '0.00'}</Card.Text>
                                <Card.Title>OMAHA</Card.Title>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xxl={3} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box dashboard-card-3' >
                    <Card className='dash-card'>
                        <Card.Body className='up-card-1'>
                            <div>
                                <Card.Text>{userStatistic?.nTotalUsers || '0.00'}</Card.Text>
                                <Card.Title>TDS Paid</Card.Title>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="dashboard-card-icon-3" />
                            </div>
                        </Card.Body>
                        <Row className='down-card-1 card-body'>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nTotalUserBalance?.toExponential(2) || '0.00'}</Card.Text>
                                <Card.Title>NLH</Card.Title>
                            </Col>
                            <Col xxl={6} lg={6} sm={6} md={6} className="p-0">
                                <Card.Text>₹ {userStatistic?.nUserPending?.toFixed(2) || '0.00'}</Card.Text>
                                <Card.Title>OMAHA</Card.Title>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xxl={3} xl={4} lg={6} sm={6} md={6} className='pb-3 pb-lg-0 card-box dashboard-card-3' >
                </Col>
            </Row>
        </>
    )
}

export default UserStatistic
