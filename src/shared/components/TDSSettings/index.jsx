import React, { useEffect } from 'react'
import Wrapper from '../Wrap'
import { useMutation, useQueryClient } from 'react-query'
import { updateSetting } from 'query/settings/settings.query'
import { toaster } from 'helper/helper'
import { Button, Col, Form, Row } from 'react-bootstrap'
import CommonInput from '../CommonInput'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

const TDSSettings = ({ settingData }) => {
    const query = useQueryClient()
    const { handleSubmit, formState: { errors }, reset, register } = useForm({ mode: 'all' })

    useEffect(() => {
        reset({
            nDeduction: +settingData?.oTax?.nDeduction,
            nOffset: +settingData?.oTax?.nOffset
        })
    }, [settingData, reset])

    const { mutate: updateMutate } = useMutation(updateSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('TDS Settings has updated successfully.', 'success')
        }
    })

    function onSubmit (data) {
        updateMutate({
            oTax: {
                nDeduction: +data?.nDeduction,
                nOffset: +data?.nOffset,
            },
            id: settingData?._id
        })
    }
    return (
        <Wrapper>
            <div className='tds-settings'>
                <h1 className='label'>TDS Settings</h1><hr className='line' />

                <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <CommonInput
                                name='nDeduction'
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nDeduction && 'error'}`}
                                label='TDS (%)'
                                placeholder='Enter TDS deduction percentage'
                                validation={{
                                    required: {
                                        value: true,
                                        message: 'TDS deduction percentage is required'
                                    },
                                }}
                                onChange={(e) => {
                                    e.target.value =
                                        e.target.value?.trim() &&
                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                            />
                        </Col>
                        <Col sm={6}>
                            <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nOffset && 'error'}`}
                                name='nOffset'
                                label='Offset'
                                placeholder='Enter TDS offset'
                                validation={{
                                    required: {
                                        value: true,
                                        message: 'TDS offset value is required'
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
    )
}

export default TDSSettings

TDSSettings.propTypes = {
    settingData: PropTypes.any,
}
