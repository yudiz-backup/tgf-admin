import React, { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import CommonInput from 'shared/components/CommonInput'
import Wrapper from 'shared/components/Wrap'
import Select from 'react-select'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toaster } from 'helper/helper'
import { addUser } from 'query/user/user.mutation'
import { route } from 'shared/constants/AllRoutes'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { EMAIL, PASSWORD } from 'shared/constants'
import { statesColumn } from 'shared/constants/TableHeaders'
import { FormattedMessage } from 'react-intl'
import CommonPasswordModal from 'shared/components/CommonPasswordModal'

const AddUser = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, control, reset, getValues, resetField, setError, clearErrors } = useForm({ mode: 'all' })

  const eGenderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ]

  const [showPassword, setShowPassword] = useState(true)
  const [modal, setModal] = useState(false)
  const [formData, setFormData] = useState()

  // ADD USER
  const { mutate } = useMutation(addUser, {
    onSettled: (data, err) => {
      if (data) {
        toaster(data.data.message)
        navigate(route.userManagement)

        reset()
      } else {
        err.response.data.message.includes('Mobile') === true ? setError('sMobile', {
          type: 'manual',
          message: 'Mobile Number already exists.'
        }) : clearErrors('sMobile')

        err.response.data.message.includes('Email') === true ? setError('sEmail', {
          type: 'manual',
          message: 'Email already exists.'
        }) : clearErrors('sEmail')
        setModal(false)
        resetField('sUserPassword', '')
      }
    }
  })

  function onSubmit (data) {
    setFormData(data)
    setModal(true)
  }

  function handleConfirmAdd () {
    mutate({
      eGender: formData?.eGender?.value,
      sEmail: formData?.sEmail,
      sMobile: formData?.sMobile,
      sPassword: formData?.sPassword,
      sPostalCode: formData?.sPostalCode,
      sState: formData?.sState?.value,
      sUserName: formData?.sUserName,
      sUserPassword: getValues('sUserPassword')
    })
  }

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    document.title = 'Add User | PokerGold'
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
                        className={`form-control ${errors?.sUserName && 'error' }`}
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

                    <Col sm={6}>
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
                    <Col sm={6} className='mt-2'>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <FormattedMessage id='password' />
                          <span className='inputStar'>*</span>
                        </Form.Label>
                        <InputGroup className="">
                          <InputGroup>
                            <Button
                              onClick={handlePasswordToggle}
                              variant='link'
                              className='icon-right'
                            >
                              <i className={ showPassword ? 'icon-visibility' : 'icon-visibility-off' }></i>
                            </Button>
                          </InputGroup>

                          <Controller
                            name='sPassword'
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: validationErrors.passwordRequired
                              },
                              pattern: {
                                value: PASSWORD,
                                message: validationErrors.passwordRegEx
                              },
                              maxLength: {
                                value: 12,
                                message: validationErrors.rangeLength(8, 12)
                              },
                              minLength: {
                                value: 8,
                                message: validationErrors.rangeLength(8, 12)
                              }
                            }}
                            render={({ field: { onChange, value, ref } }) => (
                              <Form.Control
                                ref={ref}
                                name="sPassword"
                                className={`form-control ${errors.sPassword && "error"}`}
                                type={showPassword ? "password" : "text"}
                                value={value}
                                onChange={(e) => {
                                  onChange(e?.target?.value.trim())
                                }}
                                placeholder="Enter your password"
                              />
                            )}
                          />
                          {errors.sPassword && (
                            <Form.Control.Feedback type='invalid'>
                              {errors.sPassword.message}
                            </Form.Control.Feedback>
                          )}
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col sm={6} className='mt-2'>
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
                    <Col sm={6} className='mt-2'>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`for m-control ${errors?.sMobile && 'error'
                          }`}
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
                    <Col sm={6} className='mt-2'>
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

                    <Col sm={6} className='mt-2'>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`for m-control ${errors?.sPostalCode && 'error'
                          }`}
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

                    <Row className='mt-4'>
                      <Col sm={6}>
                        <Button variant='secondary' className='me-2' onClick={() => navigate(route.userManagement)}>
                          Cancel
                        </Button>
                        <Button variant='primary' type='submit'>
                          Add User
                        </Button>
                      </Col>
                    </Row>
                  </Row>
                </Wrapper>
              </Col>
            </Row>
          </div>
        </div>
      </Form >

      <CommonPasswordModal
        isTextArea={false}
        modal={modal}
        setModal={setModal}
        bodyTitle={'Add User'}
        message={'Are you sure want add user ?'}
        handleConfirm={handleConfirmAdd}
        confirmValue={getValues('sUserPassword')}
        register={register}
        errors={errors}
        name='sUserPassword'
      />
    </>
  )
}

export default AddUser
