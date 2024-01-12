import React, { useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { route } from 'shared/constants/AllRoutes'
import { useNavigate } from 'react-router-dom'
import TriggerTooltip from '../Tooltip/tooltip'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { changeUserStatus } from 'query/user/user.mutation'
import { toaster } from 'helper/helper'
import { getUserById } from 'query/user/user.query'
import { useForm } from 'react-hook-form'
import CommonPasswordModal from '../CommonPasswordModal'

const BotList = ({ user, index, onDelete, onUpdate }) => {
    const navigate = useNavigate()
    const query = useQueryClient()
    const { reset, register, formState: { errors }, getValues } = useForm({ mode: 'all' })

    const [modal, setModal] = useState({ open: false, type: '' })

    //SPECIFIC BOT DATA
    useQuery(['botDataByID', modal], () => getUserById(modal?.type === 'update-modal' && modal?.id), {
        enabled: !!(modal?.type === 'update-modal'),
        onSuccess: (res) => {
            reset({
                nWinningRatio: res?.nWinningRatio
            })
        }
    })

    // Status
    const { mutate: statusMutation, } = useMutation(changeUserStatus, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            query.invalidateQueries('botList')
            setModal({ open: false, type: '' })
            reset({
                sPassword: ''
            })
        },
        onError: (err) => {
            toaster(err?.response?.data?.message, 'error')
            setModal({ open: false, type: '' })

            reset({
                sPassword: ''
            })
        }
    })

    const handleConfirmStatus = (e, id) => {
        setModal({ open: true, type: 'change-status', status: e?.target?.checked, id })
    }

    const handleChangeCredential = (id, status) => {
        statusMutation({ id, eStatus: status ? 'y' : 'n', sPassword: getValues('sPassword') })
    }

    return (
        <>
            <tr key={user._id} className={user.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>{user._id || '-'}</td>
                <td>
                    <TriggerTooltip className='user' data={user.sUserName || '-'} display={user.sUserName || '-'} onClick={() => navigate(route.viewUser(user?._id))} />
                </td>
                <td>{user.nWinningRatio || '-'}</td>
                <td>{user.nCredit.toFixed(2) || '-'}</td>
                <td>{user?.nDebit.toFixed(2) || '-'}</td>
                <td><span className={user?.nBotProfit === 0 ? 'danger' : 'profit'}>{user?.nBotProfit.toFixed(2) || '-'}</span></td>
                <td>{user?.nChips.toFixed(2) || '-'}</td>
                <td>{user?.sBotStatus || '-'}</td>
                <td>
                    {user.eStatus !== 'd' ? <Form.Check
                        type='switch'
                        name={user._id}
                        className='d-inline-block me-1'
                        checked={user.eStatus === 'y'}
                        onChange={(e) => handleConfirmStatus(e, user?._id)}
                    /> : <span className='delete-user'>Delete</span>}
                </td>
                <td className="date-data-field">{moment(user.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>

                <td>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
                            <div className=''>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-datatable-menu'>
                            <Dropdown.Item className='dropdown-datatable-items' onClick={() => navigate(route.viewUser(user._id))}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-visibility d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    View
                                </div>
                            </Dropdown.Item>
                            {
                                user.eStatus !== 'd' && (<>
                                    <Dropdown.Item className='dropdown-datatable-items edit' onClick={() => onUpdate(user?._id)}>
                                        <div className='dropdown-datatable-items-icon'>
                                            <i className='icon-create d-block' />
                                        </div>
                                        <div className='dropdown-datatable-row-text'>
                                            Update
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className='dropdown-datatable-items' onClick={() => { onDelete(user._id, user?.sUserName); reset({}) }}>
                                        <div className='dropdown-datatable-items-icon'>
                                            <i className='icon-delete d-block' />
                                        </div>
                                        <div className='dropdown-datatable-row-text'>
                                            Delete
                                        </div>
                                    </Dropdown.Item>
                                </>)
                            }

                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>

            <CommonPasswordModal
                bodyTitle={'Change Status'}
                confirmValue={getValues('sPassword')}
                errors={errors}
                handleConfirm={() => handleChangeCredential(modal?.id, modal?.status)}
                isTextArea={false}
                message={'Are you sure want to change status ?'}
                modal={modal.type === 'change-status' && modal.open}
                name={'sPassword'}
                register={register}
                setModal={() => setModal({ open: false, type: '' })}
            />
        </>
    )
}

export default BotList
