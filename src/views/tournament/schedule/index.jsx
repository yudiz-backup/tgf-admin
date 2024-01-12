import React, { useEffect, useRef, useState } from 'react'
import { toaster } from 'helper/helper'
import { deleteSchedule, getScheduleList } from 'query/schedule/schedule.query'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import CustomModal from 'shared/components/Modal'
import ScheduleFilter from 'shared/components/ScheduleFilter'
import ScheduleList from 'shared/components/ScheduleList'
import { ScheduleListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'

const Schedule = () => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const query = useQueryClient()

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            search: data?.search || '',
            eStatus: data.eStatus || '',
            eState: data.eState || '',
            eType: data.eType || '',
            ePokerType: data.ePokerType || '',
            totalElement: data?.totalElement || 0,
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            dStartDate: data?.dStartDate || '',
            dEndDate: data?.dEndDate || '',
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(ScheduleListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['scheduleList', requestParams], () => getScheduleList(requestParams), {
        select: (data) => data.data.data,
    })

    // DELETE PROTOTYPE
    const { isLoading: deleteLoading, mutate } = useMutation(deleteSchedule, {
        onSuccess: (res) => {
            query.invalidateQueries('scheduleList')
            toaster(res?.data?.message)
            setModal({ open: false, type: '' })
        }
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

    const handleConfirmDelete = (id) => {
        mutate(id)
    }

    const onDelete = (id) => {
        setModal({ open: true, type: 'delete', id: id })
    }

    function handleFilterChange (e) {
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', eState: e?.eState || '', eType: e?.eType || '', dStartDate: e?.dStartDate || '', dEndDate: e?.dEndDate || '' })
    }

    useEffect(() => {
        document.title = 'Schedule | Tournament | PokerGold'
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
                        search: false,
                        filter: true
                    }
                }}
                sortEvent={handleSort}
                headerEvent={(name, value) => handleHeaderEvent(name, value)}
                totalRecord={data && (data?.count?.total || 0)}
                pageChangeEvent={handlePageEvent}
                isLoading={isLoading || isFetching}
                pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.nLimit }}
            >
                {data && data?.tournament?.map((schedule, index) => {
                    return (
                        <ScheduleList
                            schedule={schedule}
                            index={index}
                            setModal={setModal}
                            onDelete={onDelete}
                        />
                    )
                })}
                <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Schedule List Filter'>
                    <ScheduleFilter
                        filterChange={handleFilterChange}
                        closeDrawer={() => setModal({ open: false, type: '' })}
                        defaultValue={requestParams}
                    />
                </Drawer>
            </DataTable>

            <CustomModal
                open={modal.type === 'delete' && modal.open}
                handleClose={() => setModal({ open: false, type: '' })}
                handleConfirm={() => handleConfirmDelete(modal?.id)}
                disableHeader
                bodyTitle='Tournament'
                isLoading={deleteLoading}
                confirmValue={modal?.id}
            >
                <article>
                    <h5>
                        <div>
                        Are you sure that you want to delete this tournament?
                        </div>
                    </h5>
                </article>
            </CustomModal>
        </>
    )
}

export default Schedule
