import React, { useState } from 'react'
import TriggerTooltip from '../Tooltip/tooltip';
import { route } from 'shared/constants/AllRoutes';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

const TransactionList = ({ index, transaction }) => {
    const navigate = useNavigate()

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <tr key={transaction?._id}>
                <td>{index + 1}</td>
                <td>{transaction?._id}</td>
                <td>{(transaction?.iTableId && transaction?.eSource !== 'tournament') ? <span onClick={() => navigate(route.viewGameLogs(transaction?.iTableId))} className='link'>{transaction?.iTableId}</span> : transaction?.eSource === 'bank' ? transaction?.eMedium : transaction?.eSource || '-'}</td>
                <td>
                    <TriggerTooltip className='user single-line' data={transaction.sUserName || '-'} display={transaction.sUserName || '-'} onClick={() => navigate(route.viewUser(transaction?.iUserId), { state: '/finance/transaction' })} />
                </td>
                <td className='single-line'>{transaction?.sEmail || '-'}</td>
                <td>{transaction?.sMobile || '-'}</td>
                <td>{transaction?.nAmount ? <><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {transaction?.nAmount?.toFixed(2)}</>  : '-'}</td>
                <td>{transaction?.nClosingBalance ? <><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {transaction?.nClosingBalance?.toFixed(2)}</> : '-'}</td>
                <td><span className={transaction?.eStatus === 'success' ? 'success' : 'danger'}>{transaction?.eStatus || '-'}</span></td>
                <td className="date-data-field">{moment(transaction.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
                <td className='bonus-view'>
                    <div className='dropdown-datatable-items-icon' onClick={handleShow}>
                        <i className='icon-visibility d-block' />
                    </div>
                </td>
            </tr>

            <Modal show={show} onHide={handleClose} className="transaction-view-modal">
                <Modal.Header className='modal-header' closeButton>
                    <Modal.Title>Transaction Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <div><span>Transaction Status</span><span className={`tag-button ${transaction.eStatus === "success" ? "success" : transaction.eStatus === "rejected" ? "danger" : transaction.eStatus === "pending" ? "warning" : transaction.eStatus === "failed" && "danger"}`}>{transaction.eStatus || '-'}</span></div>
                    <div><span>UserName</span><span className='value link' onClick={() => navigate(route?.viewUser(transaction?.iUserId))}>{transaction?.sUserName || '-'}</span></div>
                    <div><span>Source</span><span className='value'>{transaction?.eSource || '-'}</span></div>
                    {transaction?.eSource === 'table' && <div><span>Table ID</span><span className='value link' onClick={() => navigate(route.viewGameLogs(transaction?.iTableId))}>{transaction?.iTableId || '-'}</span></div>}
                    {transaction?.eSource !== 'bank' && <div><span>Description</span><span className='value'>{transaction?.sDescription || '-'}</span></div>}
                    <div><span>Amount</span><span><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {transaction?.nAmount?.toFixed(2) || '-'}</span></div>
                    <div><span>Date</span><span>{moment(transaction.dCreatedDate).format('DD-MM-YYYY') || '-'}</span></div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default TransactionList
