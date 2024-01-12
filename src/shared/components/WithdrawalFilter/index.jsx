import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { paymentMediumColumns, transactionStatusColumns } from 'shared/constants/TableHeaders'
import DatePicker from 'react-datepicker'
import { FormattedMessage } from 'react-intl'

const WithdrawalFilter = ({ filterChange, defaultValue, closeDrawer }) => {
    const { handleSubmit, control, reset } = useForm({})

    const transactionColumns = [
        { label: 'All', value: '' },
        { label: 'Admin', value: 'admin' },
        { label: 'Bank', value: 'bank' },
    ]

    useEffect(() => {
        reset({
            eStatus: transactionStatusColumns?.find(item => item?.value === defaultValue?.eStatus),
            eSource: transactionColumns?.find(item => item?.value === defaultValue?.eSource),
            eMedium: paymentMediumColumns?.find(item => item?.value === defaultValue?.eMedium),
        })
    }, [defaultValue, reset])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    const [withdrawalRange, setWithdrawalRange] = useState([null, null]);
    const [startWithdrawalDate, endWithdrawalDate] = withdrawalRange

    function onSubmit (data) {
        filterChange({
            dateFrom: startDate?.toISOString(),
            dateTo: endDate?.toISOString(),
            dUpdatedStartDate: startWithdrawalDate?.toISOString(),
            dUpdatedEndDate: endWithdrawalDate?.toISOString(),
            eMedium: data?.eMedium?.value,
            eSource: data?.eSource?.value,
            eStatus: data?.eStatus?.value
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            dateFrom: '',
            dateTo: '',
            eStatus: 'pending',
            eMedium: '',
            eSource: '',
            dUpdatedStartDate: '',
            dUpdatedEndDate: ''
        })
        closeDrawer()
    }
    return (
        <>
            <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                <Form.Group className='form-group'>
                    <Form.Label>
                        Withdrawal Status
                    </Form.Label>
                    <Controller
                        name='eStatus'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={transactionStatusColumns}
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
                        Transaction Done By
                    </Form.Label>
                    <Controller
                        name='eSource'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={transactionColumns}
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
                        Payment Medium
                    </Form.Label>
                    <Controller
                        name='eMedium'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={paymentMediumColumns}
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
                        Withdrawal Date Range
                    </Form.Label>
                    <Controller
                        name="dWithdrawalRange"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                selected={field.value}
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText='Select Date Range'
                                onChange={(date) => setWithdrawalRange(date)}
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
                    <Form.Label className='date-lable'>
                        Last Updated Date Range
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

export default WithdrawalFilter
