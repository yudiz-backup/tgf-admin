import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { kycVerifiedColumns, statesColumn } from 'shared/constants/TableHeaders'
import DatePicker from 'react-datepicker'

function KycListFilters ({ filterChange, defaultValue, closeDrawer }) {
    const { handleSubmit, control, reset } = useForm({})

    useEffect(() => {
        reset({
            eStatus: kycVerifiedColumns?.find(item => item?.value === defaultValue?.eStatus)
        })
    }, [defaultValue, reset])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    function onSubmit (data) {
        filterChange({
            kycdateFrom: startDate,
            kycdateTo: endDate,
            eStatus: data?.eStatus?.value,
            selectedState: data?.selectedState
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eStatus: 'pending',
            kycdateFrom: '',
            kycdateTo: '',
            selectedState: []
        })
        closeDrawer()
    }

    return (
        <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Form.Group className='form-group'>
                <Form.Label>
                    Select Status
                </Form.Label>
                <Controller
                    name='eStatus'
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                            ref={ref}
                            value={value}
                            options={kycVerifiedColumns}
                            className='react-select'
                            classNamePrefix='select'
                            closeMenuOnSelect={true}
                            onChange={(e) => {
                                onChange(e)
                            }}
                        />
                    )}
                />
            </Form.Group>

            <Form.Group className='form-group'>
                <Form.Label>
                    Select State
                </Form.Label>
                <Controller
                    name='selectedState'
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                            ref={ref}
                            value={value}
                            options={statesColumn}
                            isMulti
                            className='react-select'
                            classNamePrefix='select'
                            closeMenuOnSelect={true}
                            onChange={(e) => {
                                onChange(e)
                            }}
                        />
                    )}
                />
            </Form.Group>

            <Form.Group className='form-group'>
                <Form.Label className='date-lable'>
                    Select Date Range
                </Form.Label>
                <Controller
                    name="dDateRange"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            selected={field.value}
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText='Select Date Range'
                            onChange={(date) => setDateRange(date)}
                            isClearable={true}
                            showYearDropdown
                            dateFormatCalendar="MMMM"
                            yearDropdownItemNumber={15}
                            scrollableYearDropdown
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
KycListFilters.propTypes = {
    filterChange: PropTypes.func,
    defaultValue: PropTypes.object,
    type: PropTypes.string
}
export default KycListFilters
