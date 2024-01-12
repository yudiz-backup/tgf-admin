import React, { useEffect, useRef, useState } from 'react'
import { toaster } from 'helper/helper'
import { deletePLO, getPLOList } from 'query/poker/poker.query'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import Drawer from 'shared/components/Drawer'
import CustomModal from 'shared/components/Modal'
import NLHListFilter from 'shared/components/NLHListFilter'
import OFCPokerList from 'shared/components/OFCPokerList'
import TopBar from 'shared/components/Topbar'
import { route } from 'shared/constants/AllRoutes'
import { OFCPokerListColumn } from 'shared/constants/TableHeaders'
import { appendParams, parseParams } from 'shared/utils'

const OFCManagement = () => {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))
    
    const query = useQueryClient()
    const navigate = useNavigate()

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            ePokerType: 'OFC',
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1),
            search: data?.search || '',
            nLimit: data?.nLimit || 10,
            eStatus: data.eStatus || 'y',
            eGameType: data?.eGameType || '',
            dateFrom: data.dateFrom || '',
            dateTo: data.dateTo || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            totalElement: data?.totalElement || 0
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(OFCPokerListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['OFCList', requestParams], () => getPLOList(requestParams), {
        select: (data) => data.data.data,
    })

    // DELETE OFC TABLE
    const { mutate } = useMutation(deletePLO, {
        onSuccess: (res) => {
            query.invalidateQueries('OFCList')
            toaster(res?.data?.message)
            setModal({ open: false, type: '', status: '' })
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

    const onDelete = (id, name) => {
        setModal({ open: true, type: 'delete-user', id })
    }

    function handleFilterChange (e) {
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', eGameType: e?.eGameType || '', dateFrom: e?.dateFrom || '', dateTo: e?.dateTo || '' })
    }

    useEffect(() => {
        document.title = 'OFC | Poker | PokerGold'
    }, [])
    return (
        <>
            <TopBar
                buttons={[
                    {
                        text: 'Add Table',
                        icon: 'icon-add',
                        type: 'primary',
                        clickEventName: 'createUserName',
                        btnEvent: () => navigate(route.addNLHTable, { state: location?.pathname })
                    }
                ]}
            />
            <div>
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
                    {data && data?.tables?.map((table, index) => {
                        return (
                            <OFCPokerList
                                key={table._id}
                                index={index}
                                table={table}
                                onDelete={onDelete}
                                location={location}
                            />
                        )
                    })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='PLO Poker List Filter'>
                        <NLHListFilter
                            filterChange={handleFilterChange}
                            closeDrawer={() => setModal({ open: false, type: '' })}
                            defaultValue={requestParams}
                        />
                    </Drawer>
                </DataTable>

                <CustomModal
                    open={modal.type === 'delete-user' && modal.open}
                    handleClose={() => setModal({ open: false, type: '' })}
                    handleConfirm={() => handleConfirmDelete(modal?.id)}
                    disableHeader
                    bodyTitle={location?.state?.endsWith('NLH') ? 'NLH Table' : location?.state?.endsWith('PLO') ? 'PLO Table' : 'OFC Table'}
                >
                    <article>
                        <h5>
                            <div>
                                Are you sure that you want to delete it?
                            </div>
                        </h5>
                    </article>
                </CustomModal>
            </div>
        </>
    )
}

export default OFCManagement
