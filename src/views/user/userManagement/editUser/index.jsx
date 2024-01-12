import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import CommonInput from 'shared/components/CommonInput'
import Wrapper from 'shared/components/Wrap'
import Select from 'react-select'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toaster } from 'helper/helper'
import { editUser } from 'query/user/user.mutation'
import { route } from 'shared/constants/AllRoutes'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { EMAIL } from 'shared/constants'
import { statesColumn } from 'shared/constants/TableHeaders'
import CommonPasswordModal from 'shared/components/CommonPasswordModal'
import { getUserById } from 'query/user/user.query'
import DatePicker from 'react-datepicker'
import moment from 'moment'

const EditUser = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const { register, handleSubmit, formState: { errors }, control, reset, getValues, setValue } = useForm({ mode: 'all' })

    const eGenderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
    ]

    const [modal, setModal] = useState(false)
    const [formData, setFormData] = useState()

    // GET SPECIFIC USER
    useQuery('userDataById', () => getUserById(id), {
        enabled: !!id,
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            reset({
                ...data,
                eGender: eGenderOptions.find(item => item?.value === data?.eGender),
                sState: statesColumn?.find(item => item?.value === data?.oLocation?.sState),
                sPostalCode: data?.oLocation?.sPostalCode,
                sMobile: data?.sMobile?.slice(3),
                dDob: data?.dDob ? new Date(data?.dDob) : ''
            })
        }
    })

    // EDIT USER
    const { mutate } = useMutation(editUser, {
        onSettled: (response) => {
            if (response) {
                toaster(response.data.message)
                navigate(route.userManagement)
    
                reset()
            } else {
                toaster(response.data.message, 'error')
            }
        }
    })

    function onSubmit(data) {
        setFormData(data)
        setValue('sPassword', '')
        setModal(true)
    }

    function handleConfirmAdd() {
        mutate({
            id: id,
            payload: {
                sUserName: formData?.sUserName,
                sEmail: formData?.sEmail,
                sMobile: `+91${formData?.sMobile}`,
                eGender: formData?.eGender?.value,
                sPassword: getValues('sPassword'),
                sPostalCode: formData?.sPostalCode,
                sState: formData?.sState?.value,
                dDob: formData?.dDob !== '' ? moment(formData?.dDob).format('YYYY-MM-DD') : '',
                isEmailVerified: formData?.isEmailVerified,
                isMobileVerified: formData?.isMobileVerified
            }
        })
    }

    useEffect(() => {
        document.title = 'Edit User | PokerGold'
    }, [])

    return (
        <>
            <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)} >
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
                                                className={`form-control ${errors?.sUserName && 'error'}`}
                                                name='sUserName'
                                                label='User Name'
                                                placeholder='Enter user name'
                                                required
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[0-9]+$/g, '')
                                                }}
                                                validation={{
                                                    required: {
                                                        value: true,
                                                        message: validationErrors.userNameRequired
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: 'Your username must be atleast 3 characters long.'
                                                    }
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-sm-0 mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.sEmail && 'error'}`}
                                                name='sEmail'
                                                label='Email'
                                                placeholder='Enter email address'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: EMAIL,
                                                        message: validationErrors.email
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: validationErrors?.emailRequired
                                                    }
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-sm-2 mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`for m-control ${errors?.sMobile && 'error'}`}
                                                name='sMobile'
                                                label='Mobile'
                                                placeholder='Enter mobile number'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Mobile number is required'
                                                    },
                                                    minLength: {
                                                        value: 10,
                                                        message: 'Please enter a valid mobile number.'
                                                    },
                                                    maxLength: {
                                                        value: 10,
                                                        message: 'Please enter a valid mobile number.'
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-sm-2 mt-2'>
                                            <Form.Group className='form-group'>
                                                <Form.Label className='date-lable'>
                                                    <span>
                                                        Date Of Birth
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name="dDob"
                                                    control={control}
                                                    render={({ field }) => {
                                                        const maxDate = new Date()
                                                        maxDate.setFullYear(maxDate.getFullYear() - 18)
                                                        return (
                                                            <DatePicker
                                                                {...field}
                                                                selected={field.value}
                                                                placeholderText='Select Date of Birth'
                                                                onChange={(date) => {
                                                                    field.onChange(date)
                                                                }}
                                                                selectsStart
                                                                maxDate={maxDate}
                                                                minDate={null}
                                                                showYearDropdown
                                                                dateFormatCalendar="MMMM"
                                                                yearDropdownItemNumber={20}
                                                                scrollableYearDropdown
                                                                className="datepicker-inputbox border-0"
                                                            />
                                                        )
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6} className='mt-sm-2 mt-2'>
                                            <Form.Group className='form-group'>
                                                <Form.Label>
                                                    <span>
                                                        Gender
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name='eGender'
                                                    control={control}
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: validationErrors.eGenderrequired
                                                        }
                                                    }}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <Select
                                                            placeholder='Select gender'
                                                            ref={ref}
                                                            options={eGenderOptions}
                                                            className={`react-select border-0 ${errors.eGender && 'error'}`}
                                                            classNamePrefix='select'
                                                            isSearchable={false}
                                                            value={value}
                                                            onChange={onChange}
                                                            getOptionLabel={(option) => option.label}
                                                            getOptionValue={(option) => option.value}
                                                        />
                                                    )}
                                                />
                                                {errors.eGender && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.eGender.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6} className='mt-sm-2 mt-2'>
                                            <Form.Group className='form-group'>
                                                <Form.Label>
                                                    <span>
                                                        Select State
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name='sState'
                                                    control={control}
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: validationErrors.eStateRequired
                                                        }
                                                    }}
                                                    render={({ field: { onChange, value = [], ref } }) => (
                                                        <Select
                                                            ref={ref}
                                                            value={value}
                                                            options={statesColumn}
                                                            className={`react-select border-0 ${errors.sState && 'error'}`}
                                                            classNamePrefix='select'
                                                            closeMenuOnSelect={true}
                                                            onChange={(e) => {
                                                                onChange(e)
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.sState && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.sState.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col sm={6} className='mt-sm-2 mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`for m-control ${errors?.sPostalCode && 'error'}`}
                                                name='sPostalCode'
                                                label='Postal Code'
                                                placeholder='Enter postal code'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    maxLength: {
                                                        value: 6,
                                                        message: 'Postal code must be 6 digits.'
                                                    },
                                                    minLength: {
                                                        value: 6,
                                                        message: 'Postal code must be atleast 6 digits.'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Postal code is required'
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-sm-2 mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`for m-control ${errors?.nPracticeChips && 'error'}`}
                                                name='nPracticeChips'
                                                label='Practice Chips'
                                                placeholder='Enter practice chips'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Practice chips is required'
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>

                                        <Col sm={6} className='mt-sm-2 mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`for m-control ${errors?.nChips && 'error'}`}
                                                name='nChips'
                                                label='Cash'
                                                placeholder='Enter cash'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Cash is required'
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>

                                        <Row className='mt-sm-3 mt-2'>
                                            <Col lg={3} md={4} sm={4} xs={12}>
                                                <Form.Group className='form-group'>
                                                    <Form.Label className='form-checkbox-input'>
                                                        <Controller
                                                            name='isEmailVerified'
                                                            control={control}
                                                            render={({ field: { onChange, value } }) => {
                                                                return < Form.Check
                                                                    type='checkbox'
                                                                    value={value}
                                                                    checked={value}
                                                                    onChange={onChange}
                                                                />
                                                            }}
                                                        />
                                                        Email Verified
                                                    </Form.Label>
                                                </Form.Group>
                                            </Col>

                                            <Col lg={3} md={4} sm={4} xs={12}>
                                                <Form.Group className='form-group'>
                                                    <Form.Label className='form-checkbox-input'>
                                                        <Controller
                                                            name='isMobileVerified'
                                                            control={control}
                                                            render={({ field: { onChange, value } }) => {
                                                                return (
                                                                    <Form.Check
                                                                        type='checkbox'
                                                                        value={value}
                                                                        checked={value}
                                                                        onChange={onChange}
                                                                    />
                                                                )
                                                            }}
                                                        />
                                                        Mobile Verified
                                                    </Form.Label>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className='mt-sm-2 mt-2'>
                                            <Col md={12} sm={12}>
                                                <Button variant='secondary' className='me-2' onClick={() => navigate(route.userManagement)}>
                                                    Cancel
                                                </Button>
                                                <Button variant='primary' type='submit'>
                                                    Update User
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

            <CommonPasswordModal
                isTextArea={false}
                modal={modal}
                setModal={setModal}
                bodyTitle={'Update User'}
                message={'Are you sure want to update user ?'}
                handleConfirm={handleConfirmAdd}
                confirmValue={getValues('sPassword')}
                register={register}
                errors={errors}
                name='sPassword'
            />
        </>
    )
}

export default EditUser
