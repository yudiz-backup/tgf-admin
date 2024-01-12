import React from 'react'
import { route } from 'shared/constants/AllRoutes';
import TriggerTooltip from '../Tooltip/tooltip';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const GameLogsList = ({ table, index, isLive }) => {
    const navigate = useNavigate()
    return (
        <>
            <tr key={table?._id}>
                <td>{index + 1}</td>
                <td><span className='link' onClick={() => navigate(route?.viewGameLogs(table?._id), { state: { state: table?.eStatus, isLive: isLive } })}>{table?._id}</span></td>
                <td>
                    <TriggerTooltip className='user single-line' data={table.sName || '-'} display={table.sName || '-'} onClick={() => navigate(route.viewNLH(table?.iProtoId))} />
                </td>
                <td>{table?.eGameType || '-'}</td>
                <td>{table?.ePokerType || '-'}</td>
                <td className='single-line'>{`${table?.nAnte || '0'}/ ${table?.nSmallBlind || ''}/ ${table?.nBigBlind || ''}/ ${table?.nMinimumBuyIn || ''}/ ${table?.nMaximumBuyIn || ''}` || '-'}</td>
                <td>{table?.nProfit || '0'}</td>
                <td>{table?.oSetting?.nRake || '0'}</td>
                <td>{table?.nVip || '0'}</td>
                <td><span className={table?.eStatus === 'Finished' ? 'danger' : 'running'}>{table?.eStatus || '-'}</span></td>
                <td className="date-data-field">{moment(table.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
                <td className='bonus-view'>
                    <div className='dropdown-datatable-items-icon' onClick={() => navigate(route?.viewGameLogs(table?._id), { state: { state: table?.eStatus, isLive: isLive } })}>
                        <i className='icon-visibility d-block' />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default GameLogsList
