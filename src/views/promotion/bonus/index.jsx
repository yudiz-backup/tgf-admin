import React, { useEffect, useRef, useState } from 'react';
import { getBonusCategory, getUserBonus } from 'query/promotion/promotion.query';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { BonusListColumn } from 'shared/constants/TableHeaders';
import { appendParams, parseParams } from 'shared/utils';
import DataTable from 'shared/components/DataTable';
import Drawer from 'shared/components/Drawer';
import BonusManagementList from 'shared/components/BonusManagementList';
import BonusListFilter from 'shared/components/BonusListFilter';
import Wrapper from 'shared/components/Wrap';
import { Col, Row } from 'react-bootstrap';

function BonusManagement () {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            nStart: (+data?.pageNumber?.[0] - 1) || 0,
            search: data?.search || '',
            nLimit: data?.nLimit || 10,
            iPromoCodeId: data.iPromoCodeId || '',
            eCategory: data.eCategory || '',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            dateFrom: data?.dateFrom || '',
            dateTo: data?.dateTo || '',
            dExpiredStartDate: data?.dExpiredStartDate || '',
            dExpiredEndDate: data?.dExpiredEndDate || ''
        }
    }

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [columns, setColumns] = useState(getSortedColumns(BonusListColumn, parsedData))
    const [modal, setModal] = useState({ open: false, type: '' })

    // List
    const { isLoading, isFetching, data } = useQuery(['bonusList', requestParams], () => getUserBonus(requestParams), {
        select: (data) => data.data.data,
    })

    // BONUS CATEGORY LIST
    const { data: bonusCategory } = useQuery(['bonusCategoryList', requestParams], () => getBonusCategory(requestParams), {
        select: (data) => data.data.data.bonusStat,
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
        setRequestParams({ ...requestParams, iPromoCodeId: e?.iPromoCodeId || '', eCategory: e?.eCategory || '', dateFrom: e?.dateFrom || '', dateTo: e?.dateTo, dExpiredStartDate: e?.dExpiredStartDate || '', dExpiredEndDate: e?.dExpiredEndDate || '' })
    }

    useEffect(() => {
        document.title = 'Bonus | Promotion | PokerGold'
    }, [])
    return (
        <>
            <div className='mb-3'>
                <Wrapper>
                    <h2 className='bonus-category'>Bonus Details</h2><hr />
                    <Row>
                        {bonusCategory?.length > 0 && bonusCategory?.sort((a, b) => b.nCount - a.nCount)?.map(category => {
                            return (
                                <Col key={category?._id?.eCategory} xxl={3} xl={4} md={6} sm={6} xs={12} className='g-3'>
                                    <Wrapper>
                                        <div className='bonus-category-data mb-2'>
                                            <span className='data-title'>Promo-code :</span>
                                            <span className='data-value'>{category?.sPromocode || 'No Promo-code'}</span>
                                        </div>
                                        <div className='bonus-category-data mb-2'>
                                            <span className='data-title'>Category :</span>
                                            <span className='data-value'>{category?._id?.eCategory || '-'}</span>
                                        </div>
                                        <div className='bonus-category-data mb-2'>
                                            <span className='data-title'>Total Bonus :</span>
                                            <span className='data-value'>{category?.nTotalBonus || 0}</span>
                                        </div>
                                        <div className='bonus-category-data mb-2'>
                                            <span className='data-title'>Total Used Bonus :</span>
                                            <span className='data-value'> {category?.nTotalUsedBonus || 0}</span>
                                        </div>
                                        <div className='bonus-category-data'>
                                            <span className='data-title'>Total Count :</span>
                                            <span className='data-value'>{category?.nCount || 0}</span>
                                        </div>
                                    </Wrapper>
                                </Col>
                            )
                        })}
                    </Row>
                </Wrapper>
            </div>

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
                {data && data?.bonus?.map((bonus, index) => {
                    return (
                        <BonusManagementList
                            bonus={bonus}
                            index={index}
                        />
                    )
                })}
                <Drawer isOpen={modal.type === 'filter' && modal.open} onClose={() => setModal({ open: false, type: '' })} title='Bonus List Filter'>
                    <BonusListFilter
                        filterChange={handleFilterChange}
                        closeDrawer={() => setModal({ open: false, type: '' })}
                        defaultValue={requestParams}
                    />
                </Drawer>
            </DataTable>
        </>
    )
}

export default BonusManagement