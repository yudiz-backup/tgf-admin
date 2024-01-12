import React from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
import moment from 'moment'
import lockicon from 'assets/images/icons/password.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

function AdminRow ({ user, index, onStatusChange, onDelete, onPassChange }) {
  return (
    <tr key={user._id} style={{ textAlign: 'center' }}>
      <td>{index + 1}</td>
      <td>{user.sFullName || '-'}</td>
      <td>{user.sSchoolName || '-'}</td>
      <td>{user.sPackageName || '-'}</td>
      <td className='date-data-field'>{moment(user.dPackageEndDate).format('DD-MM-YYYY') || '-'}</td>
      <td>
        <Form.Check
          type='switch'
          name={user._id}
          className='d-inline-block me-1'
          checked={user.eStatus === 'y'}
          onChange={(e) => onStatusChange(user?._id, e.target.checked)}
        />
      </td>
      <td style={{ textAlign: 'center' }}>
        <Dropdown className='dropdown-datatable'>
          <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
            <div className=''>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className='dropdown-datatable-menu'>
            <Dropdown.Item className='dropdown-datatable-items'>
              <div className='dropdown-datatable-items-icon'>
                <i className='icon-visibility d-block' />
              </div>
              <div className='dropdown-datatable-row-text'>
                View
              </div>
            </Dropdown.Item>
            <Dropdown.Item className='dropdown-datatable-items'>
              <div className='dropdown-datatable-items-icon'>
                <i className='icon-create d-block' />
              </div>
              <div className='dropdown-datatable-row-text'>
                Update
              </div>
            </Dropdown.Item>
            <Dropdown.Item className='dropdown-datatable-items' onClick={() => {
              onDelete(user._id, user?.sFullName)
            }}>
              <div className='dropdown-datatable-items-icon'>
                <i className='icon-delete d-block' />
              </div>
              <div className='dropdown-datatable-row-text'>
                Delete
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  )
}
AdminRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  onStatusChange: PropTypes.func
}
export default AdminRow
