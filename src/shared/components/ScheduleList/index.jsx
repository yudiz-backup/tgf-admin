import React from 'react'
import { useNavigate } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
import TriggerTooltip from '../Tooltip/tooltip'
import moment from 'moment'
import { Dropdown, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from 'react-query'
import { updateSchedule } from 'query/schedule/schedule.query'
import { toaster } from 'helper/helper'

const ScheduleList = ({ schedule, onDelete, index, setModal }) => {
    const query = useQueryClient()
    const navigate = useNavigate()

    // Status
    const { mutate: statusMutation, } = useMutation(updateSchedule, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            setModal({ open: false, type: '' })
            query.invalidateQueries('scheduleList')
        }
    })

    const handleConfirmStatus = (e, id, status) => {
        statusMutation({ _id: id, eStatus: e?.target?.checked ? 'y' : 'n' })
    }
    
    return (
        <>
            <tr key={schedule._id} className={schedule.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user single-line' data={schedule._id || '-'} display={schedule.sName || '-'} onClick={() => navigate(route.viewSchedule(schedule._id), { state: schedule?.eState === 'running' && { isLive: true } })} />
                </td>
                <td className='single-line'>{schedule.sName || '-'}</td>
                <td>{schedule.nStartingChip?.toFixed(2) || '-'}</td>
                <td>{schedule.nPlayerPerTable?.toFixed(2) || '-'}</td>
                <td>{schedule.oEntryFee?.nAmount?.toFixed(2) || '-'}</td>
                <td>{schedule.eType || '-'}</td>
                <td>
                    {schedule.eStatus !== 'd' ? <Form.Check
                        type='switch'
                        name={schedule._id}
                        disabled={schedule?.eState !== 'running' || schedule.eType === 'mtt'}
                        className={schedule?.eState !== 'created' ? `d-inline-block me-1 disable` : 'd-inline-block me-1'}
                        checked={schedule.eStatus === 'y'}
                        onChange={(e) => handleConfirmStatus(e, schedule?._id)}
                    /> : <span className='delete-user'>Delete</span>}
                </td>
                <td>{(schedule.eState === 'canceled' ? <span className='cancel'>{schedule?.eState}</span> : schedule?.eState === 'completed' ? <span className='completed'>{schedule?.eState}</span> : schedule?.eState === 'running' ? <span className='running'>{schedule?.eState}</span> : schedule?.eState === 'created' ? <span className='created'>{schedule?.eState}</span> : <span className='scheduled'>{schedule?.eState}</span>) || '-'}</td>
                <td className="date-data-field">{moment(schedule.dScheduledAt).format('DD-MM-YYYY') || '-'}</td>
                <td className="date-data-field">{moment(schedule.dScheduledEndAt).format('DD-MM-YYYY') || '-'}</td>

                <td>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
                            <div className=''>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-datatable-menu'>
                            <Dropdown.Item className='dropdown-datatable-items view-item' onClick={() => navigate(route.viewSchedule(schedule._id), { state: schedule?.eState === 'running' && { isLive: true } })}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-visibility d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    View
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item className='dropdown-datatable-items delete-item' onClick={() => onDelete(schedule._id, schedule?.sName)}>
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

export default ScheduleList
