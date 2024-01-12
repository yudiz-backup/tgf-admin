import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker'
import { FormattedMessage } from 'react-intl';

const AdminLogsFilter = ({ filterChange, closeDrawer }) => {
    const { control, reset, handleSubmit } = useForm({ mode: 'all' })
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    function onSubmit (data) {
        filterChange({
            dStartDate: startDate?.toISOString(),
            dEndDate: endDate?.toISOString()
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            dStartDate: '',
            dEndDate: ''
        })
        closeDrawer()
    }
    return (
        <>
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

                <div className='filter-button-group'>
                    <Button variant='secondary' type='reset' onClick={onReset} className='square reset-button'>
                        <FormattedMessage id='reset' />
                    </Button>
                    <Button variant='primary' type='submit' className='square apply-button'>
                        <FormattedMessage id='apply' />
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default AdminLogsFilter
