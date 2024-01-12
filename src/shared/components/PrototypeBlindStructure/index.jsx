import React, { useMemo } from 'react'
import DataTable from '../DataTable'
import { BlindStructureColumn } from 'shared/constants/TableHeaders'
import { useLocation } from 'react-router-dom'
import { parseParams } from 'shared/utils'
import { Col, Row } from 'react-bootstrap'
import Wrapper from '../Wrap'

const PrototypeBlindStructure = ({ data }) => {
    const location = useLocation()
    const parsedData = parseParams(location.search)

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }
    const columns = useMemo(() => {
        return getSortedColumns(BlindStructureColumn, parsedData)
    }, [parsedData])

    return (
        <>
            {data && data?.aBlindStructure?.length > 0 ?
                <DataTable
                    header={{
                        left: {
                            rows: false
                        },
                        right: {
                            search: false,
                            filter: false
                        }
                    }}
                    columns={columns}
                >
                    {data?.aBlindStructure?.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item?.nLevel || 0}</td>
                                <td>{item?.nSmallBlind || 0}</td>
                                <td>{item?.nBigBlind || 0}</td>
                                <td>{item?.nAnte || 0}</td>
                            </tr>
                        )
                    })}
                </DataTable> : <>
                    <Row className='mt-4 pb-3 blind-structure-card'>
                        <Col xxl={4} xl={4} lg={6} md={12} sm={12} xs={12}>
                            <Wrapper>
                                <div className='blind-card'>
                                    <span className='card-header'>Blind</span>
                                </div>
                                <div className='card-content'>
                                    <Row>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oBlind?.nDefaultAmount || 0}</span>
                                            <span className='label'>Amount</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oBlind?.nMultiplier || 0}</span>
                                            <span className='label'>Multiplier</span>
                                        </Col>
                                    </Row>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={4} xl={4} lg={6} md={12} sm={12} xs={12} className='mt-lg-0 mt-md-3 mt-sm-3 mt-3 card-2'>
                            <Wrapper>
                                <div className='blind-card'>
                                    <span className='card-header'>Ante</span>
                                </div>
                                <div className='card-content'>
                                    <Row>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oAnte?.nDefaultAmount || 0}</span>
                                            <span className='label'>Amount</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oAnte?.nMultiplier || 0}</span>
                                            <span className='label'>Multiplier</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oAnte?.nLevelFrom || 0}</span>
                                            <span className='label'>Level Start</span>
                                        </Col>
                                    </Row>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={4} xl={4} lg={6} md={12} sm={12} xs={12} className='mt-xxl-0 mt-xl-0 mt-lg-3 mt-md-3 mt-sm-3 mt-3 card-3'>
                            <Wrapper>
                                <div className='blind-card'>
                                    <span className='card-header'>Re-Buy</span>
                                </div>
                                <div className='card-content'>
                                    <Row>
                                        <Col>
                                            <span className='value'>{`${data?.oDynamicControl?.oReBuy?.nLevelFrom || 0} - ${data?.oDynamicControl?.oReBuy?.nLevelTo || 0}` || 0}</span>
                                            <span className='label'>Level From - To</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oReBuy?.nFee || 0}</span>
                                            <span className='label'>Fee</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oReBuy?.nChips || 0}</span>
                                            <span className='label'>Chips</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oReBuy?.nLimit || 0}</span>
                                            <span className='label'>Limit</span>
                                        </Col>
                                    </Row>
                                </div>
                            </Wrapper>
                        </Col>
                        <Col xxl={4} xl={4} lg={6} md={12} sm={12} xs={12} className='mt-3 card-4'>
                            <Wrapper>
                                <div className='blind-card'>
                                    <span className='card-header'>Add On</span>
                                </div>
                                <div className='card-content'>
                                    <Row>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oAddOn?.nLevel || 0}</span>
                                            <span className='label'>Level</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oAddOn?.nFee || 0}</span>
                                            <span className='label'>Fee</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oAddOn?.nChips || 0}</span>
                                            <span className='label'>Chips</span>
                                        </Col>
                                        <Col>
                                            <span className='value'>{data?.oDynamicControl?.oAddOn?.nOffset || 0}</span>
                                            <span className='label'>Offset</span>
                                        </Col>
                                    </Row>
                                </div>
                            </Wrapper>
                        </Col>
                    </Row>
                </>
            }
        </>
    )
}

export default PrototypeBlindStructure
