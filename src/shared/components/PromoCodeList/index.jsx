import React from 'react'
import { faEllipsisVertical, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toaster } from 'helper/helper';
import moment from 'moment';
import { updatePromoCodeStatus } from 'query/promotion/promoCode/promoCode.query';
import { Dropdown, Form } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { route } from 'shared/constants/AllRoutes';

const PromoCodeList = ({ promoCode, index, onDelete }) => {
    const query = useQueryClient()
    const navigate = useNavigate()

    // Status
    const { mutate: statusMutation } = useMutation(updatePromoCodeStatus, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            query.invalidateQueries('promoCodeList')
        },
    })

    const handleConfirmStatus = (status, id) => {
        statusMutation({ id, eStatus: status?.target?.checked ? 'y' : 'n' })
    }

    return (
        <>
            <tr key={promoCode?._id}>
                <td>{index + 1}</td>
                <td>{promoCode?.sPromoCode || '-'}</td>
                <td><FontAwesomeIcon icon={faIndianRupeeSign} size='xs' /> {promoCode?.nValue?.toFixed(2) || '0.00'}</td>
                <td>{promoCode?.nCapped || '0'}</td>
                <td>{promoCode?.nValueValidity || '0'}</td>
                <td>{promoCode?.nRange || '-'}</td>
                <td>{promoCode?.isFTD ? <span className='success'>true</span> : <span className='danger'>false</span>}</td>
                <td>{promoCode?.nUserClaims < 0 ? 'Unlimited Times' : `${promoCode?.nUserClaims} Times`}</td>
                <td className='single-line'>{`${moment(promoCode?.dStartAt)?.format('DD-MM-YYYY')} - ${moment(promoCode?.dEndAt)?.format('DD-MM-YYYY')}`}</td>
                <td>
                    {promoCode.eStatus !== 'd' ? <Form.Check
                        type='switch'
                        name={promoCode._id}
                        className='d-inline-block me-1'
                        checked={promoCode.eStatus === 'y'}
                        onChange={(e) => handleConfirmStatus(e, promoCode?._id)}
                    /> : <span className='delete-user'>Delete</span>}
                </td>
                <td>{promoCode.eStatus !== 'd' ?
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
                            <div className=''>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-datatable-menu'>
                            <Dropdown.Item className='dropdown-datatable-items' onClick={() => navigate(route.viewPromoCode(promoCode._id))}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-visibility d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    View
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item className='dropdown-datatable-items' onClick={() => onDelete(promoCode._id, promoCode?.sUserName)}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-delete d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    Delete
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    : <div className='dropdown-datatable-items-icon' onClick={() => navigate(route.viewPromoCode(promoCode._id))}>
                        <i className='icon-visibility d-block' />
                    </div>
                }
                </td>
            </tr>
        </>
    )
}

export default PromoCodeList
