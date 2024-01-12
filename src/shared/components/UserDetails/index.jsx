import React, { useState } from 'react'
import moment from 'moment'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { validationErrors } from 'shared/constants/ValidationErrors';
import { statesColumn } from 'shared/constants/TableHeaders';
import CommonInput from '../CommonInput';
import CustomModal from '../Modal';
import CommonPasswordModal from '../CommonPasswordModal';
import { useMutation, useQueryClient } from 'react-query';
import { approveUserLocation, editUser } from 'query/user/user.mutation';
import { toaster } from 'helper/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

function UserDetails ({ id, userData, control, errors, register, getValues, setValue, reset }) {
    const query = useQueryClient()
    const [modal, setModal] = useState({ type: '', open: false })

    const eGender = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ]

    const MODAL_TYPE = {
        SUBMIT: 'submit-button',
        UPDATE_ADDRESS: 'operation',
        CONFIRM_APPROVE_BUTTON: 'confirm-approve',
        ADD_REJECTION_REASON: 'rejection-message'
    }

    // EDIT USER
    const { mutate } = useMutation(editUser, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('userDataById')
            setModal({ open: false, type: '' })
            setValue('sPassword', '')
        }
    })

    // APPROVE USER LOCATION
    const { mutate: approveLocationMutate } = useMutation(approveUserLocation, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('userDataById')
            setModal({ open: false, type: '' })
            reset()
        }
    })

    const handleSubmitButton = () => {
        setModal({ open: true, type: MODAL_TYPE.SUBMIT })
        setValue('sPassword', '')
    }

    const handleConfirmAddressCredential = () => {
        mutate({
            id: id, 
            payload: {
                sPassword: getValues('sPassword'),
                sState: getValues('sState')?.value || userData?.oLocation?.sState,
                sPostalCode: +getValues('sPostalCode')
            }
        })
    }

    const handleUpdateAddress = () => {
        reset({ sPassword: '' })
        setModal({ open: true, type: MODAL_TYPE.UPDATE_ADDRESS })
    }

    const handleOperation = () => {
        if (userData?.oLocation?.isVerified === false) {
            setModal({ type: MODAL_TYPE.CONFIRM_APPROVE_BUTTON, open: true })
        } else {
            setModal({ type: MODAL_TYPE.ADD_REJECTION_REASON, open: true })
        }
    }

    const handleConfirmApprove = () => {
        approveLocationMutate({
            id: id,
            payload: {
                isVerified: true,
                sPassword: getValues('sPassword')
            }
        })
    }

    const handleRejectionMsg = () => {
        approveLocationMutate({
            id: id,
            payload: {
                isVerified: false,
                sPassword: getValues('sPassword'),
                sRejectReason: getValues('sRejectReason')
            }
        })
    }

    return (
        <>
            <Row className='details-row'>
                <Col xxl={12} xl={12} md={12} sm={12}>
                    <div className='details-card'>
                        <div className='details-card-title'>User Details</div>
                        <div className='details-card-data'>
                            <Row className='details-data-row p-0 m-0'>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Full Name</span>
                                    <span className='data-value'>{userData?.sUserName || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Email</span>
                                    <span className='data-value'>{userData?.sEmail || 'Not Provided'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Mobile No.</span>
                                    <span className='data-value'>{userData?.sMobile || 'Not Provided'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Gender</span>
                                    <span className='data-value'>{eGender?.find(item => item?.value === userData?.eGender)?.label || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Date Of Birth</span>
                                    <span className='data-value'>{userData?.dDatOofBirth || 'Not Provided'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Status</span>
                                    <span className='data-value'>{userData?.eStatus === 'y' ? 'Active' : 'In-Active'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Chips</span>
                                    <span className='data-value'><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {userData?.nChips?.toFixed(2) || 'No Data'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Practice Chip</span>
                                    <span className='data-value'><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {userData?.nPracticeChips?.toFixed(2) || 'No Data'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Withdrawable Cash</span>
                                    <span className='data-value'><FontAwesomeIcon icon={faIndianRupeeSign} size='sm' /> {userData?.nWithdrawable?.toFixed(2) || 'No Data'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Push Token</span>
                                    <span className='data-value'>{userData?.sPushToken || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Auth Code</span>
                                    <span className='data-value'>{userData?.sAuthCode || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Referral Code</span>
                                    <span className='data-value'>{userData?.sReferralCode || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Poker Table</span>
                                    <span className='data-value'>{'-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Created Date</span>
                                    <span className='data-value'>{moment(userData?.dCreatedDate).format('DD-MM-YYYY') || '-'}</span>
                                </Col>
                                <Col xxl={3} xl={4} lg={4} md={6} sm={6} className="p-0 m-0">
                                    <span className='data-title'>Last Activity on</span>
                                    <span className='data-value'>{moment(userData?.dUpdatedDate).format('DD-MM-YYYY') || '-'}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>

                <Col xxl={12} xl={12} md={12} sm={12}>
                    <div className='details-card'>
                        <div className='details-card-title'>User Address</div>
                        <div className='details-card-data'>
                            <Row className='details-data-row p-0 m-0 gap-2'>
                                <Col xxl={6} xl={6} lg={6} md={9} sm={10} className="p-0 m-0">
                                    <Form.Group className='form-group'>
                                        <Form.Label>State</Form.Label>
                                        <Controller
                                            name='sState'
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: validationErrors.eStateRequired
                                                }
                                            }}
                                            render={({ field: { onChange, value, ref } }) => {
                                                return (
                                                    <Select
                                                        ref={ref}
                                                        value={value || statesColumn?.find(item => item?.value === userData?.oLocation?.sState)}
                                                        options={statesColumn}
                                                        className={`react-select border-0 ${errors?.sState && 'error'}`}
                                                        classNamePrefix='select'
                                                        closeMenuOnSelect={true}
                                                        placeholder='Select the State'
                                                        onChange={(e) => {
                                                            onChange(e)
                                                        }}
                                                    />
                                                )
                                            }}
                                        />
                                        {errors?.sState && (
                                            <Form.Control.Feedback type='invalid'>
                                                {errors?.sState.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xxl={6} xl={6} lg={6} md={9} sm={10} className="p-0 m-0">
                                    <CommonInput
                                        type='text'
                                        register={register}
                                        errors={errors}
                                        className={`for m-control ${errors?.sPostalCode && 'error'}`}
                                        name='sPostalCode'
                                        label='Postal Code'
                                        placeholder='Enter postal code'
                                        validation={{
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Only numbers are allowed'
                                            },
                                            maxLength: {
                                                value: 6,
                                                message: 'Postal code must be 6 digits.'
                                            },
                                            minLength: {
                                                value: 6,
                                                message: 'Postal code must be atleast 6 digits.'
                                            },
                                            required: {
                                                value: true,
                                                message: 'Postal code is required'
                                            },
                                        }}
                                        onChange={(e) => {
                                            e.target.value =
                                                e.target.value?.trim() &&
                                                e.target.value.replace(/^[a-zA-z]+$/g, '')
                                        }}
                                    />
                                </Col>
                                {userData?.oLocation?.isVerified === false &&
                                    <Col xxl={6} xl={6} lg={6} md={12} sm={12} className="p-0 m-0">
                                        <Row>
                                            <Col xxl={6} xl={6} lg={6} md={6} sm={6} xs={6}>
                                                <label>Reason for Rejection :-</label>
                                            </Col>
                                            <Col xxl={6} xl={6} lg={6} md={6} sm={6} xs={6} className=''>
                                                <span className='text-danger reason'>{userData?.oLocation?.sRejectReason || '-'}</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                            </Row>
                            <Row className='mt-3'>
                                <Col sm={6}>
                                    <Button variant='primary' className='me-2' onClick={() => handleSubmitButton()} type='submit'>
                                        Submit
                                    </Button>
                                    <Button variant={userData?.oLocation?.isVerified === true ? 'danger text-light' : 'success text-light'} onClick={() => handleUpdateAddress()}>
                                        {userData?.oLocation?.isVerified === true ? "Reject" : "Approve"}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
            {modal?.type === MODAL_TYPE.SUBMIT &&
                <CommonPasswordModal
                    isTextArea={false}
                    modal={modal}
                    setModal={setModal}
                    bodyTitle={'Address Submit'}
                    message={'Are you sure want to submit address?'}
                    register={register}
                    errors={errors}
                    name='sPassword'
                    handleConfirm={handleConfirmAddressCredential}
                />
            }

            {modal?.type === MODAL_TYPE.UPDATE_ADDRESS &&
                <CommonPasswordModal
                    modal={modal}
                    isTextArea={false}
                    setModal={setModal}
                    bodyTitle={'Update Address Request'}
                    message={'Are you sure want to update address?'}
                    register={register}
                    errors={errors}
                    name='sPassword'
                    handleConfirm={handleOperation}
                />
            }

            {modal?.type === MODAL_TYPE.CONFIRM_APPROVE_BUTTON &&
                <CustomModal
                    open={modal.open}
                    handleClose={() => setModal({ open: false, type: '' })}
                    handleConfirm={handleConfirmApprove}
                    disableHeader
                    bodyTitle='Confirm Approve'
                    confirmValue={getValues('sPassword')}
                >
                    <article>
                        <h5>
                            <div>
                                Are you sure that you Approve?
                            </div>
                        </h5>
                    </article>
                </CustomModal>
            }

            {modal?.type === MODAL_TYPE.ADD_REJECTION_REASON &&
                <CommonPasswordModal
                    isTextArea={true}
                    modal={modal}
                    setModal={setModal}
                    bodyTitle={'Rejection Reason'}
                    message={'Are you sure that you want to reject?'}
                    register={register}
                    errors={errors}
                    name='sRejectReason'
                    handleConfirm={handleRejectionMsg}
                />
            }
        </>
    )
}

export default UserDetails
