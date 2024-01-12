import React from 'react'
import TriggerTooltip from '../Tooltip/tooltip'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'

const TDSManagementList = ({ tds, index }) => {
    const navigate = useNavigate()

    return (
        <>
            <tr key={tds?.iUserId}>
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user single-line' data={tds.sUserName || '-'} display={tds.sUserName || '-'} onClick={() => navigate(route.viewUser(tds?.iUserId))} />
                </td>
                <td>{tds?.eUserType || ''}</td>
                <td>{tds?.sPanNumber || ''}</td>
                <td><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {tds?.nRakeAmount?.toFixed(2) || '0.00'}</td>
                <td className="date-data-field">{moment(tds?.dCreatedDate).format('DD-MM-YYYY') || ''}</td>
                <td className='bonus-view'>
                    <div className='dropdown-datatable-items-icon' onClick={() => navigate(route?.viewUser(tds?.iUserId), { state: 'view-rake' })}>
                        <i className='icon-visibility d-block' />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default TDSManagementList
