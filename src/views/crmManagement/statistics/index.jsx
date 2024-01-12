import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Loader } from 'shared/components/Loader';
import LoserStatistic from 'shared/components/LoserStatisitcList';
import TopBar from 'shared/components/Topbar';
import WinnerStatistic from 'shared/components/WinnerStatisticList';
import Wrapper from 'shared/components/Wrap';
import { appendParams, parseParams } from 'shared/utils';

function Statistics () {
    const location = useLocation()
    const parsedData = parseParams(location.search)
    const params = useRef(parseParams(location.search))

    useEffect(() => {
        document.title = 'Statistics'
    }, [])

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            pageNumber: +data?.pageNumber?.[0] || 1,
            search: data?.search || '',
            eValueType: 'profit',
            nLimit: +data?.nLimit?.[0] || 10,
            eStatus: data.eStatus || 'y',
            sort: data.sort || '',
            orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC',
            dStartDate: data.dStartDate || '',
            dEndDate: data.dEndDate || '',
        }
    }
    const [requestParams, setRequestParams] = useState(getRequestParams())
    const [modal, setModal] = useState({ open: false, type: '' })

    function handleFilterChange (e) {
        setRequestParams({ ...requestParams, dStartDate: e?.dStartDate || '', dEndDate: e?.dEndDate || '', eValueType: e?.eValueType || '', isWinners: e?.isWinners || true, nLimit: e?.pageSize?.value })
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
    return (
        <>
            {false ? (
                <Loader />
            ) : (
                <>
                    <TopBar
                        buttons={[
                            {
                                text: 'Filter',
                                icon: 'icon-filter-list',
                                type: 'primary',
                                clickEventName: 'handleHeaderEvent',
                                btnEvent: () => handleHeaderEvent('filter', true)
                            }
                        ]}
                    />
                    <Wrapper>
                        <WinnerStatistic
                            parsedData={parsedData}
                            requestParams={requestParams}
                            setRequestParams={setRequestParams}
                            handleHeaderEvent={handleHeaderEvent}
                            modal={modal}
                            setModal={setModal}
                            handleFilterChange={handleFilterChange}
                        />
                    </Wrapper>

                    <div className='mt-3'>
                        <Wrapper>
                            <LoserStatistic
                                parsedData={parsedData}
                                requestParams={requestParams}
                                setRequestParams={setRequestParams}
                                handleHeaderEvent={handleHeaderEvent}
                                modal={modal}
                                setModal={setModal}
                                handleFilterChange={handleFilterChange}
                            />
                        </Wrapper>
                    </div>
                </>
            )}
        </>
    )
}

export default Statistics