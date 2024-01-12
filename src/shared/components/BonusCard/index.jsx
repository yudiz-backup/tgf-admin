import React from 'react'
import Card from 'react-bootstrap/Card'
import './style.scss';

export default function BonusCard ({ icon, cardTitle, totalNumber, Table, xxl, lg, sm, md }) {
    return (
        <Card className='bonus-card'>
            <Card.Body className='bonus-card-body'>
                <div className='bonus-card-header'>
                    <div className='bonus-card-icon'>{icon}</div>
                    <div className='bonus-card-title-group'>
                        <div className='bonus-card-title'>{cardTitle}</div>
                        {totalNumber && <div className='bonus-card-number'>{totalNumber}</div>}
                    </div>
                </div>
            </Card.Body>
        </Card>

    )
}
