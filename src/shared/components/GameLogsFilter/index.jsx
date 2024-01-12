/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { Controller } from 'react-hook-form'
import { Button, Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-query'
import { getNameDropdownList } from 'query/logs/gameLogs/gameLogs.query'

const GameLogsFilter = ({ filterChange, type, defaultValue, closeDrawer, handleSubmit, reset, control }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    const eStatusOption = [
        { label: 'Running', value: 'running' },
        { label: 'Finished', value: 'finished' },
    ]

    const pokerTypeColumns = [
        { label: 'All', value: '' },
        { label: 'NLH', value: 'NLH' },
        { label: 'PLO', value: 'PLO' },
        { label: 'OFC', value: 'OFC' },
    ]

    // NAME LIST
    const { data: dropdown } = useQuery(['nameDropdownLogsList', defaultValue], () => getNameDropdownList(defaultValue), {
        select: (data) => data.data.data,
    })

    useEffect(() => {
        reset({
            eStatus: eStatusOption?.find(item => item?.value === defaultValue?.eStatus),
            ePokerType: pokerTypeColumns?.find(item => item?.value === defaultValue?.ePokerType),
            search: dropdown?.find(item => item?.sValue === defaultValue?.search)
        })
    }, [defaultValue, dropdown])

    function onSubmit (data) {
        filterChange({
            eStatus: data?.eStatus?.value,
            ePokerType: data?.ePokerType?.value,
            search: data?.search?.sValue,
            dateFrom: startDate?.toISOString(),
            dateTo: endDate?.toISOString()
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eStatus: 'running',
            ePokerType: '',
            search: '',
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
                        Select Status
                    </Form.Label>
                    <Controller
                        name='eStatus'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={eStatusOption}
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
                        Select Name
                    </Form.Label>
                    <Controller
                        name='search'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={dropdown}
                                className='react-select'
                                classNamePrefix='select'
                                closeMenuOnSelect={true}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                getOptionLabel={(option) => option?.sName}
                                getOptionValue={(option) => option?.sValue}
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

export default GameLogsFilter
