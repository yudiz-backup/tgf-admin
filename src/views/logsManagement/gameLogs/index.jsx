import React, { useEffect, useRef, useState } from 'react'
import { getLiveFinishedGameLogs, getLiveGameLogs } from 'query/logs/gameLogs/gameLogs.query'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import GameLogsList from 'shared/components/GameLogsList'
import { GameLogsListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import GameLogsFilter from 'shared/components/GameLogsFilter'
import { useForm } from 'react-hook-form'

const GameLogs = () => {
  const location = useLocation()
  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))

  function getRequestParams (e) {
    const data = e ? parseParams(e) : params.current
    return {
      pageNumber: +data?.pageNumber?.[0] || 1,
      nStart: (+data?.pageNumber?.[0] - 1) || 0,
      nLimit: data?.nLimit || 10,
      dateFrom: data.dateFrom || '',
      dateTo: data.dateTo || '',
      sort: data.sort || '',
      search: data?.search || '',
      orderBy: 'ASC',
      ePokerType: data?.ePokerType || '',
      eStatus: data?.eStatus || 'running',
      totalElements: data?.totalElements || 0,
    }
  }

  function getSortedColumns (adminTableColumns, urlData) {
    return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const { handleSubmit, control, reset, getValues } = useForm({})

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(GameLogsListColumn, parsedData))
  const [modal, setModal] = useState({ open: false, type: '' })

  // Running List
  const { isLoading, isFetching, data } = useQuery(['gameLiveLogsList', requestParams], () => getLiveGameLogs(requestParams), {
    select: (data) => data.data.data,
  })

  // Finished List
  const { isLoading: finishedIsLoading, isFetching: finishedIsFetching, data: finishedLiveData } = useQuery(['gameLiveFinishedLogsList', requestParams], () => getLiveFinishedGameLogs(requestParams), {
    enabled: !!(getValues('eStatus')?.value === 'finished'),
    select: (data) => data.data.data,
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
      orderBy: selectedFilter.type === 1 ? 'ASC' : 'DESC',
      isEmailVerified: selectedFilter?.isEmailVerified
    }
    setRequestParams(params)
    appendParams({
      sort: selectedFilter.type !== 0 ? selectedFilter.internalName : '',
      orderBy: selectedFilter.type
    })
  }

  async function handleHeaderEvent (name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, nLimit: Number(value), pageNumber: 1 })
        appendParams({ nLimit: Number(value), pageNumber: 1 })
        break
      case 'search':
        setRequestParams({ ...requestParams, search: value, pageNumber: 1 })
        appendParams({ pageNumber: 1 })
        break
      case 'filter':
        setModal({ open: value, type: 'filter' })
        break
      default:
        break
    }
  }

  function handleFilterChange (e) {
    setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', ePokerType: e?.ePokerType || '', dateFrom: e?.dateFrom || '', search: e?.search || '', dateTo: e?.dateTo || '' })
  }

  function handlePageEvent (page) {
    setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
    appendParams({ pageNumber: page, nStart: page - 1 })
  }

  useEffect(() => {
    document.title = 'Game Logs | Logs | PokerGold'
  }, [])

  return (
    <>
      <DataTable
        columns={columns}
        header={{
          left: {
            rows: true
          },
          right: {
            search: true,
            filter: true
          }
        }}
        sortEvent={handleSort}
        headerEvent={(name, value) => handleHeaderEvent(name, value)}
        totalRecord={getValues('eStatus')?.value === 'finished' ? finishedLiveData && (finishedLiveData?.count?.totalData || 0) : data && (data?.count?.totalData || 0)}
        pageChangeEvent={handlePageEvent}
        isLoading={getValues('eStatus')?.value === 'running' ? (isLoading || isFetching) : (finishedIsLoading || finishedIsFetching)}
        pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
      >
        {getValues('eStatus')?.value === 'finished' ? finishedLiveData && finishedLiveData?.tables?.map((table, index) => {
          return (
            <GameLogsList
              key={table._id}
              index={index}
              table={table}
              isLive={false}
            />
          )
        }) :
          data && data?.tables?.map((table, index) => {
            return (
              <GameLogsList
                key={table._id}
                index={index}
                table={table}
                isLive={true}
              />
            )
          })
        }
        <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Game Logs List Filter'>
          <GameLogsFilter
            filterChange={handleFilterChange}
            closeDrawer={() => setModal({ open: false, type: '' })}
            defaultValue={requestParams}
            handleSubmit={handleSubmit}
            reset={reset}
            control={control}
          />
        </Drawer>
      </DataTable>
    </>
  )
}

export default GameLogs
