import React, { useState } from 'react'
import moment from 'moment'
import { Modal } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { getUserBonusByID } from 'query/promotion/promotion.query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

const BonusList = ({ bonus, index, userData }) => {
    const [bonusID, setBonusID] = useState();
    const [show, setShow] = useState(false);

    // List
    useQuery(['userBonusByID'], () => getUserBonusByID(bonusID), {
        enabled: !!bonusID,
        select: (data) => data.data.data,
    })

    const handleClose = () => {
        setShow(false);
        setBonusID('')
    }
    const handleShow = (id) => {
        setShow(true)
        setBonusID(id)
    }
    return (
        <>
            <tr key={bonus._id} className={bonus.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td className='textWrapper'>{bonus.sPromoCode || '-'}</td>
                <td>{bonus.eCategory || '-'}</td>
                <td>{bonus.nBonus || '-'}</td>
                <td className='single-line'><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {bonus.nUsed?.toFixed(2) || '-'}</td>
                <td className='single-line'>{bonus?.sStatus}</td>
                <td className="date-data-field">{moment(bonus.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
                <td className="date-data-field">{moment(bonus.dExpiredAt).format('DD-MM-YYYY') || '-'}</td>
                <td className='bonus-view'>
                    <div className='dropdown-datatable-items-icon' onClick={() => handleShow(bonus?._id)}>
                        <i className='icon-visibility d-block' />
                    </div>
                </td>
            </tr>

            <Modal show={show} onHide={handleClose} className="bonus-view-modal">
                <Modal.Header className='modal-header' closeButton>
                    <Modal.Title>Bonus Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <h4>USER INFORMATION :-</h4>
                    <div><span>Name</span><span>{userData?.sUserName || '-'}</span></div>
                    <div><span>Category</span><span className={bonus?.eCategory === 'deposit' ? 'deposit' : bonus?.eCategory === 'referral' ? 'referral' : bonus?.eCategory === 'special' ? 'special' : 'welcome'}>{bonus?.eCategory || '-'}</span></div>
                    <div><span>Bonus Amount</span><span>{bonus?.nBonus || '-'}</span></div>
                    <div><span>Bonus Used</span><span><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {bonus?.nUsed.toFixed(2)}</span></div>
                    <div><span>Created At</span><span className='text-warning'>{moment(bonus.dCreatedDate).format('DD-MM-YYYY') || '-'}</span></div>
                    <div><span>Expiry</span><span className='text-danger'>{moment(bonus.dExpiredAt).format('DD-MM-YYYY') || '-'}</span></div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default BonusList
