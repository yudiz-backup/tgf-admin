import moment from 'moment'
import React from 'react'

const UserOperationList = ({ operation, index }) => {
  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{operation?.sOperation || '-'}</td>
        <td>{operation?.sRemoteAddress || '-'}</td>
        <td>{operation?.sDeviceId || '-'}</td>
        <td>{operation?.sVersion || '-'}</td>
        <td>{operation?.sDevice || '-'}</td>
        <td>{moment(operation?.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
      </tr>
    </>
  )
}

export default UserOperationList
