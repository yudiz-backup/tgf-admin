import React, { useEffect, useRef, useState } from 'react'
import { getKYCVerificationList } from 'query/user/user.query'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import KYCList from 'shared/components/KYCList'
import KycListFilters from 'shared/components/KycListFilters'
import { KYCVerificationListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'

const KycVerification = () => {
  const location = useLocation()
  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))

  function getRequestParams (e) {
    const data = e ? parseParams(e) : params.current
    return {
      pageNumber: +data?.pageNumber?.[0] || 1,
      nStart: (+data?.pageNumber?.[0] - 1) || 0,
      nLimit: data?.nLimit || 10,
      search: data?.search || '',
      eStatus: data.eStatus || 'pending',
      sort: data.sort || '',
      orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
      selectedState: [],
      totalElements: data?.totalElements || 10
    }
  }

  function getSortedColumns (adminTableColumns, urlData) {
    return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(KYCVerificationListColumn, parsedData))
  const [modal, setModal] = useState({ open: false, type: '' })

  // List
  const { isLoading, isFetching, data } = useQuery(['kycVerificationList', requestParams], () => getKYCVerificationList(requestParams), {
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

  function handlePageEvent (page) {
    setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
    appendParams({ pageNumber: page, nStart: page - 1 })
  }

  function handleFilterChange (e) {
    const selectedStates = e?.selectedState?.map(item => item.value)

    setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', selectedState: selectedStates || [], orderBy: 'ASC' })
  }

  useEffect(() => {
    document.title = 'KYC Verification | PokerGold'
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
        totalRecord={data && (data?.count?.totalData || 0)}
        pageChangeEvent={handlePageEvent}
        isLoading={isLoading || isFetching}
        pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
      >
        {data && data?.users?.map((user, index) => {
          return (
            <KYCList
              key={user._id}
              index={index}
              user={user}
            />
          )
        })}
        <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='KYC List Filter'>
          <KycListFilters
            filterChange={handleFilterChange}
            closeDrawer={() => setModal({ open: false, type: '' })}
            defaultValue={requestParams}
          />
        </Drawer>
      </DataTable>
    </>
  )
}

export default KycVerification
