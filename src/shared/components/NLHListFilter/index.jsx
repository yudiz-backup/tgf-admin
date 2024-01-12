/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { gameTypeColumns } from 'shared/constants/TableHeaders'
import DatePicker from 'react-datepicker'

function NLHListFilter ({ filterChange, closeDrawer, defaultValue }) {
    const { handleSubmit, control, reset } = useForm({})
    
    useEffect(() => {
        reset({
            eStatus: statusOption?.find(item => item?.value === defaultValue?.eStatus),
            eGameType: gameTypeColumns?.find(item => item?.value === defaultValue?.eGameType)
        })
    }, [defaultValue])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    const statusOption = [
        { label: 'All', value: '' },
        { label: 'Active', value: 'y' },
        { label: 'Inactive', value: 'n' },
    ]

    function onSubmit (data) {
        filterChange({
            eStatus: data?.eStatus?.value,
            eGameType: data?.eGameType?.value,
            dateFrom: startDate?.toISOString(),
            dateTo: endDate?.toISOString()
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eStatus: 'y',
            eGameType: '',
            dateFrom: '',
            dateTo: ''
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
                            options={statusOption}
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
                    Game Type
                </Form.Label>
                <Controller
                    name='eGameType'
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                            ref={ref}
                            value={value}
                            options={gameTypeColumns}
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
NLHListFilter.propTypes = {
    filterChange: PropTypes.func,
    defaultValue: PropTypes.object,
    type: PropTypes.string
}
export default NLHListFilter
