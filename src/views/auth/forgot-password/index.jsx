import React, { useEffect } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { forgotPassword } from 'query/auth/auth.query'
import { EMAIL } from 'shared/constants'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { toaster } from 'helper/helper'

function ForgotPassword() {
  const {
    register: fields,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onSubmit' })

  const { mutate, isLoading } = useMutation(forgotPassword, {
    onSuccess: (response) => {
      // navigate(route.resetPassword(response?.data?.sToken))
      toaster(response?.data?.message)
    }
  })
  function onSubmit(data) {
    mutate({ sEmail: data?.sEmail })
  }

  useEffect(() => {
    document.title = 'Forgot Password'
  }, [])
  return (
    <>
      <Form noValidate className='login-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='title-b'>
          <h2 className='title text-center'>
            <FormattedMessage id='forgotPassword' />
          </h2>
        </div>
        <Form.Group className='form-group'>
          <Form.Label>
            <FormattedMessage id='emailAddress' />
          </Form.Label>
          <Form.Control
            type='text'
            required
            placeholder='Enter your email address'
            name='sEmail'
            className={errors.sEmail && 'error'}
            {...fields('sEmail', {
              required: { value: true, message: validationErrors.emailRequired },
              pattern: { value: EMAIL, message: validationErrors.email }
            })}
          />
          {errors.sEmail && <Form.Control.Feedback type='invalid'>{errors.sEmail.message}</Form.Control.Feedback>}
        </Form.Group>
        <div className='mb-2'>
          <Button variant='primary' type='submit' disabled={isLoading} className='login-btn'>
            <FormattedMessage id='submit' /> {isLoading && <Spinner animation='border' size='sm' />}
          </Button>
        </div>
      
        <Link to={'/login'} className='b-link'>
          <FormattedMessage id='backToLogin' />
        </Link>
      </Form>
    </>
  )
}

export default ForgotPassword
