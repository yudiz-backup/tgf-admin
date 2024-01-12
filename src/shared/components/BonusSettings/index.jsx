import React, { useEffect } from 'react'
import Wrapper from '../Wrap'
import { Button, Col, Form, Row } from 'react-bootstrap'
import CommonInput from '../CommonInput'
import { useMutation, useQueryClient } from 'react-query'
import { updateSetting } from 'query/settings/settings.query'
import { toaster } from 'helper/helper'
import PropTypes from 'prop-types'


const BonusSettings = ({ handleSubmit, errors, register, settingData, reset }) => {
    const query = useQueryClient()

    useEffect(() => {
        reset({
            nReferralBonus: +settingData?.nReferralBonus,
            nWelcomeBonus: +settingData?.nWelcomeBonus,
            nRakeVip: +settingData?.oReward?.nRakeVip,
            nVipBonus: +settingData?.oReward?.nVipBonus,
            nBonusCash: +settingData?.oReward?.nBonusCash
        })
    }, [settingData, reset])

    const { mutate: updateMutate } = useMutation(updateSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('Bonus Settings has updated successfully.', 'success')
        }
    })

    function onSubmit (data) {
        updateMutate({
            nReferralBonus: +data?.nReferralBonus,
            nWelcomeBonus: +data?.nWelcomeBonus,
            oReward: {
                nRakeVip: +data?.nRakeVip,
                nVipBonus: +data?.nVipBonus,
                nBonusCash: +data?.nBonusCash
            },
            id: settingData?._id
        })
    }
    return (
        <>
            <Wrapper>
                <div className='bonus-settings'>
                    <h1 className='label'>Referral Bonus & Welcome Bonus</h1><hr className='line' />

                    <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={3} md={4} sm={6}>
                                <CommonInput
                                    name='nReferralBonus'
                                    type='text'
                                    register={register}
                                    errors={errors}
                                    className={`form-control ${errors?.nReferralBonus && 'error'}`}
                                    label='Referral Bonus'
                                    placeholder='Enter referral bonus'
                                    validation={{
                                        required: {
                                            value: true,
                                            message: 'Referral Bonus is required'
                                        },
                                    }}
                                    onChange={(e) => {
                                        e.target.value =
                                            e.target.value?.trim() &&
                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                    }}
                                />
                                <span className='note'>Note: This will auto expire in 30 days</span>
                            </Col>
                            <Col lg={3} md={4} sm={6}>
                                <CommonInput
                                    type='text'
                                    register={register}
                                    errors={errors}
                                    className={`form-control ${errors?.nWelcomeBonus && 'error'}`}
                                    name='nWelcomeBonus'
                                    label='Welcome Bonus'
                                    placeholder='Enter welcome bonus'
                                    validation={{
                                        required: {
                                            value: true,
                                            message: 'Welcome Bonus is required'
                                        },
                                    }}
                                    onChange={(e) => {
                                        e.target.value =
                                            e.target.value?.trim() &&
                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                    }}
                                />
                                <span className='note'>Note: This will auto expire in 30 days</span>
                            </Col>
                            <Col lg={3} md={4} sm={6}>
                                <CommonInput
                                    name='nRakeVip'
                                    type='text'
                                    register={register}
                                    errors={errors}
                                    className={`form-control ${errors?.nRakeVip && 'error'}`}
                                    label='Rake to VIP'
                                    placeholder='Enter rake bonus'
                                    validation={{
                                        required: {
                                            value: true,
                                            message: 'Rake Bonus value is required'
                                        },
                                    }}
                                    onChange={(e) => {
                                        e.target.value =
                                            e.target.value?.trim() &&
                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                    }}
                                />
                            </Col>
                            <Col lg={3} md={4} sm={6}>
                                <CommonInput
                                    type='text'
                                    register={register}
                                    errors={errors}
                                    className={`form-control ${errors?.nVipBonus && 'error'}`}
                                    name='nVipBonus'
                                    label='VIP to Bonus'
                                    placeholder='Enter VIP bonus'
                                    validation={{
                                        required: {
                                            value: true,
                                            message: 'VIP bonus is required'
                                        },
                                    }}
                                    onChange={(e) => {
                                        e.target.value =
                                            e.target.value?.trim() &&
                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                    }}
                                />
                            </Col>
                            <Col lg={3} md={4} sm={6}>
                                <CommonInput
                                    type='text'
                                    register={register}
                                    errors={errors}
                                    className={`form-control ${errors?.nBonusCash && 'error'}`}
                                    name='nBonusCash'
                                    label='Bonus to Cash'
                                    placeholder='Enter the bonus cash value'
                                    validation={{
                                        required: {
                                            value: true,
                                            message: 'Bonus cash value is required'
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
        </>
    )
}

export default BonusSettings

BonusSettings.propTypes = {
    handleSubmit: PropTypes.func,
    register: PropTypes.any,
    errors: PropTypes.object,
    settingData: PropTypes.any,
    reset: PropTypes.func,
}
