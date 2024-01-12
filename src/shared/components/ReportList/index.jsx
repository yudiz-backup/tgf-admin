import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import TriggerTooltip from '../Tooltip/tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap'
import { faEllipsisVertical, faUser } from '@fortawesome/free-solid-svg-icons'
import { route } from 'shared/constants/AllRoutes'
import { getSpecificReport } from 'query/help/report/report.query'
import { profile } from 'query/profile/profile.query'

const ReportList = ({ user, index, reset }) => {
    const navigate = useNavigate()

    const [modal, setModal] = useState({ open: false, id: '' })

    const { data: profileData } = useQuery('getProfile', profile, {
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            reset({
                sUserName: data?.sUserName,
                sFullName: data?.sFullName,
                sEmail: data?.sEmail,
                sMobile: data?.sMobile,
                eGender: data?.eGender
            })
        },
    })

    // GET USER STATISTIC
    const { data: specificReport } = useQuery('reportDataByID', () => getSpecificReport(modal?.id), {
        enabled: !!(modal?.type === 'view-report' && modal?.id),
        select: (data) => data?.data?.data,
    })

    return (
        <>
            <tr key={user._id} className={user.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>{user?.sTitle || '-'}</td>
                <td>
                    <TriggerTooltip className='user' data={user.sUserName || '-'} display={user.sUserName || '-'} onClick={() => navigate(route.viewUser(user?.iUserId))} />
                </td>
                <td>{user.iTableId || '-'}</td>
                <td className='single-line'>{user?.eState}</td>
                <td className="date-data-field">{moment(user.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>

                <td>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
                            <div className=''>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-datatable-menu'>
                            <Dropdown.Item className='dropdown-datatable-items' onClick={() => setModal({ open: true, type: 'view-report', id: user?._id, userName: user?.sUserName, tableID: user?.iTableId })}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-visibility d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    View
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item className='dropdown-datatable-items' onClick={() => navigate(route.editReport(user?._id, user?.sUserName))}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-create d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    Edit
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>

            {modal?.type === 'view-report' &&
                <Form className='step-one' autoComplete='off'>
                    <Modal show={modal?.open} onHide={() => setModal({ open: false, type: '' })} id='view-report' size='lg'>
                        <Modal.Header closeButton>
                            <Modal.Title className='add-bonus-header'>View User's Report</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col xxl={6} xl={6} lg={6} md={12} sm={12}>
                                    <div className='report-title'>
                                        <span className='title'>{specificReport?.sTitle}</span>
                                        <span className='state'>
                                            <span>{specificReport?.eState}</span>
                                        </span>
                                    </div>
                                    <div className='report-detail'>
                                        <Row className='mt-3'>
                                            <Col sm={12} className='content'>
                                                <span className='name'>UserName</span>
                                                <span className='user-value' onClick={() => navigate(route?.viewUser(specificReport?.iUserId))}>
                                                    {modal?.userName}
                                                </span>
                                            </Col>
                                            <Col sm={12} className='content'>
                                                <span className='name'>Table ID</span>
                                                <span className='value'>{modal?.tableID}</span>
                                            </Col>
                                            <Col sm={12} className='content'>
                                                <span className='name'>Description</span>
                                                <span className='value'>{specificReport?.sDescription}</span>
                                            </Col>
                                            <Col sm={12} className='content'>
                                                <span className='name'>Date</span>
                                                <span className='value'>{moment(specificReport?.dCreatedDate)?.format('DD MMM YYYY, hh:mm:ss A')}</span>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col xxl={6} xl={6} lg={6} md={12} sm={12} className='mt-lg-0 mt-md-3 mt-sm-3'>
                                    <div className='report-title'>
                                        <span className='title'>Discussion Chat</span>
                                    </div>
                                    <div className='report-discussion'>
                                        {specificReport?.aDiscussion?.length !== 0 ? specificReport?.aDiscussion?.map(element => {
                                            return (
                                                <>
                                                    <div className='d-flex mb-2'>
                                                        <div className='report-comment-user'><div><FontAwesomeIcon icon={faUser} /></div><div className='report-comment-user-name'>{profileData?.sUserName}</div></div>
                                                        <div>
                                                            <div className='report-comment-message'>{element?.sMessage}</div>
                                                            {/* <div className='report-comment-state'>{element?.sOldState} 	&rarr; {element?.sNewState}</div> */}
                                                            <div className='report-comment-date'>{moment(element?.dCreatedDate).format('DD-MM-YYYY, hh:MM A') || '-'}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }) : <span className='empty-msg'>No Discussion Yet</span>}
                                    </div>
                                </Col>
                                <Col xxl={6} xl={6} lg={6} md={12} sm={12} className='mt-lg-3 mt-md-4 mt-sm-4'>
                                    <div className='report-title'>
                                        <span className='title'>Media Gallery</span>
                                    </div>
                                    <div className='report-media'>
                                        {specificReport?.aMedia?.length > 0 ?
                                            <Row>
                                                {specificReport?.aMedia?.map(media => {
                                                    return (
                                                        <Col lg={3} sm={12}>
                                                            <tr key={media?._id}>
                                                                <div className="document-preview-group">
                                                                    {media?.sUrl && (
                                                                        typeof (media?.sUrl) !== 'string'
                                                                            ? <div className="document-preview"> <img src={URL.createObjectURL(media?.sUrl)} alt='altImage' /> </div>
                                                                            : <div className="document-preview"><img src={media?.sUrl} alt='altImage' /> </div>)}
                                                                </div>
                                                            </tr>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        : <span className='empty-msg'>No Media Gallery Available</span>}
                                    </div>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setModal({ open: false, type: '' })}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form>
            }
        </>
    )
}

export default ReportList
