import React, { useEffect, useState } from 'react';
import { toaster } from 'helper/helper';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import CommonInput from 'shared/components/CommonInput';
import Wrapper from 'shared/components/Wrap';
import { route } from 'shared/constants/AllRoutes';
import { validationErrors } from 'shared/constants/ValidationErrors';
import Select from 'react-select'
import moment from 'moment-timezone'
import Datetime from 'react-datetime';
import { addPromoCode } from 'query/promotion/promoCode/promoCode.query';

function AddPromoCode () {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, control, reset, getValues, watch } = useForm({ mode: 'all' })

    const eBonusTypeOptions = [
        { label: 'Amount', value: 'amount' },
        { label: 'Percentage', value: 'percentage' },
    ]

    const ePromCodeTypeOptions = [
        { label: 'Limited', value: 'limited' },
        { label: 'Unlimited', value: 'unlimited' },
    ]

    const isFTDOptions = [
        { label: 'True', value: true },
        { label: 'False', value: false },
    ]

    const [date, setDate] = useState(null)
    const [key, setKey] = useState(0)

    // ADD USER
    const { mutate } = useMutation(addPromoCode, {
        onSuccess: (response) => {
            toaster(response.data.message)
            navigate(route.promoCode)

            reset()
        }
    })

    function onSubmit (data) {
        const dStartDate = moment(data?.dStartAt._d).tz('Asia/Kolkata').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)')
        const dEndDate = moment(data?.dEndAt._d).tz('Asia/Kolkata').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)')

        mutate({
            sPromoCode: data?.sPromoCode,
            sDescription: data?.sDescription,
            nValue: +data?.nValue,
            nValueValidity: +data?.nValueValidity,
            eValueType: data?.eValueType?.value,
            nCapped: +data?.nCapped || '',
            nUserClaims: +data?.nUserClaims || '',
            nMaximumAmount: +data?.nMaximumAmount,
            isFTD: data?.isFTD?.value,
            oCodeValidity: {
                dStartAt: dStartDate,
                dEndAt: dEndDate
            },
            oAmountRange: {
                nMinimum: +data?.nMinimum,
                nMaximum: +data?.nMaximum
            }
        })
    }

    useEffect(() => {
        document.title = 'Add PromoCode | Promotion | PokerGold'
    }, [])
    return (
        <>
            <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <div className='personal-details'>
                    <div className='user-form'>
                        <Row>
                            <Col xxl={8}>
                                <Wrapper>
                                    <Row>
                                        <Col sm={6}>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.sPromoCode && 'error'}`}
                                                name='sPromoCode'
                                                label='PromoCode'
                                                placeholder='Enter the PromoCode'
                                                required
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.toUpperCase()
                                                }}
                                                validation={{
                                                    required: {
                                                        value: true,
                                                        message: validationErrors.promoCodeRequired
                                                    },
                                                    maxLength: {
                                                        value: 10,
                                                        message: 'PromoCode must be of 10 characters.'
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9]+$/,
                                                        message: 'PromoCode must be only Alphanumeric without any space or special characters.'
                                                    },
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-0 mt-sm-0 mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.sDescription && 'error'}`}
                                                name='sDescription'
                                                label='Description'
                                                placeholder='Enter the promo-code description'
                                                required
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value
                                                }}
                                                validation={{
                                                    required: {
                                                        value: true,
                                                        message: 'PromoCode description is required'
                                                    },
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.nValue && 'error'}`}
                                                name='nValue'
                                                label='Bonus Value'
                                                placeholder='Enter the bonus value'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Bonus value is required'
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.nValueValidity && 'error'}`}
                                                name='nValueValidity'
                                                label='Bonus Expiry (In Days)'
                                                placeholder='Enter the bonus expiry in Days'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Bonus expires is required'
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-2'>
                                            <Form.Group className='form-group'>
                                                <Form.Label>
                                                    <span>
                                                        Bonus Type
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name='eValueType'
                                                    control={control}
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: 'Bonus type is required'
                                                        }
                                                    }}
                                                    defaultValue={eBonusTypeOptions?.[0]}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <Select
                                                            placeholder='Select bonus type'
                                                            ref={ref}
                                                            options={eBonusTypeOptions}
                                                            className={`react-select border-0 ${errors.eValueType && 'error'}`}
                                                            classNamePrefix='select'
                                                            isSearchable={false}
                                                            value={value}
                                                            onChange={onChange}
                                                            getOptionLabel={(option) => option.label}
                                                            getOptionValue={(option) => option.value}
                                                        />
                                                    )}
                                                />
                                                {errors.eValueType && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.eValueType.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        {watch('eValueType')?.value === 'percentage' &&
                                            <Col sm={6} className='mt-2'>
                                                <CommonInput
                                                    type='text'
                                                    register={register}
                                                    errors={errors}
                                                    className={`form-control ${errors?.nCapped && 'error'}`}
                                                    name='nCapped'
                                                    label='Capped Value'
                                                    placeholder='Enter the capped value'
                                                    required
                                                    validation={{
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Only numbers are allowed'
                                                        },
                                                        required: {
                                                            value: true,
                                                            message: validationErrors?.cappedValueRequired
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        e.target.value =
                                                            e.target.value?.trim() &&
                                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                    }}
                                                />
                                            </Col>
                                        }

                                        <Col sm={6} className='mt-2'>
                                            <Form.Group className='form-group'>
                                                <Form.Label>
                                                    <span>
                                                        PromoCode Type
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name='ePromoCodeType'
                                                    control={control}
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: 'PromoCode type is required'
                                                        }
                                                    }}
                                                    defaultValue={ePromCodeTypeOptions?.[1]}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <Select
                                                            placeholder='Select promo code type'
                                                            ref={ref}
                                                            options={ePromCodeTypeOptions}
                                                            className={`react-select border-0 ${errors.ePromoCodeType && 'error'}`}
                                                            classNamePrefix='select'
                                                            isSearchable={false}
                                                            value={value}
                                                            onChange={onChange}
                                                            getOptionLabel={(option) => option.label}
                                                            getOptionValue={(option) => option.value}
                                                        />
                                                    )}
                                                />
                                                {errors.ePromoCodeType && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.ePromoCodeType.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        {watch('ePromoCodeType')?.value === 'limited' &&
                                            <Col sm={6} className='mt-2'>
                                                <CommonInput
                                                    type='text'
                                                    register={register}
                                                    errors={errors}
                                                    className={`form-control ${errors?.nUserClaims && 'error'}`}
                                                    name='nUserClaims' // if unlimited -1
                                                    label='No. of Claims as per user'
                                                    placeholder='Enter the number of claims'
                                                    required
                                                    validation={{
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Only numbers are allowed'
                                                        },
                                                        required: {
                                                            value: true,
                                                            message: validationErrors?.cappedValueRequired
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        e.target.value =
                                                            e.target.value?.trim() &&
                                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                    }}
                                                />
                                            </Col>
                                        }

                                        <Col lg={6} md={12} sm={12} className='mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.nMaximumAmount && 'error'}`}
                                                name='nMaximumAmount' // if unlimited -1
                                                label='Bonus Maximum Amount (can get it in split transactions)'
                                                placeholder='Enter the bonus maximum amount'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: validationErrors?.bonusMaxAmountRequired
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-2'>
                                            <Form.Group className='form-group'>
                                                <Form.Label>
                                                    <span>
                                                        First Time Depositor
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name='isFTD'
                                                    control={control}
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: 'First time depositor is required'
                                                        }
                                                    }}
                                                    defaultValue={isFTDOptions?.[1]}
                                                    render={({ field: { onChange, value = [], ref } }) => (
                                                        <Select
                                                            ref={ref}
                                                            value={value}
                                                            options={isFTDOptions}
                                                            className={`react-select border-0 ${errors.isFTD && 'error'}`}
                                                            classNamePrefix='select'
                                                            closeMenuOnSelect={true}
                                                            onChange={(e) => {
                                                                onChange(e)
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.isFTD && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.isFTD.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Row>
                                            <Col xl={6} lg={6} md={12} sm={12} className='mt-3'>
                                                <Wrapper>
                                                    <h3>PromoCode Validity</h3>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Group className='form-group reSchedule-datepicker mb-2'>
                                                                <Form.Label>
                                                                    <span>
                                                                        Start Time
                                                                        <span className='inputStar'>*</span>
                                                                    </span>
                                                                </Form.Label>
                                                                <Controller
                                                                    name="dStartAt"
                                                                    control={control}
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Start date is required'
                                                                        }
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <Datetime
                                                                            id="datetime"
                                                                            key={key}
                                                                            inputProps={{
                                                                                placeholder: 'Select date and time',
                                                                            }}
                                                                            isValidDate={(currentDate, selectedDate) => {
                                                                                return !currentDate.isBefore(new Date(), 'day');
                                                                            }}
                                                                            value={date?.name === 'startDate' && date?.data}
                                                                            onChange={(date) => {
                                                                                field.onChange(date || null)
                                                                                setDate({ data: date, name: 'startDate' } || null)
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.dStartAt && (
                                                                    <Form.Control.Feedback type='invalid'>
                                                                        {errors.dStartAt.message}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className='form-group reSchedule-datepicker mb-2'>
                                                                <Form.Label>
                                                                    <span>
                                                                        End Time
                                                                        <span className='inputStar'>*</span>
                                                                    </span>
                                                                </Form.Label>
                                                                <Controller
                                                                    name="dEndAt"
                                                                    control={control}
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Start date is required'
                                                                        }
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <Datetime
                                                                            id="datetime"
                                                                            key={key}
                                                                            inputProps={{
                                                                                placeholder: 'Select date and time',
                                                                            }}
                                                                            isValidDate={(currentDate, selectedDate) => {
                                                                                return (
                                                                                    !currentDate.isBefore(new Date(), 'day') &&
                                                                                    (getValues('dStartAt') ? !currentDate.isBefore(getValues('dStartAt'), 'day') : true)
                                                                                );
                                                                            }}
                                                                            value={date?.name === 'endDate' && date?.data}
                                                                            onChange={(date) => {
                                                                                field.onChange(date || null)
                                                                                setDate({ data: date, name: 'endDate' } || null)
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.dEndAt && (
                                                                    <Form.Control.Feedback type='invalid'>
                                                                        {errors.dEndAt.message}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Wrapper>
                                            </Col>
                                            <Col xl={6} lg={6} md={12} sm={12} className='mt-3'>
                                                <Wrapper>
                                                    <h3>Valid for Amount</h3>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <CommonInput
                                                                type='text'
                                                                register={register}
                                                                errors={errors}
                                                                className={`form-control ${errors?.nMinimum && 'error'}`}
                                                                name='nMinimum'
                                                                label='Minimum'
                                                                placeholder='Enter the minimum value'
                                                                required
                                                                validation={{
                                                                    pattern: {
                                                                        value: /^[0-9]+$/,
                                                                        message: 'Only numbers are allowed'
                                                                    },
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Minimum value is required'
                                                                    },
                                                                }}
                                                                onChange={(e) => {
                                                                    e.target.value =
                                                                        e.target.value?.trim() &&
                                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col sm={6}>
                                                            <CommonInput
                                                                type='text'
                                                                register={register}
                                                                errors={errors}
                                                                className={`form-control ${errors?.nMaximum && 'error'}`}
                                                                name='nMaximum'
                                                                label='Maximum'
                                                                placeholder='Enter the maximum value'
                                                                disabled={!watch('nMinimum')}
                                                                required
                                                                validation={{
                                                                    pattern: {
                                                                        value: /^[0-9]+$/,
                                                                        message: 'Only numbers are allowed'
                                                                    },
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Maximum value is required'
                                                                    },
                                                                    min: {
                                                                        value: watch('nMinimum'),
                                                                        message: 'Maximum value must be greater than Minimum value.'
                                                                    }
                                                                }}
                                                                min={watch('nMinimum')}
                                                                onChange={(e) => {
                                                                    e.target.value =
                                                                        e.target.value?.trim() &&
                                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Wrapper>
                                            </Col>
                                        </Row>

                                        <Row className='mt-4'>
                                            <Col sm={12}>
                                                <Button variant='secondary' className='me-2' onClick={() => navigate(route.promoCode)}>
                                                    Cancel
                                                </Button>
                                                <Button variant='primary' type='submit'>
                                                    Add PromoCode
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                </Wrapper>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Form>
        </>
    )
}

export default AddPromoCode