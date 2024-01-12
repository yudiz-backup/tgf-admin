import React, { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import Wrapper from '../Wrap'
import { Button, Col, Form, Row } from 'react-bootstrap'
import CommonInput from '../CommonInput'
import { updateSetting } from 'query/settings/settings.query'
import { toaster } from 'helper/helper'
import PropTypes from 'prop-types'


const BasicSettings = ({ handleSubmit, register, errors, settingData, reset }) => {
    const query = useQueryClient()

    useEffect(() => {
        reset({
            nDefaultChips: settingData?.nDefaultChips,
            nDefaultPracticeChips: settingData?.nDefaultPracticeChips
        })
    }, [settingData, reset])

    const { mutate: updateMutate } = useMutation(updateSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('Basic Settings has updated successfully.', 'success')
        }
    })

    function onSubmit (data) {
        updateMutate({
            nDefaultChips: +data?.nDefaultChips,
            nDefaultPracticeChips: +data?.nDefaultPracticeChips,
            id: settingData?._id
        })
    }
    return (
        <>
            <Wrapper>
                <div className='basic-settings'>
                    <h2 className='label'>Basic Setting</h2><hr className='line' />
                    <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={12}>
                                <CommonInput
                                    name='nDefaultChips'
                                    type='text'
                                    register={register}
                                    errors={errors}
                                    className={`form-control ${errors?.nDefaultChips && 'error'}`}
                                    label='Welcome Chips'
                                    placeholder='Enter welcome chips'
                                    validation={{
                                        required: {
                                            value: true,
                                            message: 'Default chip value is required'
                                        },
                                        min: {
                                            value: 1,
                                            message: 'Value must be greater than 0.'
                                        }
                                    }}
                                    onChange={(e) => {
                                        e.target.value =
                                            e.target.value?.trim() &&
                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                    }}
                                    min={1}
                                />
                            </Col>
                            <Col sm={12} className='mt-2'>
                                <CommonInput
                                    type='text'
                                    register={register}
                                    errors={errors}
                                    className={`form-control ${errors?.nDefaultPracticeChips && 'error'}`}
                                    name='nDefaultPracticeChips'
                                    label='Default Practice Chips'
                                    placeholder='Enter default practice chips value'
                                    validation={{
                                        required: {
                                            value: true,
                                            message: 'Default practice chip value is required'
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

export default BasicSettings

BasicSettings.propTypes = {
    handleSubmit: PropTypes.func,
    register: PropTypes.any,
    errors: PropTypes.object,
    settingData: PropTypes.any,
    reset: PropTypes.func,
}

