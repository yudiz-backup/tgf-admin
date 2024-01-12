import React, { useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCertificate, faEllipsisVertical, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { route } from 'shared/constants/AllRoutes'
import { useNavigate } from 'react-router-dom'
import TriggerTooltip from '../Tooltip/tooltip'
import CustomModal from '../Modal'
import CommonInput from '../CommonInput'
import { useMutation, useQueryClient } from 'react-query'
import { changeUserStatus } from 'query/user/user.mutation'
import { toaster } from 'helper/helper'

const UserList = ({ user, index, onDelete, getValues, register, errors, reset }) => {
    const navigate = useNavigate()
    const query = useQueryClient()

    const [statusModal, setStatusModal] = useState({ open: false, id: '' })

    // Status
    const { mutate: statusMutation, } = useMutation(changeUserStatus, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            setStatusModal({ open: false, type: '' })
            query.invalidateQueries('userList')
            reset({
                sPassword: ''
            })
        }
    })

    const handleConfirmStatus = (e, id) => {
        setStatusModal({ open: true, type: 'change-status', status: e?.target?.checked, id })
    }

    const handleChangeCredential = (id, status) => {
        statusMutation({ id, eStatus: status ? 'y' : 'n', sPassword: getValues('sPassword') })
    }

    return (
        <>
            <tr key={user._id} className={user.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user' data={user.sUserName || '-'} display={user.sUserName || '-'} onClick={() => navigate(route.viewUser(user?._id))} />
                </td>
                <td className='single-line'>{(user?.isEmailVerified === true ? <span className='d-flex justify-content-center'>{user.sEmail}<span className='verified'><FontAwesomeIcon icon={faCertificate} /></span></span> : <>{user.sEmail}<span className='not-verified'><FontAwesomeIcon icon={faCertificate} /></span></>) || '-'}</td>
                <td className='single-line'>{(user.isMobileVerified === true ? <span className='d-flex justify-content-center'>{`+91-${user.sMobile}`}<span className='verified'><FontAwesomeIcon icon={faCertificate} /></span></span> : <>{user.sMobile}<span className='not-verified'><FontAwesomeIcon icon={faCertificate} /></span></>) || '-'}</td>
                <td><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {user.nChips.toFixed(2) || '-'}</td>
                <td className='single-line'>{user?.sState}</td>
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
                                    <Dropdown.Item className='dropdown-datatable-items edit' onClick={() => navigate(route.editUser(user._id))}>
                                        <div className='dropdown-datatable-items-icon'>
                                            <i className='icon-create d-block' />
                                        </div>
                                        <div className='dropdown-datatable-row-text'>
                                            Update
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className='dropdown-datatable-items' onClick={() => onDelete(user._id, user?.sUserName)}>
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

            <CustomModal
                open={statusModal.type === 'change-status' && statusModal.open}
                handleClose={() => setStatusModal({ open: false, type: '' })}
                handleConfirm={() => handleChangeCredential(statusModal?.id, statusModal?.status)}
                disableHeader
                bodyTitle='Change Status'
                confirmValue={getValues('sPassword')}
            >
                <article>
                    <h5>
                        <div>
                            Are you sure want to change status ?
                        </div>
                    </h5>
                    <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sPassword && 'error'}`}
                        name='sPassword'
                        placeholder='Enter password'
                        onChange={(e) => {
                            e.target.value =
                                e.target.value?.trim() &&
                                e.target.value.replace(/^[0-9]+$/g, '')
                        }}
                    />
                </article>
            </CustomModal>
        </>
    )
}

export default UserList
