import React, { useState } from 'react'
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

const UserTransactionList = ({ id, transaction, index, userDetail }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <tr key={transaction._id} className={transaction.eStatus === 'd' && 'deleted-transaction'} >
                <td>{index + 1}</td>
                <td>{transaction._id || '-'}</td>
                <td>{userDetail?.eUserType === 'ubot' ? transaction?.iTableId || transaction.eSource : (transaction.eSource || '-')}</td>
                <td><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {transaction.nAmount.toFixed(2) || '-'}</td>
                <td><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {transaction.nClosingBalance.toFixed(2) || '-'}</td>
                <td><span className={`tag-button ${transaction.eStatus === "success" ? "success" : transaction.eStatus === "rejected" ? "danger" : transaction.eStatus === "pending" ? "warning" : "danger"}`}>{transaction.eStatus || '-'}</span></td>
                <td className='date-data-field'>{moment(transaction.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
                <td className='bonus-view'>
                    <div className='dropdown-datatable-items-icon' onClick={handleShow}>
                        <i className='icon-visibility d-block' />
                    </div>
                </td>
            </tr >

            <Modal show={show} onHide={handleClose} className="bonus-view-modal">
                <Modal.Header className='modal-header' closeButton>
                    <Modal.Title>Transaction Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <div><span>Transaction Status</span><span className={`tag-button ${transaction.eStatus === "success" ? "success" : transaction.eStatus === "rejected" ? "danger" : transaction.eStatus === "pending" ? "warning" : transaction.eStatus === "failed" && "danger"}`}>{transaction.eStatus || '-'}</span></div>
                    <div><span>UserName</span><span>{transaction?.sUserName || '-'}</span></div>
                    <div><span>Source</span><span>{userDetail?.eUserType === 'ubot' ? transaction?.iTableId || transaction?.eSource : (transaction?.eSource || '-')}</span></div>
                    <div><span>Description</span><span>{transaction?.sDescription || '-'}</span></div>
                    <div><span>Amount</span><span><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {transaction?.nAmount?.toFixed(2) || '-'}</span></div>
                    <div><span>Date</span><span>{moment(transaction.dCreatedDate).format('DD-MM-YYYY') || '-'}</span></div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UserTransactionList
