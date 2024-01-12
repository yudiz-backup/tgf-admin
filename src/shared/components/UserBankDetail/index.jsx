import React, { useEffect, useState } from 'react'
import Wrapper from '../Wrap'
import { Button, Col, Form, Row } from 'react-bootstrap'
import CommonInput from '../CommonInput'
import { useForm } from 'react-hook-form'
import CommonPasswordModal from '../CommonPasswordModal'
import { useMutation, useQueryClient } from 'react-query'
import { toaster } from 'helper/helper'
import { changeBankStatus } from 'query/user/user.mutation'
import CustomModal from '../Modal'

const UserBankDetail = ({ id, userDetail }) => {
    const query = useQueryClient()

    const { formState: { errors }, register, reset, handleSubmit, getValues } = useForm({ mode: 'all' })
    const [modal, setModal] = useState(false)

    useEffect(() => {
        reset({
            sBankName: userDetail?.aBanking?.[0]?.sBankName,
            sAccountNo: userDetail?.aBanking?.[0]?.sAccountNo,
            sAccountHolderName: userDetail?.aBanking?.[0]?.sAccountHolderName,
            sIFSC: userDetail?.aBanking?.[0]?.sIFSC,
        })
    }, [userDetail?.aBanking, reset])

    // APPROVE USER LOCATION
    const { mutate: approveLocationMutate } = useMutation(changeBankStatus, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('userDataById')
            setModal({ open: false, type: '' })
            reset()
        }
    })

    const onSubmit = (data) => {
        approveLocationMutate({
            id: id,
            payload: {
                id: userDetail?.aBanking?.[0]?._id,
                sAccountHolderName: data?.sAccountHolderName,
                sAccountNo: data?.sAccountNo,
                sBankName: data?.sBankName,
                sIFSC: data?.sIFSC
            }
        })
    }

    const handleConfirmApprove = () => {
        approveLocationMutate({
            id: id,
            payload: {
                id: userDetail?.aBanking?.[0]?._id,
                eState: 'approved'
            }
        })
    }

    const handleRejectionMsg = () => {
        approveLocationMutate({
            id: id,
            payload: {
                id: userDetail?.aBanking?.[0]?._id,
                eState: 'rejected',
                sDescription: getValues('sDescription')
            }
        })
    }

    const handleRejectBtn = () => {
        setModal({ type: 'rejection-message', open: true })
    }

    const handleApproveBtn = () => {
        setModal({ type: 'approve', open: true })
    }
    return (
        <>
            <div className='bank-details'>
                <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)} >
                    <div className='personal-details'>
                        <div className='user-form'>
                            <Row>
                                <Col xxl={8}>
                                    <Wrapper>
                                        <h2>Bank Info</h2><hr />
                                        {userDetail?.aBanking?.length !== 0 && <>
                                            <Row>
                                                <Col sm={6}>
                                                    <CommonInput
                                                        type='text'
                                                        register={register}
                                                        errors={errors}
                                                        className={`form-control account-number ${errors?.sBankName && 'error'}`}
                                                        name='sBankName'
                                                        label='Bank Name'
                                                        placeholder='Enter bank name'
                                                        required
                                                        onChange={(e) => {
                                                            e.target.value =
                                                                e.target.value?.trim() &&
                                                                e.target.value.replace(/^[0-9]+$/g, '')
                                                        }}
                                                        validation={{
                                                            required: {
                                                                value: true,
                                                                message: 'Bank name is required'
                                                            },
                                                        }}
                                                    />
                                                </Col>

                                                <Col sm={6}>
                                                    <CommonInput
                                                        type='text'
                                                        register={register}
                                                        errors={errors}
                                                        className={`form-control account-number ${errors?.sAccountHolderName && 'error'}`}
                                                        name='sAccountHolderName'
                                                        label='Account Holder Name'
                                                        placeholder='Enter account holder name'
                                                        required
                                                        onChange={(e) => {
                                                            e.target.value =
                                                                e.target.value?.trim() &&
                                                                e.target.value.replace(/^[0-9]+$/g, '')
                                                        }}
                                                        validation={{
                                                            required: {
                                                                value: true,
                                                                message: 'Account holder name is required'
                                                            },
                                                        }}
                                                    />
                                                </Col>

                                                <Col sm={6} className=''>
                                                    <CommonInput
                                                        type='text'
                                                        register={register}
                                                        errors={errors}
                                                        className={`form-control account-number ${errors?.sAccountNo && 'error'}`}
                                                        name='sAccountNo'
                                                        label='Account No'
                                                        placeholder='Enter account number'
                                                        required
                                                        validation={{
                                                            pattern: {
                                                                value: /^[0-9]+$/,
                                                                message: 'Only numbers are allowed'
                                                            },
                                                            required: {
                                                                value: true,
                                                                message: 'Mobile number is required'
                                                            },
                                                            minLength: {
                                                                value: 9,
                                                                message: 'Please enter a valid account number.'
                                                            },
                                                            maxLength: {
                                                                value: 20,
                                                                message: 'Please enter a valid account number.'
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            e.target.value =
                                                                e.target.value?.trim() &&
                                                                e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                        }}
                                                    />
                                                </Col>

                                                <Col sm={6} className=''>
                                                    <CommonInput
                                                        type='text'
                                                        register={register}
                                                        errors={errors}
                                                        className={`form-control ${errors?.sIFSC && 'error'}`}
                                                        name='sIFSC'
                                                        label='IFSC Code'
                                                        placeholder='Enter IFSC code'
                                                        required
                                                        validation={{
                                                            pattern: {
                                                                value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                                                message: 'Invalid IFSC code format.'
                                                            },
                                                            maxLength: {
                                                                value: 11,
                                                                message: 'Invalid IFSC code'
                                                            },
                                                            minLength: {
                                                                value: 11,
                                                                message: 'Invalid IFSC code'
                                                            },
                                                            required: {
                                                                value: true,
                                                                message: 'IFSC code is required'
                                                            },
                                                        }}
                                                        onChange={(e) => {
                                                            e.target.value =
                                                                e.target.value?.trim() &&
                                                                e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                        }}
                                                    />
                                                </Col>

                                                <Col sm={12} className='msg mt-3'>
                                                    <span className='bank-status'>
                                                        Status: <span className={userDetail?.aBanking?.[0]?.eState === 'approved' ? 'success' : 'danger'}>{userDetail?.aBanking?.[0]?.eState}</span>
                                                    </span>
                                                    {userDetail?.aBanking?.[0]?.eState === 'rejected' ? <span className='status-reason'>
                                                        Reason: <span className='status'>{userDetail?.aBanking?.[0]?.sDescription}</span>
                                                    </span> : ''}
                                                </Col>

                                                <Row className='mt-4'>
                                                    <Col sm={6}>
                                                        <Button variant='secondary' className='me-2' type='submit'>
                                                            Save
                                                        </Button>
                                                        <Button variant={userDetail?.aBanking?.[0]?.eState === 'approved' ? 'danger' : 'success'} onClick={userDetail?.aBanking?.[0]?.eState === 'approved' ? handleRejectBtn : handleApproveBtn}>
                                                            {userDetail?.aBanking?.[0]?.eState === 'approved' ? "Reject" : "Approve"}
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Row>
                                        </>}
                                    </Wrapper>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Form>
            </div>

            {modal?.type === 'rejection-message' &&
                <CommonPasswordModal
                    isTextArea={true}
                    modal={modal}
                    setModal={setModal}
                    bodyTitle={'Bank Info Reject'}
                    message={'Are you sure you want to reject?'}
                    register={register}
                    errors={errors}
                    name='sDescription'
                    handleConfirm={handleRejectionMsg}
                />
            }

            {modal?.type === 'approve' &&
                <CustomModal
                    open={modal.open}
                    handleClose={() => setModal({ open: false, type: '' })}
                    handleConfirm={handleConfirmApprove}
                    disableHeader
                    bodyTitle='Bank Info Approve'
                >
                    <article>
                        <h5>
                            <div>
                                Are you sure that you want to approve?
                            </div>
                        </h5>
                    </article>
                </CustomModal>
            }
        </>
    )
}

export default UserBankDetail
