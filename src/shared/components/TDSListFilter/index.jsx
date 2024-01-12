import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { FormattedMessage } from 'react-intl';

const TDSListFilter = ({ filterChange, closeDrawer, defaultValue, handleSubmit, control, reset }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    const typeOptions = [
        { label: 'TDS', value: 'tds' },
        { label: 'RAKE', value: 'rake' },
    ]

    const userTypeOptions = [
        { label: 'All', value: '' },
        { label: 'User', value: 'user' },
        { label: 'Bot', value: 'ubot' },
    ]

    useEffect(() => {
        reset({
            eType: typeOptions?.find(type => type?.value === defaultValue?.eType),
            eUserType: userTypeOptions?.find(type => type?.value === defaultValue?.eUserType),
        })
    }, [defaultValue, reset])

    function onSubmit (data) {
        filterChange({
            eType: data?.eType?.value,
            eUserType: data?.eUserType?.value,
            dateFrom: startDate?.toISOString(),
            dateTo: endDate?.toISOString()
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eType: 'tds',
            eUserType: '',
            dateFrom: '',
            dateTo: ''
        })
        closeDrawer()
    }
    return (
        <>
            <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                <Form.Group className='form-group'>
                    <Form.Label>
                        Select TDS/ Rake
                    </Form.Label>
                    <Controller
                        name='eType'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={typeOptions}
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
                        User Type
                    </Form.Label>
                    <Controller
                        name='eUserType'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={userTypeOptions}
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

export default TDSListFilter
