import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { FormattedMessage } from 'react-intl'

const ScheduleTournamentTableFilter = ({ filterChange, closeDrawer, defaultValue }) => {
    const { handleSubmit, control, reset } = useForm({})

    const statusOption = [
        { label: 'Running', value: 'running' },
        { label: 'Finished', value: 'finished' }
    ]

    useEffect(() => {
        reset({
            eStatus: statusOption?.find(item => item?.value === defaultValue?.eStatus)
        })
    }, [defaultValue, reset])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    function onSubmit (data) {
        filterChange({
            eStatus: data?.eStatus?.value,
            dateFrom: startDate?.toISOString(),
            dateTo: endDate?.toISOString()
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eStatus: '',
            dateFrom: '',
            dateTo: '',
        })
        closeDrawer()
    }
  return (
    <>
      <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Form.Group className='form-group'>
                <Form.Label>
                    Status
                </Form.Label>
                <Controller
                    name='eStatus'
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                            ref={ref}
                            value={value}
                            options={statusOption}
                            className='react-select'
                            classNamePrefix='select'
                            closeMenuOnSelect={true}
                            onChange={(e) => {
                                onChange(e)
                            }}
                            getOptionLabel={(option) => option?.label}
                            getOptionValue={(option) => option?.value}
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

export default ScheduleTournamentTableFilter
