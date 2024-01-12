import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { route } from 'shared/constants/AllRoutes';

const UserWithdrawalList = ({ withdrawal, index }) => {
    const navigate = useNavigate()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <tr key={withdrawal?._id}>
        <td>{index + 1}</td>
        <td>{withdrawal?._id}</td>
        <td>{withdrawal?.eSource || '-'}</td>
        <td className='single-line'><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {withdrawal?.nAmount?.toFixed(2) || '0.00'}</td>
        <td className='single-line'><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {withdrawal?.nClosingBalance?.toFixed(2) || '0.00'}</td>
        <td><span className={withdrawal?.eStatus === 'success' ? 'success' : ''}>{withdrawal?.eStatus || '-'}</span></td>
        <td className="date-data-field">{moment(withdrawal?.dCreatedDate).format('DD-MM-YYYY')}</td>
        <td className="date-data-field">{moment(withdrawal?.dUpdatedDate).format('DD-MM-YYYY')}</td>
        <td className='bonus-view'>
          <div className='dropdown-datatable-items-icon' onClick={handleShow}>
            <i className='icon-visibility d-block' />
          </div>
        </td>
      </tr>

      <Modal show={show} onHide={handleClose} className="transaction-view-modal">
        <Modal.Header className='modal-header' closeButton>
          <Modal.Title>Withdrawal Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-body'>
          <div><span>Transaction Status</span><span className={`tag-button ${withdrawal?.eStatus === "success" ? "success" : withdrawal?.eStatus === "rejected" ? "danger" : withdrawal?.eStatus === "pending" ? "warning" : withdrawal?.eStatus === "failed" && "danger"}`}>{withdrawal?.eStatus || '-'}</span></div>
          <div><span>UserName</span><span className='value link' onClick={() => navigate(route?.viewUser(withdrawal?.iUserId))}>{withdrawal?.sUserName || '-'}</span></div>
          <div><span>Source</span><span className='value'>{withdrawal?.eSource || '-'}</span></div>
          {withdrawal?.eSource === 'table' && <div><span>Table ID</span><span className='value link' onClick={() => navigate(route.viewGameLogs(withdrawal?.iTableId))}>{withdrawal?.iTableId || '-'}</span></div>}
          {withdrawal?.eSource !== 'bank' && <div><span>Description</span><span className='value'>{withdrawal?.sDescription || '-'}</span></div>}
          <div><span>Amount</span><span><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {withdrawal?.nAmount?.toFixed(2) || '-'}</span></div>
          <div><span>Closing Balance</span><span><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {withdrawal?.nClosingBalance?.toFixed(2) || '-'}</span></div>
          <div><span>Date</span><span>{moment(withdrawal?.dCreatedDate).format('DD MMM, YYYY hh:mm:ss A') || '-'}</span></div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default UserWithdrawalList
