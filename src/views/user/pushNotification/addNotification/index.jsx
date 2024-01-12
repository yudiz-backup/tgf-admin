import React, { useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import CommonInput from 'shared/components/CommonInput'
import Wrapper from 'shared/components/Wrap'
import Select from 'react-select'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { fileToDataUri, toaster } from 'helper/helper'
import { route } from 'shared/constants/AllRoutes'
import Datetime from 'react-datetime';
import moment from 'moment-timezone'
import { addNotification } from 'query/push/push.query'

const AddNotification = () => {
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: 'all' })

    const eUserTypeOptions = [
        { label: 'All Users', value: 'all' },
        { label: 'Active Users', value: 'active' },
        { label: 'Inactive Users', value: 'inactive' },
        { label: 'CSV Users', value: 'csv' },
    ]

    const eSchedule = [
        { label: 'Immediate', value: 'immediate' },
        { label: 'Schedule Time', value: 'scheduled' },
    ]

    // ADD NOTIFICATION
    const { mutate } = useMutation(addNotification, {
        onSuccess: (response) => {
            toaster(response.data.message)
            navigate(route.pushNotification)

            reset({})
        }
    })

    function onSubmit (data) {
        const formData = new FormData()
  
        const fileName = data?.file

        const addData = {
            sTitle: data?.sTitle,
            sDescription: data?.sDescription,
            nInactiveInterval: (+data?.nInactiveInterval * 3600000) || '',
            eStatusType: data?.eStatusType?.value,
            eScheduleType: data?.eScheduleType?.value,
            dScheduledAt: moment(data?.dScheduledAt?._d).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss.000Z') || '',
            file: fileToDataUri(fileName) || ''
        }
        for (let key in addData) {
            formData.append(key, addData[key])
        }
        mutate(formData)
    }

    useEffect(() => {
        document.title = 'Add Notification | PokerGold'
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
                                            <Form.Group className='form-group'>
                                                <Form.Label>
                                                    <span>
                                                        User Type
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name='eStatusType'
                                                    control={control}
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: 'User Type is required.'
                                                        }
                                                    }}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <Select
                                                            placeholder='Select user type'
                                                            ref={ref}
                                                            options={eUserTypeOptions}
                                                            className={`react-select border-0 ${errors.eStatusType && 'error'}`}
                                                            classNamePrefix='select'
                                                            isSearchable={false}
                                                            value={value}
                                                            onChange={onChange}
                                                            getOptionLabel={(option) => option.label}
                                                            getOptionValue={(option) => option.value}
                                                        />
                                                    )}
                                                />
                                                {errors.eStatusType && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.eStatusType.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col sm={6} className='mt-sm-0 mt-2'>
                                            {watch('eStatusType')?.value === 'inactive' &&
                                                // nInactiveInterval = 1 => 36,00,000
                                                <CommonInput
                                                    type='text'
                                                    register={register}
                                                    errors={errors}
                                                    className={`for m-control ${errors?.sPostalCode && 'error'}`}
                                                    name='nInactiveInterval'
                                                    label='Set inactive user Time Interval (in hours)'
                                                    placeholder='Enter interval time'
                                                    required
                                                    validation={{
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Only numbers are allowed'
                                                        },
                                                        required: {
                                                            value: true,
                                                            message: 'Interval time is required.'
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        e.target.value =
                                                            e.target.value?.trim() &&
                                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                    }}
                                                />
                                            }

                                            {watch('eStatusType')?.value === 'csv' &&
                                                <div className='mt-2'>
                                                    <label>Add CSV File<span className='inputStar'>*</span></label>
                                                    <div className='inputtypefile'>
                                                        <div className='inputMSG'>
                                                            <span>Browse a CSV File</span><span className='file-name card-error'>{watch('file') && watch('file')?.name}</span>
                                                        </div>
                                                        <Controller
                                                            name={`file`}
                                                            control={control}
                                                            rules={{
                                                                required: "Please add the CSV file",
                                                                validate: {
                                                                    fileType: (value) => (value && typeof (watch(`file`)) !== 'string') ? (/csv|xls|xlsx|CSV|XLS|XLSX/.test(value.name) || "Unsupported file format") : true,
                                                                }
                                                            }}
                                                            render={({ field: { onChange, value, ref } }) => {

                                                                return <>
                                                                    <Form.Control
                                                                        ref={ref}
                                                                        type='file'
                                                                        name={`file`}
                                                                        // disabled={updateFlag}
                                                                        accept='.csv,.xls,.xlsx,.CSV,.XLS,.XLSX'
                                                                        errors={errors}
                                                                        className={errors?.file && 'error'}
                                                                        onChange={(e) => {
                                                                            onChange(e.target.files[0])
                                                                        }}
                                                                    />
                                                                </>
                                                            }
                                                            }
                                                        />
                                                    </div>
                                                
                                                    <span className='card-error'>{errors && errors?.file && <Form.Control.Feedback type="invalid">{errors?.file.message}</Form.Control.Feedback>}</span>
                                                </div>
                                            }
                                        </Col>

                                        <Col lg={6} md={12} sm={12} className='mt-2'>
                                            <Row className='left-side'>
                                                <Col lg={12} sm={6}>
                                                    <CommonInput
                                                        type='text'
                                                        register={register}
                                                        errors={errors}
                                                        className={`form-control ${errors?.sUserName && 'error'}`}
                                                        name='sTitle'
                                                        label='Title'
                                                        placeholder='Enter notification title'
                                                        required
                                                        onChange={(e) => {
                                                            e.target.value =
                                                                e.target.value?.trim() &&
                                                                e.target.value.replace(/^[0-9]+$/g, '')
                                                        }}
                                                        validation={{
                                                            required: {
                                                                value: true,
                                                                message: 'Title is required.'
                                                            },
                                                        }}
                                                    />
                                                </Col>
                                                <Col lg={12} sm={6} className='mt-lg-2 mt-sm-0 mt-2'>
                                                    <Form.Group className='form-group'>
                                                        <Form.Label>
                                                            <span>
                                                                Schedule
                                                                <span className='inputStar'>*</span>
                                                            </span>
                                                        </Form.Label>
                                                        <Controller
                                                            name='eScheduleType'
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Schedule is required.'
                                                                }
                                                            }}
                                                            render={({ field: { onChange, value, ref } }) => (
                                                                <Select
                                                                    placeholder='Select schedule type'
                                                                    ref={ref}
                                                                    options={eSchedule}
                                                                    className={`react-select border-0 ${errors.eScheduleType && 'error'}`}
                                                                    classNamePrefix='select'
                                                                    isSearchable={false}
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    getOptionLabel={(option) => option.label}
                                                                    getOptionValue={(option) => option.value}
                                                                />
                                                            )}
                                                        />
                                                        {errors.eScheduleType && (
                                                            <Form.Control.Feedback type='invalid'>
                                                                {errors.eScheduleType.message}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={6} md={12} sm={12} className='mt-lg-2 mt-md-2 mt-sm-2 mt-2 right-side'>
                                            <CommonInput
                                                type='textarea'
                                                register={register}
                                                errors={errors}
                                                label='Description'
                                                required
                                                className={`form-control ${errors?.sDescription && 'error'} mt-3`}
                                                name={'sDescription'}
                                                placeholder='Type your message here...'
                                                onChange={(e) => e.target.value}
                                                validation={{
                                                    required: {
                                                        value: true,
                                                        message: 'Description is required.'
                                                    },
                                                }}
                                            />
                                        </Col>
                                        <Col lg={6} md={6} sm={6} className='mt-lg-2 mt-md-2 mt-sm-2 mt-2'>
                                            {watch('eScheduleType')?.value === 'scheduled' &&
                                                <Form.Group className='form-group reSchedule-datepicker mb-2'>
                                                    <Form.Label>
                                                        <span>
                                                            Set Time
                                                            <span className='inputStar'>*</span>
                                                        </span>
                                                    </Form.Label>
                                                    <Controller
                                                        name="dScheduledAt"
                                                        control={control}
                                                        rules={{
                                                            required: {
                                                                value: true,
                                                                message: 'Schedule Time is required'
                                                            }
                                                        }}
                                                        render={({ field }) => (
                                                            <Datetime
                                                                id="datetime1"
                                                                inputProps={{
                                                                    placeholder: 'Select date and time',
                                                                }}
                                                                value={field.value}
                                                                onChange={(date) => field.onChange(date)}
                                                            />
                                                        )}
                                                    />
                                                    {errors.dScheduledAt && (
                                                        <Form.Control.Feedback type='invalid'>
                                                            {errors.dScheduledAt.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>}
                                        </Col>

                                        <Row className='mt-3'>
                                            <Col sm={12}>
                                                <Button variant='secondary' className='me-2' onClick={() => navigate(route.pushNotification)}>
                                                    Cancel
                                                </Button>
                                                <Button variant='primary' type='submit'>
                                                    Add Notification
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

export default AddNotification
