import React from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { route } from 'shared/constants/AllRoutes'
import { useNavigate } from 'react-router-dom'
import TriggerTooltip from '../Tooltip/tooltip'
import { useMutation, useQueryClient } from 'react-query'
import { toaster } from 'helper/helper'
import { changePLOStatus } from 'query/poker/poker.query'

const OFCPokerList = ({ table, index, onDelete, location }) => {
    const navigate = useNavigate()
    const query = useQueryClient()

    // PLO Status
    const { mutate: statusMutationPLO } = useMutation(changePLOStatus, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            query.invalidateQueries('OFCList')
        }
    })

    const handleConfirmStatus = (e, id) => {
        statusMutationPLO({ id, eStatus: e?.target?.checked ? 'y' : 'n' })
    }

    return (
        <>
            <tr key={table._id} className={table.eStatus === 'd' && 'deleted-user'} >
                <td>{index + 1}</td>
                <td>
                    <TriggerTooltip className='user single-line' data={table.sName || '-'} display={table.sName || '-'} onClick={() => navigate(route.viewNLH(table?._id), { state: location?.pathname })} />
                </td>
                <td>{table?.eGameType || '-'}</td>
                <td>{table?.nAnte || 0}</td>
                <td>{table?.nBlind || 0}</td>
                <td>{table?.nMinimumBuyIn || 0}</td>
                <td>{table?.nMaximumBuyIn || 0}</td>
                <td>{table?.nRake || 0}</td>
                <td>{table?.nMaxBot || 0}</td>
                <td>
                    {table.eStatus !== 'd' ? <Form.Check
                        type='switch'
                        name={table._id}
                        className='d-inline-block me-1'
                        checked={table.eStatus === 'y'}
                        onChange={(e) => handleConfirmStatus(e, table?._id)}
                    /> : <span className='delete-user'>Delete</span>}
                </td>
                <td className="date-data-field">{moment(table.dCreatedDate).format('DD-MM-YYYY') || '-'}</td>

                <td>
                    <Dropdown className='dropdown-datatable'>
                        <Dropdown.Toggle className='dropdown-datatable-toggle-button'>
                            <div className=''>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-datatable-menu'>
                            <Dropdown.Item className='dropdown-datatable-items' onClick={() => navigate(route.viewNLH(table._id), { state: location?.pathname })}>
                                <div className='dropdown-datatable-items-icon'>
                                    <i className='icon-visibility d-block' />
                                </div>
                                <div className='dropdown-datatable-row-text'>
                                    View
                                </div>
                            </Dropdown.Item>
                            {
                                table.eStatus !== 'd' && (<>
                                    <Dropdown.Item className='dropdown-datatable-items' onClick={() => onDelete(table._id, table?.sName)}>
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
        </>
    )
}

export default OFCPokerList
