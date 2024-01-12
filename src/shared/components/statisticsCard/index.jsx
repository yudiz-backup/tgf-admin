import React from 'react'
import { Card, Col } from 'react-bootstrap'


function StatisticsCard ({ icon, cardTitle, totalNumber, Table, xxl, lg, sm, md }) {
    return (
        <>
            <Col xxl={xxl ? xxl : 3} lg={lg ? lg : 6} sm={sm ? sm : 12} md={md ? md : 12} className='pb-3 pb-lg-0 card-box mb-2'>
                <Card className='statistics-card'>
                    <Card.Body className='statistics-card-body'>
                        <div className='statistics-card-header'>
                            <div className='statistics-card-icon'>{icon}</div>
                            <div className='statistics-card-title-group'>
                                <div className='statistics-card-title'>{cardTitle}</div>
                                {totalNumber && <div className='statistics-card-number'>{totalNumber}</div>}
                            </div>
                        </div>
                        {Table}
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

export default StatisticsCard