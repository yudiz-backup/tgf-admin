/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import DataTable from '../DataTable'
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import CommonInput from '../CommonInput'
import { PaymentModeSettingColumns } from 'shared/constants/TableHeaders'
import CustomModal from '../Modal'
import { fileToDataUri, toaster } from 'helper/helper'
import Select from 'react-select'
import { addPaymentMode } from 'query/settings/settings.query'
import PropTypes from 'prop-types'

const PaymentModeSettings = ({ settingData }) => {
    const { register, formState: { errors }, reset, handleSubmit, control, watch } = useForm({ mode: 'all' })

    const query = useQueryClient()

    function getSortedColumns (adminTableColumns, urlData) {
        return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
    }

    const [columns, setColumns] = useState(getSortedColumns(PaymentModeSettingColumns))
    const [deleteId, setDeleteId] = useState()
    const [modal, setModal] = useState({ open: false, name: '' })

    const eModeTypeOptions = [
        { label: 'Deposit', value: 'deposit' },
        { label: 'Withdrawal', value: 'withdrawal' },
    ]

    const { mutate: addMutate } = useMutation(addPaymentMode, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            setModal({ open: false, name: '' })
            query.invalidateQueries('setting')
            reset({})
        }
    })

    // Status
    const { mutate: statusMutation, } = useMutation(addPaymentMode, {
        onSuccess: (response) => {
            toaster(response?.data?.message)
            setModal({ open: false, name: '' })
            query.invalidateQueries('setting')
            reset({})
        }
    })

    //   // DELETE TICKET
    //   const { isLoading: deleteLoading, mutate: deleteMutate } = useMutation(deleteTicket, {
    //     onSuccess: (res) => {
    //         query.invalidateQueries('ticketList')
    //         toaster(res?.data?.message)
    //         setModal({ open: false, type: '', status: '' })
    //     }
    // })

    async function  onSubmit (data) {
        const addData = {
            sName: data?.sName || '',
            sDescription: data?.sDescription || '',
            eType: data?.eType?.value,
            oDevice: {
                isIOS: data?.isIOS || false,
                isAndroid: data?.isAndroid || false
            },
            sLogo: ''
        }

        const sLogoFile = data.sLogo;

        if (sLogoFile) {
            const dataUri = await fileToDataUri(sLogoFile);
            addData.sLogo = dataUri;
        }

        addMutate(addData)
    }

    const handleIOSStatus = (e, id, IOS, Android) => {
        statusMutation({
            iPaymentMethodId: id,
            oDevice: {
                isIOS: e?.target?.checked,
                isAndroid: Android
            }
        })
    }

    const onDelete = (id) => {
        setModal({ open: true, type: 'delete' })
        setDeleteId(id)
    }

    const handleConfirmDelete = () => {
        // deleteMutate(deleteId)
    }

    const handleUpdateButton = () => {

    }

    const handleShow = (index, version) => {
        reset({
            sVersion: version?.sVersion,
            sMinimumVersion: version?.sMinimumVersion,
        })
        setModal({ open: true, name: 'version', index: index, data: version })
    }

    async function handleHeaderEvent (name, value) {
        switch (name) {
            case 'add':
                setModal({ open: value, name: 'add-mode' })
                break
            default:
                break
        }
    }

    const handleClear = () => {
        setModal({ open: false, name: '' })
        reset({})
    }
    return (
        <>
            <div className='payment-mode-setting'>
                <DataTable
                    columns={columns}
                    label={'Payment Modes'}
                    header={{
                        left: {
                            rows: false
                        },
                        right: {
                            search: false,
                            filter: false,
                            addMode: true
                        }
                    }}
                    headerEvent={(name, value) => handleHeaderEvent(name, value)}
                >
                    {settingData && settingData?.aAllowedPaymentMode?.map((payment, index) => {
                        return (
                            <>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {payment?.sLogo && (
                                            typeof (payment?.sLogo) !== 'string'
                                                ? <div className="logo-preview"> <img src={URL.createObjectURL(payment?.sLogo)} alt='altImage' /> </div>
                                                : <div className="logo-preview"><img src={payment?.sLogo} alt='altImage' /> </div>)}
                                    </td>
                                    <td>{payment?.sName}</td>
                                    <td>{payment?.sDescription}</td>
                                    <td>{payment?.eType}</td>
                                    <td>
                                        {payment?.oDevice?.isAndroid !== 'd' ? <Form.Check
                                            type='switch'
                                            name={index}
                                            className='d-inline-block me-1'
                                            checked={payment?.oDevice?.isAndroid === true}
                                            onChange={(e) => handleIOSStatus(e, payment?._id, payment?.oDevice?.isIOS, payment?.oDevice?.isAndroid)}
                                        /> : <span className='delete-user'>Delete</span>}
                                    </td>
                                    <td>
                                        {payment?.oDevice?.isIOS !== 'd' ? <Form.Check
                                            type='switch'
                                            name={index}
                                            className='d-inline-block me-1'
                                            checked={payment?.oDevice?.isIOS === true}
                                            // onChange={(e) => handleConfirmStatus(e, payment?.eGamePack, payment?.eType)}
                                        /> : <span className='delete-user'>Delete</span>}
                                    </td>
                                    <td>
                                        {payment?.eStatus !== 'd' ? <Form.Check
                                            type='switch'
                                            name={index}
                                            className='d-inline-block me-1'
                                            checked={payment?.eStatus === 'y'}
                                            // onChange={(e) => handleConfirmStatus(e, payment?.eGamePack, payment?.eType)}
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
                                                {
                                                    payment.eStatus !== 'd' && (<>
                                                        <Dropdown.Item className='dropdown-datatable-items edit' onClick={() => handleUpdateButton()}>
                                                            <div className='dropdown-datatable-items-icon'>
                                                                <i className='icon-create d-block' />
                                                            </div>
                                                            <div className='dropdown-datatable-row-text'>
                                                                Update
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item className='dropdown-datatable-items' onClick={() => onDelete(payment._id, payment?.sUserName)}>
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

                                {modal?.name === 'add-mode' &&
                                    <Form className='step-one' autoComplete='off'>
                                        <Modal show={modal?.open} onHide={() => { setModal({ open: false, name: '' }); reset({})}} id='add-mode' size='lg'>
                                            <Modal.Header closeButton>
                                                <Modal.Title className='edit-version-header'>Add Payment Modes</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Row>
                                                    <Col lg={6} md={12} sm={12}>
                                                        <Row>
                                                            <Col sm={12}>
                                                                <CommonInput
                                                                    type='text'
                                                                    register={register}
                                                                    errors={errors}
                                                                    className={`form-control ${errors?.sName && 'error'}`}
                                                                    name='sName'
                                                                    label='Name'
                                                                    placeholder='Enter the name'
                                                                    required
                                                                    onChange={(e) => {
                                                                        e.target.value =
                                                                            e.target.value?.trim() &&
                                                                            e.target.value.replace(/^[0-9]+$/g, '')
                                                                    }}
                                                                    validation={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Payment Mode name is required'
                                                                        },
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col sm={12} className=''>
                                                                <Form.Group className='form-group'>
                                                                    <Form.Label>
                                                                        <span>
                                                                            Payment Mode Type
                                                                            <span className='inputStar'>*</span>
                                                                        </span>
                                                                    </Form.Label>
                                                                    <Controller
                                                                        name='eType'
                                                                        control={control}
                                                                        rules={{
                                                                            required: {
                                                                                value: true,
                                                                                message: 'Payment Mode type is required'
                                                                            }
                                                                        }}
                                                                        render={({ field: { onChange, value, ref } }) => (
                                                                            <Select
                                                                                placeholder='Select the payment mode type'
                                                                                ref={ref}
                                                                                options={eModeTypeOptions}
                                                                                className={`react-select border-0 ${errors.eType && 'error'}`}
                                                                                classNamePrefix='select'
                                                                                isSearchable={false}
                                                                                value={value}
                                                                                onChange={onChange}
                                                                                getOptionLabel={(option) => option.label}
                                                                                getOptionValue={(option) => option.value}
                                                                            />
                                                                        )}
                                                                    />
                                                                    {errors.eType && (
                                                                        <Form.Control.Feedback type='invalid'>
                                                                            {errors.eType.message}
                                                                        </Form.Control.Feedback>
                                                                    )}
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col lg={6} md={12} sm={12}>
                                                        <CommonInput
                                                            type='textarea'
                                                            register={register}
                                                            label='Description'
                                                            errors={errors}
                                                            className={`form-control ${errors?.sDescription && 'error'}`}
                                                            name='sDescription'
                                                            placeholder='Type your message here...'
                                                            onChange={(e) => e.target.value}
                                                            validation={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Description is required'
                                                                },
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>

                                                <Row className='mt-2'>
                                                    <Col xs={3}>
                                                        <Form.Group className='form-group'>
                                                            <Form.Label className='form-checkbox-input'>
                                                                <Controller
                                                                    name='isIOS'
                                                                    control={control}
                                                                    render={({ field: { onChange, value, ref } }) => {
                                                                        return < Form.Check
                                                                            type='checkbox'
                                                                            value={value}
                                                                            checked={value}
                                                                            onChange={onChange}
                                                                        />
                                                                    }}
                                                                />
                                                                IOS
                                                            </Form.Label>
                                                        </Form.Group>
                                                    </Col>

                                                    <Col xs={3}>
                                                        <Form.Group className='form-group'>
                                                            <Form.Label className='form-checkbox-input'>
                                                                <Controller
                                                                    name='isAndroid'
                                                                    control={control}
                                                                    render={({ field: { onChange, value, ref } }) => {
                                                                        return (
                                                                            <Form.Check
                                                                                type='checkbox'
                                                                                value={value}
                                                                                checked={value}
                                                                                onChange={onChange}
                                                                            />
                                                                        )
                                                                    }}
                                                                />
                                                                Android
                                                            </Form.Label>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className='fileinput'>
                                                            <div className='inputtypefile'>
                                                                <div className='inputMSG'>
                                                                    <span>Upload Payment Logo</span>
                                                                </div>
                                                                <Controller
                                                                    name={`sLogo`}
                                                                    control={control}
                                                                    rules={{
                                                                        required: "Please add ticket logo",
                                                                        validate: {
                                                                            fileType: (value) => {
                                                                                if (value && typeof (watch(`sLogo`)) !== 'string') {
                                                                                    const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                                                                    const fileExtension = value.name.split('.').pop().toLowerCase();

                                                                                    if (!allowedFormats.includes(fileExtension)) {
                                                                                        return "Unsupported file format";
                                                                                    }

                                                                                    const maxSize = 1 * 1000 * 1000; // 1MB in bytes
                                                                                    if (value.size >= maxSize) {
                                                                                        return "File size must be less than 1MB";
                                                                                    }
                                                                                }
                                                                                return true;
                                                                            },
                                                                        }
                                                                    }}
                                                                    render={({ field: { onChange, value, ref } }) => {
                                                                        return <>
                                                                            <Form.Control
                                                                                ref={ref}
                                                                                type='file'
                                                                                name={`sLogo`}
                                                                                // disabled={updateFlag}
                                                                                accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                                                                errors={errors}
                                                                                className={errors?.sLogo && 'error'}
                                                                                onChange={(e) => {
                                                                                    onChange(e.target.files[0])
                                                                                }}
                                                                            />
                                                                        </>
                                                                    }
                                                                    }
                                                                />
                                                            </div>

                                                            <span className='card-error'>{errors && errors?.sLogo && <Form.Control.Feedback type="invalid">{errors?.sLogo.message}</Form.Control.Feedback>}</span>
                                                            <div className="document-preview-group">
                                                                {watch('sLogo') && (
                                                                    typeof (watch('sLogo')) !== 'string'
                                                                        ? <div className="document-preview"> <img src={URL.createObjectURL(watch('sLogo'))} alt='altImage' /> </div>
                                                                        : <div className="document-preview"><img src={watch('sLogo')} alt='altImage' /> </div>)}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>

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

            <CustomModal
                open={modal.type === 'delete' && modal.open}
                handleClose={() => setModal({ open: false, type: '' })}
                handleConfirm={handleConfirmDelete}
                disableHeader
                bodyTitle='Tournament Ticket?'
                // isLoading={deleteLoading}
                confirmValue={deleteId}
            >
                <article>
                    <h5>
                        <div>
                            Are you sure, you want to delete this Ticket?
                        </div>
                    </h5>
                </article>
            </CustomModal>
        </>
    )
}

export default PaymentModeSettings

PaymentModeSettings.propTypes = {
    settingData: PropTypes.any,
}
