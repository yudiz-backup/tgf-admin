import React from 'react'
import { Dropdown } from 'react-bootstrap'
import moment from 'moment'

const MessageList = ({ message, index, onDelete }) => {
    return (
        <>
            <tr key={message._id} className={message.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td className='title'>
                    <span>{message?.sTitle || '-'}</span>
                </td>
                <td className='msg'><span className='msg-content'>{message?.sDescription}</span></td>
                <td className="date-data-field">{moment(message?.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>

                <td>
                    <Dropdown.Item className='dropdown-datatable-items delete' onClick={() => onDelete(message._id, message?.sUserName)}>
                        <div className='dropdown-datatable-items-icon'>
                            <i className='icon-delete d-block' />
                        </div>
                    </Dropdown.Item>
                </td>
            </tr>
        </>
    )
}

export default MessageList
