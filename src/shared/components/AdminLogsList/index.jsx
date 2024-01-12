import React from 'react'
import moment from 'moment'

const AdminLogsList = ({ adminLog, index }) => {
    return (
        <>
            <tr key={adminLog?._id}>
                <td>{index + 1}</td>
                <td>{adminLog?.sUserName || '-'}</td>
                <td>{adminLog?.sEmail || '-'}</td>
                <td>{adminLog?.sEvent || '-'}</td>
                <td>{adminLog?.sPath || '-'}</td>
                <td>{adminLog?.sRemoteAddress || '0'}</td>
                <td className="date-data-field">{moment(adminLog.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>
            </tr>
        </>
    )
}

export default AdminLogsList
