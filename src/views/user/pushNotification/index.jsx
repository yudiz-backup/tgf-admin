import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import { PushNotificationListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'
import PushNotificationList from 'shared/components/PushNotificationList'
import { getNotificationList } from 'query/push/push.query'
import TopBar from 'shared/components/Topbar'
import { route } from 'shared/constants/AllRoutes'

const PushNotification = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))

  function getRequestParams (e) {
    const data = e ? parseParams(e) : params.current
    return {
      pageNumber: +data?.pageNumber?.[0] || 1,
      nStart: (+data?.pageNumber?.[0] - 1) || 0,
      nLimit: data?.nLimit || 10,
      search: data?.search || '',
      sort: data.sort || '',
      orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
      totalElements: data?.totalElements || 10
    }
  }

  function getSortedColumns (adminTableColumns, urlData) {
    return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(PushNotificationListColumn, parsedData))

  // List
  const { isLoading, isFetching, data } = useQuery(['notificationList', requestParams], () => getNotificationList(requestParams), {
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
      default:
        break
    }
  }

  function handlePageEvent (page) {
    setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
    appendParams({ pageNumber: page, nStart: page - 1 })
  }

  useEffect(() => {
    document.title = 'Push Notification | PokerGold'
  }, [])

  return (
    <div>
      <TopBar
        buttons={[
          {
            text: 'Add Notification',
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'createUserName',
            btnEvent: () => navigate(route.addNotification)
          }
        ]}
      />
      
      <DataTable
        columns={columns}
        header={{
          left: {
            rows: true
          },
          right: {
            search: true,
            filter: false
          }
        }}
        sortEvent={handleSort}
        headerEvent={(name, value) => handleHeaderEvent(name, value)}
        totalRecord={data && (data?.count?.totalData || 0)}
        pageChangeEvent={handlePageEvent}
        isLoading={isLoading || isFetching}
        pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
      >
        {data && data?.notifications?.map((notification, index) => {
          return (
            <PushNotificationList
              key={notification._id}
              index={index}
              notification={notification}
            />
          )
        })}
      </DataTable>
    </div>
  )
}

export default PushNotification
