import React from 'react'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { route } from 'shared/constants/AllRoutes';
import TriggerTooltip from '../Tooltip/tooltip';

const BonusManagementList = ({ bonus, index }) => {
    const navigate = useNavigate()
    return (
        <>
            <tr key={bonus?._id}>
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user' data={bonus.sUserName || '-'} display={bonus.sUserName || '-'} onClick={() => navigate(route.viewUser(bonus?.iUserId), { state: bonus?.sUserName === '-' && 'no-user' })} /></td>
                <td>{bonus?.nBonus?.toFixed(2) || '0.00'}</td>
                <td>{bonus?.nUsed?.toFixed(2) || '0.00'}</td>
                <td>{bonus?.sStatus || '-'}</td>
                <td className='text-capitalize'>{bonus?.eCategory || '-'}</td>
                <td>{bonus?.iTransactionId || '-'}</td>
                <td>{bonus?.iPromoCodeId || '-'}</td>
                <td className='single-line'>{moment(bonus?.dExpiredAt)?.format('DD-MM-YYYY') || '-'}</td>
                <td>{moment(bonus?.dCreatedDate)?.format('DD-MM-YYYY') || '-'}</td>
            </tr>
        </>
    )
}

export default BonusManagementList
