import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DataTable from 'shared/components/DataTable'
import { appendParams } from 'shared/utils'
import { WinnerStatisticColumn } from 'shared/constants/TableHeaders'
import { getWinnerStatistic } from 'query/statistics/statistics.mutation'
import Drawer from '../Drawer'
import WinnerStatisticFilter from '../WinnerStatisitcFilter'
import WinnerStatisticListData from '../WinnerStatisticListData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'

function WinnerStatistic ({ parsedData, requestParams, setRequestParams, handleHeaderEvent, modal, setModal, handleFilterChange }) {
    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [columns, setColumns] = useState(getSortedColumns(WinnerStatisticColumn, parsedData))
    const [winnerCredit, setWinnerCredit] = useState()
    const [winnerDebit, setWinnerDebit] = useState()
    const [winnerProfit, setWinnerProfit] = useState()

    const ICONS = {
        INDIAN_CURRENCY: <FontAwesomeIcon icon={faIndianRupeeSign} size='xs' />,
    }

    const CLASSNAMES = {
        CREDITED: 'credited',
        DEBITED: 'debited',
        PROFIT: 'profit'
    }

    // List
    const { isLoading, isFetching, data } = useQuery(['winnerStatisticList', requestParams], () => getWinnerStatistic(requestParams), {
        enabled: requestParams?.isWinners,
        select: (data) => data.data.data?.[0],
    })

    function handleSort (field) {
        let selectedFilter
        const filter = columns.map((data) => {
            if (data.internalName === field.internalName) {
                data.type = +data.type === 1 ? -1 : 1
                selectedFilter = data
            } else {
                data.type = 1
            }
            return data
        })
        setColumns(filter)
        const params = {
            ...requestParams,
            page: 0,
            sort: selectedFilter?.internalName,
            orderBy: selectedFilter.type === 1 ? 'ASC' : 'DESC'
        }
        setRequestParams(params)
        appendParams({
            sort: selectedFilter.type !== 0 ? selectedFilter.internalName : '',
            orderBy: selectedFilter.type
        })
    }

    function handlePageEvent (page) {
        setRequestParams({ ...requestParams, pageNumber: page })
        appendParams({ pageNumber: page })
    }

    useEffect(() => {
        const credited = data?.users?.reduce((a, c) => (a + c.nAmountIn), 0)
        setWinnerCredit(credited)
        const debited = data?.users?.reduce((a, c) => (a + c?.nAmountOut), 0)
        setWinnerDebit(debited)

        const profit = Math.abs(credited - debited)
        setWinnerProfit(profit)
    }, [data])

    return (
        <>
            <div>
                <div className='table-title'>
                    Top {requestParams?.nLimit} Winners, Credited [<span className={CLASSNAMES.CREDITED}>{ICONS.INDIAN_CURRENCY} {winnerCredit?.toFixed(2) || 0.00}</span>] - Debited [<span className={CLASSNAMES.DEBITED}>{ICONS.INDIAN_CURRENCY} {winnerDebit?.toFixed(2) || 0.00}</span>] = Profit [<span className={CLASSNAMES.PROFIT}>{ICONS.INDIAN_CURRENCY} {winnerProfit ? winnerProfit?.toFixed(2) : 0.00}</span>]
                </div>
                <DataTable
                    columns={columns}
                    header={{
                        left: {
                            rows: false
                        },
                        right: {
                            search: false,
                            filter: false
                        }
                    }}
                    sortEvent={handleSort}
                    headerEvent={(name, value) => handleHeaderEvent(name, value)}
                    totalRecord={data?.count?.totalData || 0}
                    pageChangeEvent={handlePageEvent}
                    isLoading={isLoading || isFetching}
                    pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
                >
                    {data && data?.users?.map((user, index) => {
                        return (
                            <WinnerStatisticListData
                                key={user._id}
                                index={index}
                                user={user}
                            />
                        )
                    })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Winner List Filter'>
                        <WinnerStatisticFilter
                            filterChange={handleFilterChange}
                            closeDrawer={() => setModal({ open: false, type: '' })}
                            defaultValue={requestParams}
                        />
                    </Drawer>
                </DataTable>
            </div>
        </>
    )
}

export default WinnerStatistic