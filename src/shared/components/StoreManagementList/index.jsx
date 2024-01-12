import React from 'react';
import moment from 'moment';
import { Dropdown, Form } from 'react-bootstrap';

function StoreManagementList ({ store, updateMutate, onDelete }) {
    const handleConfirmStatus = (status, id) => {
        updateMutate({ id, eStatus: status ? 'y' : 'n' })
    }

    return (
        <>
            <tr key={store._id} className={'store'} >
                <td>
                    {store?.sIcon && (
                        typeof (store?.sIcon) !== 'string'
                            ? <div className=""> <img src={URL.createObjectURL(store?.sIcon)} alt='altImage' /> </div>
                            : <div className=""><img src={store?.sIcon} alt='altImage' /> </div>)}
                </td>
                <td className='single-line'>{store?.eType}</td>
                <td className='single-line'>{store?.nAmount || '0'}</td>
                <td className='single-line'>{store?.sPromoCode || '-'}</td>
                <td className='single-line'>{moment(store?.dCreatedDate)?.format('DD-MM-YYYY') || '-'}</td>
                <td>
                    {store.eStatus !== 'd' ? <Form.Check
                        type='switch'
                        name={store._id}
                        className='d-inline-block me-1'
                        checked={store.eStatus === 'y'}
                        onChange={(e) => handleConfirmStatus(e.target.checked, store._id)}
                    /> : <span className='delete-user'>Delete</span>}
                </td>

                <td className='notification-view'>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Item className='dropdown-datatable-items' onClick={() => onDelete(store._id, store?.sTitle)}>
                            <div className='dropdown-datatable-items-icon'>
                                <i className='icon-delete d-block' />
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </td>
            </tr>
        </>
    )
}

export default StoreManagementList