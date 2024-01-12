import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { parseParams } from 'shared/utils'
import DataTable from '../DataTable'
import TriggerTooltip from '../Tooltip/tooltip'
import { route } from 'shared/constants/AllRoutes'
import { getPlayerGameInfoList } from 'query/logs/gameLogs/gameLogs.query'
import { PlayerGameInfoColumn } from 'shared/constants/TableHeaders'

const PlayerGameInfoTable = ({ id, isLive }) => {
    const parsedData = parseParams()
    const navigate = useNavigate()

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const columns = useMemo(() => getSortedColumns(PlayerGameInfoColumn, parsedData), [parsedData])

    // GET TABLE LOGS LIST
    const { data: playerGameInfo, isLoading, isFetching } = useQuery(['playerGameInfo', id], () => getPlayerGameInfoList(id, isLive && 'running'), {
        enabled: !!id,
        select: (data) => data?.data?.data,
    })

    return (
        <>
            <div className='mt-0'>
                <DataTable
                    columns={columns}
                    header={{
                        left: {
                            rows: true
                        },
                        right: {
                            search: false,
                            filter: false
                        }
                    }}
                    totalRecord={playerGameInfo && (playerGameInfo?.length || 0)}
                    isLoading={isLoading || isFetching}
                >
                    {playerGameInfo && playerGameInfo?.map((log, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <TriggerTooltip className='user single-line text-capitalize' data={log.iUserId || '-'} display={log.sUserName || '-'} onClick={() => navigate(route.viewUser(log?.iUserId))} />
                                </td>
                                <td className='text-capitalize'>{log?.sUserName || '-'}</td>
                                <td className='text-capitalize'>{log?.eUserType || '-'}</td>
                                <td>{(log?.nWinningAmount > 0 && log?.aStatistic?.length > 0 ? <span className='success'>{Math?.max(...log?.aStatistic?.map(item => item?.nAmount))?.toFixed(2)}</span> : <span className='warning'>0</span>)}</td>
                            </tr>
                        )
                    })}
                </DataTable>
            </div>
        </>
    )
}

export default PlayerGameInfoTable
