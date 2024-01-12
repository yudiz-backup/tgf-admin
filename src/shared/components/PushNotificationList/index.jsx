import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import moment from 'moment'
import CustomModal from '../Modal'
import { useMutation, useQueryClient } from 'react-query'
import { deleteNotification } from 'query/push/push.query'
import { toaster } from 'helper/helper'

const PushNotificationList = ({ notification, index }) => {
    const query = useQueryClient()

    const [modal, setModal] = useState({ open: false, id: '' })

    // DELETE USER
    const { isLoading: deleteLoading, mutate } = useMutation((deleteId) => deleteNotification(deleteId), {
        onSuccess: (res) => {
            query.invalidateQueries('notificationList')
            toaster(res?.data?.message)
            setModal(false)
        },
        onError: (err) => {
            toaster(err.response.data.message, 'error')
            setModal(false)
        }
    })

    const onDelete = (id, title) => {
        setModal({ open: true, id: id })
    }

    const handleConfirmDelete = (id) => {
        mutate(id)
    }

    return (
        <>
            <tr key={notification._id} className={notification.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>{notification?.sTitle || '-'}</td>
                <td><span className='single-line'>{notification.sDescription || '-'}</span></td>
                <td>{notification.eStatusType || '-'}</td>
                <td>{notification?.nInactiveInterval}</td>
                <td>{notification?.eScheduleType || '-'}</td>
                <td className="date-data-field">{moment(notification.dScheduledAt).format('DD-MM-YYYY') || '-'}</td>
                <td className="date-data-field">{moment(notification.dUpdatedDate).format('DD-MM-YYYY') || '-'}</td>
                <td><span className={notification?.eStatus === 'Pending' ? 'warning' : notification?.eStatus === 'rejected' ? 'danger' : notification?.eStatus === 'Done' ? 'success' : (notification?.eStatus === 'canceled' && 'danger')}>{notification?.eStatus || '-'}</span></td>

                <td className='notification-view'>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Item className='dropdown-datatable-items' onClick={() => onDelete(notification._id, notification?.sTitle)}>
                            <div className='dropdown-datatable-items-icon'>
                                <i className='icon-delete d-block' />
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </td>
            </tr>

            <CustomModal
                open={modal.open}
                handleClose={() => setModal({ open: false, id: '' })}
                handleConfirm={handleConfirmDelete}
                disableHeader
                bodyTitle='Delete Notification?'
                isLoading={deleteLoading}
                confirmValue={modal?.id}
            >
                <article>
                    <h5>
                        <div>
                            Are you sure, you want to delete this notification?
                        </div>
                    </h5>
                </article>
            </CustomModal>
        </>
    )
}

export default PushNotificationList
