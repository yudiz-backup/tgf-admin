/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { FormattedMessage } from 'react-intl';

const BannerFilter = ({ filterChange, closeDrawer, defaultValue }) => {
    const { handleSubmit, control, reset } = useForm({})

    useEffect(() => {
        reset({
            eRoute: routeOption?.find(item => item?.value === defaultValue?.eRoute)
        })
    }, [defaultValue])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    const routeOption = [
        { label: 'All', value: '' },
        { label: 'Tournament', value: 'tournament' },
        { label: 'Store', value: 'store' },
    ]

    function onSubmit (data) {
        filterChange({
            eRoute: data?.eRoute?.value,
            dStartDate: startDate?.toISOString(),
            dEndDate: endDate?.toISOString()
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eRoute: '',
            dStartDate: '',
            dEndDate: ''
        })
        closeDrawer()
    }

    return (
        <>
            <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                <Form.Group className='form-group'>
                    <Form.Label>
                        Route
                    </Form.Label>
                    <Controller
                        name='eRoute'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={routeOption}
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
        </>
    )
}

export default BannerFilter
