import React from 'react'
import DataTable from '../DataTable'
import Wrapper from '../Wrap';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownShortWide, faArrowUpShortWide, faGamepad, faIndianRupee } from '@fortawesome/free-solid-svg-icons';

const PrototypePrizeStructure = ({ data }) => {
    return (
        <>
            {data?.eType === 'mtt' && !data?.oWinning?.iTicketId ?
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
                >
                    <>
                        <tr className='structure-header'>
                            <th>Ranking</th>
                            {data?.oWinning?.oWinningRatio ? Object?.keys(data?.oWinning?.oWinningRatio)?.map((key, index) => {
                                return <th className='single-line'>{key?.split('-')?.join(' - ')}</th>
                            }) : '-'}
                        </tr>
                        {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10 - 11', '12 - 13', '14 - 15', '16 - 17', '18 - 20', '21 - 23', '24 - 27', '28 - 30', '31 - 35', '36 - 40', '41 - 45', '46 - 50'].map((ranking, rankingIndex) => {
                            return (
                                <tr key={rankingIndex}>
                                    <td>{ranking}</td>
                                    {data?.oWinning?.oWinningRatio ? Object.values(data?.oWinning?.oWinningRatio)?.map((value, valueIndex) => {
                                        if (rankingIndex < value.length) {
                                            const amount = value[rankingIndex].amount;
                                            return <td key={valueIndex}>{amount}%</td>;
                                        } else {
                                            return <td key={valueIndex}></td>;
                                        }
                                    }) : '-'}
                                </tr>)
                        })}
                    </>
                </DataTable>
                : <>
                    <Row>
                        <Col xxl={8} xl={12} lg={12} md={12}>
                            <Wrapper>
                                <Row className='details-data-row p-0 m-0'>
                                    <Col xxl={4} xl={4} lg={4} md={12} sm={12} className="p-0 m-0">
                                        <span className='data-title'>Maximum Amount <FontAwesomeIcon icon={faArrowUpShortWide} color='#338ef7' size='lg' /></span>
                                        <span className='data-value tournament-type'><FontAwesomeIcon icon={faIndianRupee} color='#338ef7' size='sm' /> {data?.oSpinUpConfiguration?.oSpinUpWinningRange?.nMaximum || '0.00'}</span>
                                    </Col>
                                    <Col xxl={4} xl={4} lg={4} md={12} sm={12} className="p-0 m-0">
                                        <span className='data-title'>Maximum Amount <FontAwesomeIcon icon={faArrowDownShortWide} color='#f7b750' size='lg' /></span>
                                        <span className='data-value tournament-type'><FontAwesomeIcon icon={faIndianRupee} color='#f7b750' size='sm' /> {data?.oSpinUpConfiguration?.oSpinUpWinningRange?.nMinimum || '0.00'}</span>
                                    </Col>
                                    <Col xxl={4} xl={4} lg={4} md={12} sm={12} className="p-0 m-0">
                                        <span className='data-title'>Offset <FontAwesomeIcon icon={faGamepad} color='rgb(255, 82, 82)' size='lg' /></span>
                                        <span className='data-value tournament-type'>{data?.oSpinUpConfiguration?.oSpinUpWinningRange?.nOffset || '0.00'}</span>
                                    </Col>
                                </Row>
                            </Wrapper>
                        </Col>
                    </Row>
                </>}
        </>
    )
}

export default PrototypePrizeStructure
