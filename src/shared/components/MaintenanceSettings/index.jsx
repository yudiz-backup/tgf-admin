import React, { useEffect } from 'react'
import Wrapper from '../Wrap'
import { useMutation, useQueryClient } from 'react-query'
import { updateSetting } from 'query/settings/settings.query'
import { toaster } from 'helper/helper'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import Datetime from 'react-datetime'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'


const MaintenanceSettings = ({ settingData }) => {
    const query = useQueryClient()
    const { handleSubmit, formState: { errors }, reset, control } = useForm({ mode: 'all' })

    const eMaintenanceModeOptions = [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Disabled', value: 'disabled' },
    ]
    
    useEffect(() => {
        reset({
            eMode: eMaintenanceModeOptions?.find(item => item?.value === settingData?.oMaintenance?.eMode),
            dStartAt: moment(settingData?.oMaintenance?.dStartAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', true),
            dEndAt: moment(settingData?.oMaintenance?.dEndAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', true),
        })
    }, [settingData, reset])

    const { mutate: updateMutate } = useMutation(updateSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('Maintenance Settings has updated successfully.', 'success')
        }
    })

    async function onSubmit (data) {
        const dStartAtDate = await moment(data?.dStartAt?._d)?.tz('Asia/Kolkata')?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
        const dEndAtDate = await moment(data?.dEndAt?._d)?.tz('Asia/Kolkata')?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
        updateMutate({
            oMaintenance: {
                dStartAt: dStartAtDate,
                dEndAt: dEndAtDate,
                eMode: data?.eMode?.value
            },
            id: settingData?._id
        })
    }
    return (
        <>
            <Wrapper>
                <div className='tds-settings'>
                    <h1 className='label'>Maintenance Settings</h1><hr className='line' />

                    <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={12}>
                                <Form.Group className='form-group'>
                                    <Form.Label>Maintenance Mode</Form.Label>
                                    <Controller
                                        name='eMode'
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: 'Maintenance Mode is required'
                                            }
                                        }}
                                        render={({ field: { onChange, value, ref } }) => (
                                            <Select
                                                placeholder='Select maintenance mode'
                                                ref={ref}
                                                options={eMaintenanceModeOptions}
                                                className={`react-select border-0 ${errors.eMode && 'error'}`}
                                                classNamePrefix='select'
                                                isSearchable={false}
                                                value={value}
                                                onChange={onChange}
                                                getOptionLabel={(option) => option.label}
                                                getOptionValue={(option) => option.value}
                                            />
                                        )}
                                    />
                                    {errors.eMode && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.eMode.message}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={12} className='mt-2'>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className='form-group reSchedule-datepicker mb-2'>
                                            <Form.Label>Start Time</Form.Label>
                                            <Controller
                                                name="dStartAt"
                                                control={control}
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: 'Start time is required'
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <Datetime
                                                        {...field}
                                                        selected={field.value}
                                                        timeInputLabel="Time:"
                                                        dateFormat="MM/DD/yyyy"
                                                        showTimeInput
                                                        placeholderText='Select Start Date'
                                                        onChange={(date) => field.onChange(date)}
                                                        isClearable={true}
                                                    />
                                                )}
                                            />
                                            {errors?.dStartAt && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors?.dStartAt.message}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className='form-group reSchedule-datepicker mb-2'>
                                            <Form.Label>End Time</Form.Label>
                                            <Controller
                                                name="dEndAt"
                                                control={control}
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: 'End time is required'
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <Datetime
                                                        {...field}
                                                        selected={field.value}
                                                        timeInputLabel="Time:"
                                                        dateFormat="MM/DD/yyyy"
                                                        showTimeInput
                                                        placeholderText='Select Start Date'
                                                        onChange={(date) => field.onChange(date)}
                                                        isClearable={true}
                                                    />
                                                )}
                                            />
                                            {errors?.dEndAt && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors?.dEndAt.message}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
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

export default MaintenanceSettings

MaintenanceSettings.propTypes = {
    settingData: PropTypes.any,
}
