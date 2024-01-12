import React from 'react'
import { Dropdown } from 'react-bootstrap'
import moment from 'moment'
import { route } from 'shared/constants/AllRoutes'
import { useNavigate } from 'react-router-dom'
import TriggerTooltip from '../Tooltip/tooltip'

const KYCList = ({ user, index }) => {
    const navigate = useNavigate()
    return (
        <>
            <tr key={user._id} className={user.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user' data={user.sUserName || '-'} display={user.sUserName || '-'} onClick={() => navigate(route.viewUser(user?._id), { state: 'KYCDetail' })} />
                </td>
                <td>{user.sEmail || '-'}</td>
                <td>{user.sMobile || '-'}</td>
                <td><span className='single-line'>{user?.sState || '-'}</span></td>
                <td><span className={user?.eStatus === 'pending' ? 'warning' : user?.eStatus === 'rejected' ? 'danger' : user?.eStatus === 'approved' ? 'success' : (user?.eStatus === 'canceled' && 'danger')}>{user?.eStatus || '-'}</span></td>
                <td className="date-data-field">{moment(user.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>

                <td className='transaction-view'>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Item className='dropdown-datatable-items' onClick={() => navigate(route.viewUser(user._id), { state: 'KYCDetail' })}>
                            <div className='dropdown-datatable-items-icon'>
                                <i className='icon-visibility d-block' />
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </td>
            </tr>
        </>
    )
}

export default KYCList
