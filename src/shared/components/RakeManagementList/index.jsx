import React from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { route } from 'shared/constants/AllRoutes';
import TriggerTooltip from '../Tooltip/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

const RakeManagementList = ({ rake, index }) => {
    const navigate = useNavigate()

    return (
        <>
            <tr key={rake?.iUserId}>
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user single-line' data={rake.sUserName || '-'} display={rake.sUserName || '-'} onClick={() => navigate(route.viewUser(rake?.iUserId))} />
                </td>
                <td>{rake?.eUserType || ''}</td>
                <td>{rake?.sPanNumber || ''}</td>
                <td><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {rake?.nRakeAmount?.toFixed(2) || '0.00'}</td>
                <td className="date-data-field">{moment(rake?.dCreatedDate).format('DD-MM-YYYY') || ''}</td>
                <td className='bonus-view'>
                    <div className='dropdown-datatable-items-icon' onClick={() => navigate(route?.viewUser(rake?.iUserId), { state: 'view-rake' })}>
                        <i className='icon-visibility d-block' />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default RakeManagementList
