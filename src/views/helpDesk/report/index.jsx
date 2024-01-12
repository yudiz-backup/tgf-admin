import React from 'react'
import { getReportTitle, getTotalCount } from 'query/help/report/report.query'
import { Col, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import ReportManagement from 'shared/components/ReportManagement'
import Wrapper from 'shared/components/Wrap'

const Report = () => {
  // TOTAL COUNT
  const { data: totalCount } = useQuery('totalCount', getTotalCount, {
    select: (data) => data.data.data,
  })

  // REPORT TITLE LIST
  const { data: reportTitle } = useQuery('reportTitle', getReportTitle, {
    select: (data) => data.data.data,
  })
  return (
    <div>
      <Row>
        <Col sm={12}>
          <Row>
            <Col xxl={4} xl={6} lg={6} md={12} sm={12} className='report-state'>
              <div className='report-state-container'>
                <Wrapper>
                  <h1 className='report-header'>Report State</h1><hr />
                  <div className='state-item'>
                    {totalCount?.map((item, index) => {
                      return (
                        <span key={index}>
                          <div> <p className='state'>{item?.eState}</p> </div>
                          <div className='my-1'>
                            <p className={`state-count`}>
                              <span className={`${item?.eState === 'opened' ? 'open' : item?.eState === 'closed' ? 'closed' : 'reviewing'}`}>{item?.count}</span>
                            </p>
                          </div>
                        </span>
                      )
                    })}
                  </div>
                </Wrapper>
              </div>
            </Col>

            <Col xxl={4} xl={6} lg={6} md={12} sm={12} className='report-title mt-lg-0 mt-md-2 mt-sm-2 mt-2'>
              <Wrapper>
                <h1 className='report-header'>Report Title</h1><hr />
                <div className='state-item'>
                  {reportTitle?.map((item, index) => {
                    return (
                      <span key={index} className=''>
                        <div> <p className='state'>{item?._id}</p> </div>
                        <div className='my-1'>
                          <p className='title-count'>
                            {item?.counts?.opened ? <span className='open'>Opened: {item?.counts?.opened}</span> : ''} {item?.counts?.closed ? <span className='closed'>Closed: {item?.counts?.closed}</span> : ''} {item?.counts?.reviewing ? <span className='reviewing'>Reviewing: {item?.counts?.reviewing}</span> : ''}
                          </p>
                        </div>
                      </span>
                    )
                  })}
                </div>
              </Wrapper>
            </Col>
          </Row>
        </Col>

        <Col sm={12} className='mt-3'>
          <Wrapper>
            <ReportManagement />
          </Wrapper>
        </Col>
      </Row>
    </div>
  )
}

export default Report
