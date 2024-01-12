/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { paymentMediumColumns, pokerTypeColumns, transactionDoneByColumns, transactionStatusColumns, transactionTypeColumns } from 'shared/constants/TableHeaders'
import DatePicker from 'react-datepicker'

function TransactionFilter ({ filterChange, type, defaultValue, closeDrawer, buttonToggle, location }) {
    const { handleSubmit, control, reset } = useForm({})

    const DescriptionOption = [
        { label: 'Yes', value: true },
        { label: 'No', value: '' },
    ]

    const userTypeColumn = [
        { label: 'All', value: '' },
        { label: 'User', value: 'user' },
        { label: 'Bot', value: 'ubot' },
    ]

    useEffect(() => {
        reset({
            sDescription: DescriptionOption?.find(item => item?.value === defaultValue?.sDescription),
            eStatus: transactionStatusColumns?.find(item => item?.value === defaultValue?.eStatus),
            eMedium: paymentMediumColumns?.find(item => item?.value === defaultValue?.eMedium),
            ePokerType: pokerTypeColumns?.find(item => item?.value === defaultValue?.ePokerType),
            eSource: transactionDoneByColumns?.find(item => item?.value === defaultValue?.eSource),
            eType: transactionTypeColumns?.find(item => item?.value === defaultValue?.eType),
            eUserType: userTypeColumn?.find(item => item?.value === defaultValue?.eUserType),
        })
    }, [defaultValue])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    function onSubmit (data) {
        filterChange({
            eCategory: data?.eCategory?.value,
            dExpiredStartDate: startDate?.toISOString(),
            dExpiredEndDate: endDate?.toISOString(),
            dateFrom: startDate?.toISOString(),
            dateTo: endDate?.toISOString(),
            sDescription: data?.sDescription?.value,
            eStatus: data?.eStatus?.value,
            eMedium: data?.eMedium?.value,
            ePokerType: data?.ePokerType?.value,
            eSource: data?.eSource?.value,
            eType: data?.eType?.value,
            eUserType: data?.eUserType?.value,
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eCategory: '',
            dateFrom: '',
            dateTo: '',
            dExpiredStartDate: '',
            dExpiredEndDate: '',
            sDescription: '',
            eStatus: '',
            eMedium: '',
            ePokerType: '',
            eSource: '',
            eType: '',
            eUserType: '',
        })
        closeDrawer()
    }

    return (
        <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            {location?.pathname?.startsWith('/finance') &&
                <>

                    <Form.Group className='form-group'>
                        <Form.Label>
                            Welcome Chip Transaction
                        </Form.Label>
                        <Controller
                            name='sDescription'
                            control={control}
                            render={({ field: { onChange, value = [], ref } }) => (
                                <Select
                                    ref={ref}
                                    value={value}
                                    options={DescriptionOption}
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
                            Transaction Type
                        </Form.Label>
                        <Controller
                            name='eType'
                            control={control}
                            render={({ field: { onChange, value = [], ref } }) => (
                                <Select
                                    ref={ref}
                                    value={value}
                                    options={transactionTypeColumns}
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
                            Poker Type
                        </Form.Label>
                        <Controller
                            name='ePokerType'
                            control={control}
                            render={({ field: { onChange, value = [], ref } }) => (
                                <Select
                                    ref={ref}
                                    value={value}
                                    options={pokerTypeColumns}
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
                                    options={userTypeColumn}
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
                </>
            }

            <Form.Group className='form-group'>
                <Form.Label>
                    {buttonToggle?.Withdrawal ? 'Withdrawal Status' : 'Transaction Status'}
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
                            options={transactionDoneByColumns}
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

            {buttonToggle?.Transaction && <>
                <Form.Group className='form-group'>
                    <Form.Label>
                        Transaction type
                    </Form.Label>
                    <Controller
                        name='eType'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={transactionTypeColumns}
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
                        Poker type
                    </Form.Label>
                    <Controller
                        name='ePokerType'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={pokerTypeColumns}
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
            </>}


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
TransactionFilter.propTypes = {
    filterChange: PropTypes.func,
    defaultValue: PropTypes.object,
    type: PropTypes.string
}
export default TransactionFilter
