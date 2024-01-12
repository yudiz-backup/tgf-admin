import React, { useEffect, useRef, useState } from 'react';
import { toaster } from 'helper/helper';
import { deletePromoCode, getPromoCodeList } from 'query/promotion/promoCode/promoCode.query';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'shared/components/DataTable';
import Drawer from 'shared/components/Drawer';
import CustomModal from 'shared/components/Modal';
import PromoCodeList from 'shared/components/PromoCodeList';
import TopBar from 'shared/components/Topbar';
import { route } from 'shared/constants/AllRoutes';
import { PromoCodeListColumn } from 'shared/constants/TableHeaders';
import { appendParams, parseParams } from 'shared/utils';
import PromoCodeFilter from 'shared/components/PromoCodeFilter';

function PromoCodeManagement() {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    const navigate = useNavigate()
    const query = useQueryClient()

    function getRequestParams(e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 0,
            search: data?.search || '',
            nStart: +(data?.pageNumber?.[0] - 1) || 0,
            nLimit: data?.nLimit || 10,
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            totalElements: data?.totalElements || 0,
            eStatus: data?.eStatus || '',
            eValueType: data?.eValueType || '',
            dateFrom: data?.dateFrom || '',
            dateTo: data?.dateTo || '',
            isFTD: data?.isFTD || ''
        }
    }

    function getSortedColumns(adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(PromoCodeListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['promoCodeList', requestParams], () => getPromoCodeList(requestParams), {
        select: (data) => data.data.data,
    })

    // DELETE USER
    const { isLoading: deleteLoading, mutate } = useMutation(deletePromoCode, {
        onSuccess: (res) => {
            query.invalidateQueries('promoCodeList')
            toaster(res?.data?.message)
            setModal({ open: false, type: '', status: '' })
        }
    })

    function handleSort(field) {
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

    async function handleHeaderEvent(name, value) {
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

    function handlePageEvent(page) {
        setRequestParams({ ...requestParams, pageNumber: page, nStart: page - 1 })
        appendParams({ pageNumber: page, nStart: page - 1 })
    }

    const handleConfirmDelete = (id) => {
        mutate(id)
    }

    const onDelete = (id, name) => {
        setModal({ open: true, type: 'delete', id: id })
    }

    function handleFilterChange(e) {
        setRequestParams({ ...requestParams, eStatus: e?.eStatus || '', eValueType: e?.eValueType || '' })
    }

    useEffect(() => {
        document.title = 'PromoCode | Promotion | PokerGold'
    }, [])

    return (
        <>
            <TopBar
                buttons={[
                    {
                        text: 'Add Promo-Code',
                        icon: 'icon-add',
                        type: 'primary',
                        clickEventName: 'createUserName',
                        btnEvent: () => navigate(route.addPromoCode)
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
                    {data && data?.promocodes?.map((promoCode, index) => {
                        return (
                            <PromoCodeList
                                key={promoCode?._id}
                                index={index}
                                promoCode={promoCode}
                                onDelete={onDelete}
                            />
                        )
                    })}
                    <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='PromoCode List Filter'>
                        <PromoCodeFilter
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
                    bodyTitle='PromoCode'
                    isLoading={deleteLoading}
                >
                    <article>
                        <h5>
                            <div>
                                Are you sure that you want to delete this Promo-code?
                            </div>
                        </h5>
                    </article>
                </CustomModal>
            </div>
        </>
    )
}

export default PromoCodeManagement