import React, { useState } from 'react'
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { route } from 'shared/constants/AllRoutes';
import TriggerTooltip from '../Tooltip/tooltip';
import DataTable from '../DataTable';

const ScheduleTournamentInfoList = ({ key, index, user }) => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <tr key={user?._id}>
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user single-line' data={user?.sUserName || '-'} display={user?.sUserName || '-'} onClick={() => navigate(route.viewUser(user?.iUserId))} />
                </td>
                <td>{user?.eState === 'finished' ? <span className='text-danger'>Game Not started || Finished</span> : <span className='text-danger'>{user?.iCurrentTableId}</span> || '-'}</td>
                <td>{user?.eState || '-'}</td>
                <td>{moment(user?.dCreatedDate)?.format('DD-MM-YYYY') || '-'}</td>
                <td className=''>
                    <div className='dropdown-datatable-items-icon' onClick={handleShow}>
                        <i className='icon-visibility d-block' />
                    </div>
                </td>
            </tr>

            <Modal show={show} onHide={handleClose} className="schedule-view-modal" size='xl' id={'scoreBoard'}>
                <Modal.Header className='modal-header' closeButton>
                    <Modal.Title>Tournament ScoreBoard</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <DataTable
                        header={{
                            left: {
                                rows: false
                            },
                            right: {
                                search: false,
                                filter: false
                            }
                        }}
                    >
                        <>
                            <tr className='table-header'>
                                <th>Table ID</th>
                                <th>Tournament Level</th>
                                <th>Bet Amount</th>
                                <th>Closing Balance</th>
                                <th>Winning Amount</th>
                            </tr>
                            {user?.aScoreBoard?.map((table) => {
                                return (
                                    <tr key={table?._id} className='table-row'>
                                        <td>{table?.iTableId || '-'}</td>
                                        <td>{table?.nTournamentLevel || '0'}</td>
                                        <td>{table?.nBetAmount?.toFixed(2) || '0.00'}</td>
                                        <td>{table?.nClosingBalance?.toFixed(2) || '0.00'}</td>
                                        <td>{table?.nWinningAmount || '0'}</td>
                                    </tr>
                                )
                            })}
                        </>
                    </DataTable>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ScheduleTournamentInfoList
