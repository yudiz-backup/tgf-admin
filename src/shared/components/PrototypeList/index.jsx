import React from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { route } from 'shared/constants/AllRoutes'
import { useNavigate } from 'react-router-dom'
import TriggerTooltip from '../Tooltip/tooltip'

const PrototypeList = ({ prototype, index, onDelete, statusMutation }) => {
    const navigate = useNavigate()
    
    const handleConfirmStatus = (status, id) => {
        statusMutation({ _id: id, eStatus: status ? 'y' : 'n' })
    }
    return (
        <>
            <tr key={prototype._id} className={prototype.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user single-line' data={prototype.sName || '-'} display={prototype.sName || '-'} onClick={() => navigate(route.viewPrototype(prototype?._id))} />
                </td>
                <td>{prototype.nStartingChip?.toFixed(2) || '-'}</td>
                <td>{prototype.nPlayerPerTable || '-'}</td>
                <td>{prototype.nBuyIn?.toFixed(2) || '-'}</td>
                <td>{prototype.oEntryFee?.nAmount?.toFixed(2) || '-'}</td>
                <td>{prototype.eType || '-'}</td>
                <td>{prototype.ePokerType || '-'}</td>
                <td>
                    {prototype.eStatus !== 'd' ? <Form.Check
                        type='switch'
                        name={prototype._id}
                        className='d-inline-block me-1'
                        checked={prototype.eStatus === 'y'}
                        onChange={(e) => handleConfirmStatus(e?.target?.checked, prototype?._id)}
                    /> : <span className='delete-prototype'>Delete</span>}
                </td>
                <td className="date-data-field">{moment(prototype.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>

                <td>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
                            <div className=''>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-datatable-menu'>
                            <Dropdown.Item className='dropdown-datatable-items schedule-item' onClick={() => navigate(route.editSchedule(prototype._id))}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-refresh d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    Schedule
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item className='dropdown-datatable-items view-item' onClick={() => navigate(route.viewPrototype(prototype._id))}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-visibility d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    View
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item className='dropdown-datatable-items delete-item' onClick={() => onDelete(prototype._id, prototype?.sUserName)}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-delete d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    Delete
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        </>
    )
}

export default PrototypeList
