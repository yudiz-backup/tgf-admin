/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import DatePicker from 'react-datepicker';

function WinnerStatisticFilter ({ filterChange, type, defaultValue, closeDrawer }) {
    const { handleSubmit, control, reset } = useForm({})

    const [dateRange, setDateRange] = useState([null, null])
    const [startDate, endDate] = dateRange

    useEffect(() => {
        reset({
            dStartDate: defaultValue.dStartDate,
            dEndDate: defaultValue.dEndDate,
            pageSize: pageSize?.find(item => item?.value === defaultValue?.nLimit)
        })
    }, [defaultValue, reset])

    function onSubmit (data) {
        filterChange({ dStartDate: startDate?.toISOString(), dEndDate: endDate?.toISOString(), pageSize: data.pageSize })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({ dStartDate: '', dEndDate: '', pageSize: pageSize?.[0] })
        closeDrawer()
    }

    const pageSize = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 30, value: 30 },
        { label: 40, value: 40 },
        { label: 50, value: 50 },
        { label: 100, value: 100 },
    ]

    return (
        <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
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

            <Form.Group className='form-group'>
                <Form.Label>
                    Select Page size
                </Form.Label>
                <Controller
                    name='pageSize'
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                            ref={ref}
                            value={value}
                            options={pageSize}
                            className='react-select'
                            classNamePrefix='select'
                            closeMenuOnSelect={true}
                            onChange={onChange}
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

WinnerStatisticFilter.propTypes = {
    filterChange: PropTypes.func,
    defaultValue: PropTypes.object,
    type: PropTypes.string
}
export default WinnerStatisticFilter
