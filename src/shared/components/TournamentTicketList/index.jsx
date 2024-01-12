import React, { useState } from 'react'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

const TournamentTicketList = ({ ticket, index, onDelete, modal, setModal, watch, onUpdate, setTicketID, specificTicket, updateMutate }) => {
    const [viewModal, setViewModal] = useState()

    const handleView = (id) => {
        setViewModal({ open: true, type: 'view' })
        setTicketID(id)
    }

    const handleConfirmStatus = (status, id) => {
        updateMutate({ id, eStatus: status ? 'y' : 'n' })
    }

    return (
        <>
            <tr key={ticket._id} className={ticket.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>
                    {ticket?.sLogo && (
                        typeof (ticket?.sLogo) !== 'string'
                            ? <div className="document-preview"> <img src={URL.createObjectURL(ticket?.sLogo)} alt='altImage' onClick={() => handleView(ticket?._id)} /> </div>
                            : <div className="document-preview"><img src={ticket?.sLogo} alt='altImage' onClick={() => handleView(ticket?._id)} /> </div>)}
                </td>
                <td className='single-line'>{ticket?._id}</td>
                <td className='single-line'>{ticket?.sName}</td>
                <td>
                    {ticket.eStatus !== 'd' ? <Form.Check
                        type='switch'
                        name={ticket._id}
                        className='d-inline-block me-1'
                        checked={ticket.eStatus === 'y'}
                        onChange={(e) => handleConfirmStatus(e.target.checked, ticket._id)}
                    /> : <span className='delete-user'>Delete</span>}
                </td>

                <td>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
                            <div className=''>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-datatable-menu'>
                            <Dropdown.Item className='dropdown-datatable-items' onClick={() => handleView(ticket?._id)}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-visibility d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    View
                                </div>
                            </Dropdown.Item>
                            {
                                ticket.eStatus !== 'd' && (<>
                                    <Dropdown.Item className='dropdown-datatable-items' onClick={() => onUpdate(ticket._id)}>
                                        <div className='dropdown-datatable-items-icon'>
                                            <i className='icon-create d-block' />
                                        </div>
                                        <div className='dropdown-datatable-row-text'>
                                            Update
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className='dropdown-datatable-items' onClick={() => onDelete(ticket._id)}>
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

            {viewModal &&
                <Form className='step-one' autoComplete='off'>
                    <Modal show={viewModal?.open} onHide={() => setViewModal({ open: false, id: '' })} id='view-ticket'>
                        <Modal.Header closeButton>
                            <Modal.Title className='add-ticket-header'>View Ticket Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="ticket-preview-group">
                                {watch('sLogo') && (
                                    typeof (watch('sLogo')) !== 'string'
                                        ? <div className="document-preview"> <img src={URL.createObjectURL(watch('sLogo'))} alt='altImage' /> </div>
                                        : <div className="document-preview"><img src={watch('sLogo')} alt='altImage' /> </div>)}
                            </div>
                            <h3>{specificTicket?.sName}</h3>
                            <div className='d-flex justify-content-between design'>
                                <h3>Name: {specificTicket?.sName}</h3>
                                <span>Status: {specificTicket?.eStatus === 'y' ? <span className='status'>Active</span> : <span className='inactive-status'>Inactive</span>}</span>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setViewModal({ open: false, type: '' })}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form >
            }
        </>
    )
}

export default TournamentTicketList
