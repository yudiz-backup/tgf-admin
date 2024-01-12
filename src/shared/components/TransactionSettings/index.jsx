import React, { useEffect } from 'react'
import Wrapper from '../Wrap'
import { Button, Col, Form, Row } from 'react-bootstrap'
import CommonInput from '../CommonInput'
import { useMutation, useQueryClient } from 'react-query'
import { updateSetting } from 'query/settings/settings.query'
import { toaster } from 'helper/helper'
import PropTypes from 'prop-types'

const TransactionSettings = ({ register, errors, reset, settingData, handleSubmit }) => {
    const query = useQueryClient()

    useEffect(() => {
        reset({
            redeemMinimum: +settingData?.oRedeem?.nMinimum,
            redeemMaximum: +settingData?.oRedeem?.nMaximum,
            purchaseMinimum: +settingData?.oPurchaseRange?.nMinimum,
            purchaseMaximum: +settingData?.oPurchaseRange?.nMaximum,
        })
    }, [settingData, reset])

    const { mutate: updateMutate } = useMutation(updateSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('Transaction Settings has updated successfully.', 'success')
        }
    })

    function onSubmit (data) {
        updateMutate({
            oRedeem: {
                nMinimum: +data?.redeemMinimum,
                nMaximum: +data?.redeemMaximum
            },
            oPurchaseRange: {
                nMinimum: +data?.purchaseMinimum,
                nMaximum: +data?.purchaseMaximum
            },
            id: settingData?._id
        })
    }
    return (
        <Wrapper>
            <div className='transaction-settings'>
                <h2 className='label'>Transaction Setting</h2><hr className='line' />

                <Row>
                    <Col lg={6} md={12}>
                        <Wrapper>
                            <div className='withdrawal'>
                                <h4 className='label'>Withdrawal Chips</h4><hr className='line' />
                                <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col sm={12}>
                                            <CommonInput
                                                name='redeemMinimum'
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.redeemMinimum && 'error'}`}
                                                label='Minimum Chips'
                                                placeholder='Enter withdrawal minimum chips'
                                                validation={{
                                                    required: {
                                                        value: true,
                                                        message: 'Withdrawal minimum chip value is required'
                                                    },
                                                    min: {
                                                        value: 1,
                                                        message: 'Value must be greater than 0.'
                                                    }
                                                }}
                                                min={1}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>
                                        <Col sm={12} className='mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.redeemMaximum && 'error'}`}
                                                name='redeemMaximum'
                                                label='Maximum Chips'
                                                placeholder='Enter withdrawal maximum chips'
                                                validation={{
                                                    required: {
                                                        value: true,
                                                        message: 'Withdrawal maximum chip value is required'
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>
                                        <Col sm={12} className='mt-3'>
                                            <Button variant='primary' type='submit'>
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Wrapper>
                    </Col>
                    <Col lg={6} md={12} className='mt-lg-0 mt-md-3 mt-sm-3 mt-3'>
                        <Wrapper>
                            <div className='deposit'>
                                <h4 className='label'>Deposit Value</h4><hr className='line' />

                                <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col sm={12}>
                                            <CommonInput
                                                name='purchaseMinimum'
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.purchaseMinimum && 'error'}`}
                                                label='Minimum Chips'
                                                placeholder='Enter deposit minimum chips'
                                                validation={{
                                                    required: {
                                                        value: true,
                                                        message: 'Deposit minimum chip value is required'
                                                    },
                                                    min: {
                                                        value: 1,
                                                        message: 'Value must be greater than 0.'
                                                    }
                                                }}
                                                min={1}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>
                                        <Col sm={12} className='mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.purchaseMaximum && 'error'}`}
                                                name='purchaseMaximum'
                                                label='Maximum Chips'
                                                placeholder='Enter deposit maximum chips'
                                                validation={{
                                                    required: {
                                                        value: true,
                                                        message: 'Deposit maximum chip value is required'
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>
                                        <Col sm={12} className='mt-3'>
                                            <Button variant='primary' type='submit'>
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Wrapper>
                    </Col>
                </Row>
            </div>
        </Wrapper>
    )
}

export default TransactionSettings

TransactionSettings.propTypes = {
    handleSubmit: PropTypes.func,
    register: PropTypes.any,
    errors: PropTypes.object,
    settingData: PropTypes.any,
    reset: PropTypes.func,
}
