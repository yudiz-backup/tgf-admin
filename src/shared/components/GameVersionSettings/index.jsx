/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import DataTable from '../DataTable'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { GameVersionSettingColumns } from 'shared/constants/TableHeaders'
import { toaster } from 'helper/helper'
import CommonInput from '../CommonInput'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap'
import { versionStatusSetting } from 'query/settings/settings.query'
import PropTypes from 'prop-types'


const GameVersionSettings = ({ settingData }) => {
    const { register, formState: { errors }, reset, handleSubmit } = useForm({ mode: 'all' })

    const query = useQueryClient()

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [columns, setColumns] = useState(getSortedColumns(GameVersionSettingColumns))
    const [modal, setModal] = useState({ open: false, name: '' })

    // Status
    const { mutate: statusMutation, } = useMutation(versionStatusSetting, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            setModal({ open: false, name: '' })
            query.invalidateQueries('setting')
            reset({})
        }
    })

    const onSubmit = (data) => {
        statusMutation({
            eGamePack: modal?.data?.eGamePack,
            eType: modal?.data?.eType,
            sMinimumVersion: data?.sMinimumVersion,
            sVersion: data?.sVersion,
        })
    }

    const handleConfirmStatus = (e, gamePack, type) => {
        statusMutation({
            bForceUpdate: e?.target?.checked ? 'y' : 'n',
            eGamePack: gamePack,
            eType: type
        })
    }

    const handleShow = (index, version) => {
        reset({
            sVersion: version?.sVersion,
            sMinimumVersion: version?.sMinimumVersion,
        })
        setModal({ open: true, name: 'version', index: index, data: version })
    }

    const handleClear = () => {
        setModal({ open: false, name: '' })
    }
    return (
        <>
            <div className='game-version-setting'>
                <DataTable
                    columns={columns}
                    label={'Game Version'}
                    header={{
                        left: {
                            rows: false
                        },
                        right: {
                            search: false,
                            filter: false
                        }
                    }}
                >
                    {settingData && settingData?.aVersion?.map((version, index) => {
                        return (
                            <>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{version?.sVersion}</td>
                                    <td>{version?.sMinimumVersion}</td>
                                    <td>{version?.eType}</td>
                                    <td>{version?.eGamePack}</td>
                                    <td>
                                        {version.bForceUpdate !== 'd' ? <Form.Check
                                            type='switch'
                                            name={index}
                                            className='d-inline-block me-1'
                                            checked={version.bForceUpdate === 'y'}
                                            onChange={(e) => handleConfirmStatus(e, version?.eGamePack, version?.eType)}
                                        /> : <span className='delete-user'>Delete</span>}
                                    </td>
                                    <td>
                                        <Dropdown.Item className='dropdown-datatable-items edit' onClick={() => handleShow(index, version)}>
                                            <div className='dropdown-datatable-items-icon'>
                                                <i className='icon-create d-block' />
                                            </div>
                                        </Dropdown.Item>
                                    </td>
                                </tr>

                                {modal?.name === 'version' && modal?.index === index &&
                                    <Form className='step-one' autoComplete='off'>
                                        <Modal show={modal?.open} onHide={() => setModal({ open: false, name: '' })} id='edit-version'>
                                            <Modal.Header closeButton>
                                                <Modal.Title className='edit-version-header'>{version?.eGamePack} - {version?.eType}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <CommonInput
                                                    type='text'
                                                    register={register}
                                                    errors={errors}
                                                    className={`form-control ${errors?.sVersion && 'error'}`}
                                                    name='sVersion'
                                                    label='Current Version'
                                                    placeholder='Enter current version'
                                                    required
                                                    validation={{
                                                        pattern: {
                                                            value: /^[0-9]+(\.[0-9]+)?$/,
                                                            message: 'Only numbers are allowed'
                                                        },
                                                        required: {
                                                            value: true,
                                                            message: 'Current version is required.'
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        e.target.value =
                                                            e.target.value?.trim() &&
                                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                    }}
                                                />

                                                <CommonInput
                                                    type='text'
                                                    register={register}
                                                    errors={errors}
                                                    className={`form-control ${errors?.sMinimumVersion && 'error'}`}
                                                    name='sMinimumVersion'
                                                    label='Minimum Version'
                                                    placeholder='Enter minimum version'
                                                    required
                                                    validation={{
                                                        pattern: {
                                                            value: /^[0-9]+(\.[0-9]+)?$/,
                                                            message: 'Only numbers are allowed'
                                                        },
                                                        required: {
                                                            value: true,
                                                            message: 'Minimum version is required.'
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        e.target.value =
                                                            e.target.value?.trim() &&
                                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                    }}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => handleClear()}>
                                                    Cancel
                                                </Button>
                                                <Button variant="primary" type='submit' onClick={handleSubmit(onSubmit)}>
                                                    Submit
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Form>
                                }
                            </>
                        )
                    })}
                </DataTable>
            </div>
        </>
    )
}

export default GameVersionSettings

GameVersionSettings.propTypes = {
    settingData: PropTypes.any,
}

