import React from 'react'
import { faEllipsisVertical, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toaster } from 'helper/helper'
import moment from 'moment'
import { editBanner, viewBanner } from 'query/help/banner/banner.query'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const BannerList = ({ banner, index, onDelete, modal, setModal, setBannerID, bannerID }) => {
    const query = useQueryClient()

    const { watch, reset } = useForm({ mode: 'all' })

    // Status
    const { mutate: statusMutation, } = useMutation((data) => editBanner(data), {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            setModal({ open: false, type: '' })
            query.invalidateQueries('bannerList')
        }
    })

    // GET SPECIFIC BANNER
    const { data: specificBanner } = useQuery('bannerDataById', () => viewBanner(bannerID), {
        enabled: !!bannerID,
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            reset({
                sUrl: data?.sUrl,
                sName: data?.sName,
                eStatus: data?.eStatus
            })
            setBannerID('')
        }
    })

    const handleView = (id) => {
        setModal({ open: true, type: 'view' })
        setBannerID(id)
    }

    const handleConfirmStatus = (e, id) => {
        statusMutation({ id, eStatus: e?.target?.checked ? 'y' : 'n' })
    }

    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td>
                    {banner?.sUrl ? (
                        typeof (banner?.sUrl) !== 'string'
                            ? <div className="document-preview"> <img src={URL.createObjectURL(banner?.sUrl)} alt='altImage' onClick={() => handleView(banner?._id)} /> </div>
                            : <div className="document-preview"><img src={banner?.sUrl} alt='altImage' onClick={() => handleView(banner?._id)} /> </div>) :
                        <FontAwesomeIcon icon={faUser} size='lg' className='user-svg' onClick={() => handleView(banner?._id)} />
                    }
                </td>
                <td>{banner?.eRoute || '-'}</td>
                <td>
                    {banner.eStatus !== 'd' ? <Form.Check
                        type='switch'
                        name={banner._id}
                        className='d-inline-block me-1'
                        checked={banner.eStatus === 'y'}
                        onChange={(e) => handleConfirmStatus(e, banner?._id)}
                    /> : <span className='delete-user'>Delete</span>}
                </td>
                <td className="date-data-field">{moment(banner.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
                <td>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
                            <div className=''>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-datatable-menu'>
                            <Dropdown.Item className='dropdown-datatable-items view' onClick={() => handleView(banner?._id)}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-visibility d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    View
                                </div>
                            </Dropdown.Item>
                            {
                                banner.eStatus !== 'd' && (<>
                                    <Dropdown.Item className='dropdown-datatable-items delete' onClick={() => onDelete(banner._id, banner?.sUserName)}>
                                        <div className='dropdown-datatable-items-icon'>
                                            <i className='icon-delete d-block' />
                                        </div>
                                        <div className='dropdown-datatable-row-text'>
                                            Delete
                                        </div>
                                    </Dropdown.Item>
                                </>)
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>

            {modal?.type === 'view' &&
                <Form className='step-one' autoComplete='off'>
                    <Modal show={modal?.open} onHide={() => setModal({ open: false, id: '' })} id='view-banner'>
                        <Modal.Header closeButton>
                            <Modal.Title className='add-banner-header'>View Banner</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="banner-preview-group">
                                <h3>Banner</h3>
                                {watch('sUrl') ? (
                                    typeof (watch('sUrl')) !== 'string'
                                        ? <div className="document-preview"> <img src={URL.createObjectURL(watch('sUrl'))} alt='altImage' /> </div>
                                        : <div className="document-preview"><img src={watch('sUrl')} alt='altImage' /> </div>) :  <FontAwesomeIcon icon={faUser} />}
                            </div>
                            <div className='d-flex justify-content-between design mt-2'>
                                <h3>Route</h3>
                                <span className='route'>{specificBanner?.eRoute}</span>
                            </div>
                            <div className='d-flex justify-content-between design'>
                                <h3>Created Date</h3>
                                <span>{moment(specificBanner?.dCreatedDate)?.format('DD MMM YYYY, hh: mm: ss A')}</span>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setModal({ open: false, type: '' })}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form >
            }
        </>
    )
}

export default BannerList
