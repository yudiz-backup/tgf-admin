/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker';

function UserOperationFilter ({ filterChange, type, defaultValue, closeDrawer }) {
    const { handleSubmit, control, getValues, reset } = useForm({});

    useEffect(() => {
        reset({ dStartDate: defaultValue?.startDate, dEndDate: defaultValue?.endDate })
    }, [])

    function onSubmit (data) {
        filterChange({ dStartDate: data?.dStartDate, dEndDate: data?.dEndDate })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({ dStartDate: '', dEndDate: '' })
        closeDrawer()
    }


    return (
        <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Form.Group className='form-group'>
                <Form.Label className='date-lable'>
                    Select start Date
                </Form.Label>
                <Controller
                    name="dStartDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            selected={field.value}
                            placeholderText='Select Start Date'
                            onChange={(date) => field.onChange(date)}
                            selectsStart
                            startDate={field.value}
                            endDate={getValues('dEndDate')}
                            className="datepicker-inputbox"
                        />
                    )}
                />
            </Form.Group>
            <Form.Group className='form-group'>
                <Form.Label className='date-lable'>
                    Select end Date
                </Form.Label>
                <Controller
                    name="dEndDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            selected={field.value}
                            placeholderText='Select End Date'
                            onChange={(date) => field.onChange(date)}
                            selectsEnd
                            startDate={getValues('dStartDate')}
                            endDate={field.value}
                            minDate={getValues('dStartDate')}
                            className="datepicker-inputbox"
                        />
                    )}
                />
            </Form.Group>
            <div className='filter-button-group'>
                <Button variant='secondary' type='reset' onClick={onReset} className='square reset-button'>
                    <FormattedMessage id='reset' />
                </Button>
                <Button variant='primary' type='submit' className='square apply-button'>
                    <FormattedMessage id='apply' />
                </Button>
            </div>
        </Form>
    )
}
UserOperationFilter.propTypes = {
    filterChange: PropTypes.func,
    defaultValue: PropTypes.object,
    type: PropTypes.string
}
export default UserOperationFilter
