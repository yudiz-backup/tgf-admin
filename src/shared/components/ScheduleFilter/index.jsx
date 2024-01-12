/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import { stateColumns } from 'shared/constants/TableHeaders'
import DatePicker from 'react-datepicker'

const ScheduleFilter = ({ filterChange, closeDrawer, defaultValue }) => {
    const { handleSubmit, control, reset } = useForm({})

    useEffect(() => {
        reset({
            eState: stateColumns?.find(item => item?.value === defaultValue?.eState),
            eType: tournamentTypeColumns?.find(item => item?.value === defaultValue?.eType),
            eStatus: statusColumns?.find(item => item?.value === defaultValue?.eStatus) 
        })
    }, [defaultValue])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    const statusColumns = [
        { label: 'All', value: '' },
        { label: 'Active', value: 'y' },
        { label: 'Inactive', value: 'n' },
        { label: 'Deleted', value: 'd' },
    ]

    const tournamentTypeColumns = [
        { label: 'All', value: '' },
        { label: 'Spin Up', value: 'spin-up' },
        { label: 'MTT', value: 'mtt' },
    ]

    function onSubmit (data) {
        filterChange({
            eStatus: data?.eStatus?.value,
            eState: data?.eState?.value,
            eType: data?.eType?.value,
            dStartDate: startDate?.toISOString(),
            dEndDate: endDate?.toISOString()
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eStatus: '',
            eState: '',
            eType: '',
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
                        State
                    </Form.Label>
                    <Controller
                        name='eState'
                        control={control}
                        defaultValue={stateColumns?.[0]}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={stateColumns}
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
                        Tournament Type
                    </Form.Label>
                    <Controller
                        name='eType'
                        control={control}
                        defaultValue={statusColumns?.[0]}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={tournamentTypeColumns}
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
                        Status
                    </Form.Label>
                    <Controller
                        name='eStatus'
                        control={control}
                        defaultValue={statusColumns?.[0]}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={statusColumns}
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

export default ScheduleFilter
