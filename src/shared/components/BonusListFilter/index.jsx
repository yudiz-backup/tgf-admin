/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { useQuery } from 'react-query';
import { getPromoCodeFilterList } from 'query/promotion/promotion.query';
import { useLocation } from 'react-router-dom';
import { parseParams } from 'shared/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupee } from '@fortawesome/free-solid-svg-icons';
import { BonusCategory } from 'shared/constants/TableHeaders';

const BonusListFilter = ({ filterChange, closeDrawer, defaultValue }) => {
    const location = useLocation()
    const params = useRef(parseParams(location.search))

    function getRequestParams (e) {
        const data = e ? parseParams(e) : params.current
        return {
            bApplyFilter: +data?.bApplyFilter || true,
            nMaximumAmount: +data?.nMaximumAmount?.bApplyFilter || {
                bApplyFilter: true
            },
            nMinimumAmount: +data?.nMinimumAmount?.bApplyFilter || {
                bApplyFilter: true
            },
        }
    }

    const [requestParams] = useState(getRequestParams())
    const { handleSubmit, control, reset } = useForm({})

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    const [expiryRange, setExpiryRange] = useState([null, null]);
    const [expiryStartDate, expiryEndDate] = expiryRange

    // PROMO CODE LIST
    const { data } = useQuery(['promoCodeList', requestParams], () => getPromoCodeFilterList(requestParams), {
        select: (data) => data.data.data,
    })

    useEffect(() => {
        reset({
            iPromoCodeId: data?.find(item => item?._id === defaultValue?.iPromoCodeId),
            eCategory: BonusCategory?.find(item => item?.value === defaultValue?.eCategory)
        })
    }, [defaultValue])

    function onSubmit (data) {
        filterChange({
            iPromoCodeId: data?.iPromoCodeId?._id,
            eCategory: data?.eCategory?.value,
            dateFrom: startDate?.toISOString(),
            dateTo: endDate?.toISOString(),
            dExpiredStartDate: expiryStartDate?.toISOString(),
            dExpiredEndDate: expiryEndDate?.toISOString(),
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            iPromoCodeId: '',
            eCategory: '',
            dateFrom: '',
            dateTo: '',
            dExpiredStartDate: '',
            dExpiredEndDate: ''
        })
        closeDrawer()
    }
    return (
        <>
            <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                <Form.Group className='form-group'>
                    <Form.Label>
                        PromoCode
                    </Form.Label>
                    <Controller
                        name='iPromoCodeId'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={data}
                                className='react-select'
                                classNamePrefix='select'
                                closeMenuOnSelect={true}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                getOptionLabel={(option) => <>
                                    <div>
                                        <span className='d-flex flex-row justify-content-between'>
                                            <span>{option?.sPromoCode}</span>
                                            <span><FontAwesomeIcon icon={faIndianRupee} size='sm' /> {option?.nValue}</span>
                                        </span>
                                        <span>Description: <span className='text-success'>{option?.sDescription}</span></span>
                                    </div>
                                </>}
                                getOptionValue={(option) => option?._id}
                            />
                        )}
                    />
                </Form.Group>

                <Form.Group className='form-group'>
                    <Form.Label>
                        Bonus Category
                    </Form.Label>
                    <Controller
                        name='eCategory'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={BonusCategory}
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

                <Form.Group className='form-group'>
                    <Form.Label className='date-lable'>
                        Expiry Date Range
                    </Form.Label>
                    <Controller
                        name="dExpiryDateRange"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                selected={field.value}
                                selectsRange={true}
                                startDate={expiryStartDate}
                                endDate={expiryEndDate}
                                placeholderText='Select Date Range'
                                onChange={(date) => setExpiryRange(date)}
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

export default BonusListFilter
