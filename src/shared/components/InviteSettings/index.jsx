import React, { useEffect } from 'react'
import Wrapper from '../Wrap'
import { Button, Col, Form, Row } from 'react-bootstrap'
import CommonInput from '../CommonInput'
import { useMutation, useQueryClient } from 'react-query'
import { inviteSetting } from 'query/settings/settings.query'
import { fileToDataUri, toaster } from 'helper/helper'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

const InviteSettings = ({ settingData }) => {
    const query = useQueryClient()

    const { handleSubmit, reset, formState: { errors }, register, watch, control } = useForm({ mode: 'all' })

    useEffect(() => {
        reset({
            sAvatar: settingData?.oInviteInfo?.oRewardedInfo?.sAvatar,
            sMessage: settingData?.oInviteInfo?.sMessage,
            sName: settingData?.oInviteInfo?.oRewardedInfo?.sName,
            sPersonMessage: settingData?.oInviteInfo?.oRewardedInfo?.sMessage
        })
    }, [settingData, reset])

    const { mutate } = useMutation(inviteSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('Invite Setting updated successfully.', 'success')
        }
    })

    async function onSubmit (data) {
        mutate({
            sAvatar: await fileToDataUri(data?.sAvatar).then((imageFile) => imageFile) || await fileToDataUri(settingData?.oInviteInfo?.oRewardedInfo?.sAvatar).then((imageFile) => imageFile),
            sMessage: data?.sMessage,
            oRewardedInfo: {
                sName: data?.sName,
                sMessage: data?.sPersonMessage
            }
        })
    }
    return (
        <>
            <Wrapper>
                <div className='invite-settings'>
                    <h1 className='label'>Invite Settings</h1><hr className='line' />

                    <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={4} md={12}>
                                <div className="invite-profile">
                                    {(watch('sAvatar')) && (
                                        typeof (watch('sAvatar')) !== 'string'
                                            ? <div className="profile"> <img src={URL.createObjectURL(watch('sAvatar'))} alt='altImage' className='img-fluid' /> </div>
                                            : <div className="profile"><img src={watch('sAvatar')} alt='altImage' className='img-fluid' /> </div>)}
                                </div>
                                <div className='mt-3 upload'>
                                    <div className='upload-button'>
                                        <div className='inputMSG'>
                                            <span>Upload</span>
                                        </div>
                                        <Controller
                                            name={`sAvatar`}
                                            control={control}
                                            rules={{
                                                required: "Please add PAN card front view ",
                                                validate: {
                                                    fileType: (value) => {
                                                        if (value && typeof (watch(`sAvatar`)) !== 'string') {
                                                            const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                                            const fileExtension = value.name?.split('.').pop().toLowerCase();

                                                            if (!allowedFormats.includes(fileExtension)) {
                                                                return "Unsupported file format";
                                                            }

                                                            const maxSize = 1 * 1000 * 800; // 1MB in bytes
                                                            if (value.size >= maxSize) {
                                                                return "File size must be less than 1MB";
                                                            }
                                                        }
                                                        return true;
                                                    },
                                                }
                                            }}
                                            render={({ field: { onChange, ref } }) => {
                                                return <>
                                                    <Form.Control
                                                        ref={ref}
                                                        type='file'
                                                        name={`sAvatar`}
                                                        // disabled={updateFlag}
                                                        accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                                        errors={errors}
                                                        className={errors?.sAvatar && 'error'}
                                                        onChange={(e) => {
                                                            onChange(e.target.files[0])
                                                        }}
                                                    />
                                                </>
                                            }}
                                        />
                                    </div>

                                    <span className='card-error'>{errors && errors?.sAvatar && <Form.Control.Feedback type="invalid">{errors?.sAvatar.message}</Form.Control.Feedback>}</span>
                                </div>
                            </Col>
                            <Col lg={8} md={12} className='pl-3'>
                                <Row>
                                    <Col sm={12}>
                                        <Row>
                                            <Col sm={6}>
                                                <CommonInput
                                                    type='text'
                                                    register={register}
                                                    errors={errors}
                                                    className={`form-control ${errors?.sName && 'error'}`}
                                                    name='sName'
                                                    label='Rewarded Person Name'
                                                    placeholder='Enter user name'
                                                    onChange={(e) => {
                                                        e.target.value =
                                                            e.target.value?.trim() &&
                                                            e.target.value.replace(/^[0-9]+$/g, '')
                                                    }}
                                                    validation={{
                                                        required: {
                                                            value: true,
                                                            message: ''
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: 'Your username must be atleast 3 characters long.'
                                                        }
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xxl={6} lg={12} sm={12} className='mt-2'>
                                        <CommonInput
                                            type='textarea'
                                            register={register}
                                            label='Messages'
                                            errors={errors}
                                            className={`form-control ${errors?.sMessage && 'error'} mt-3`}
                                            name='sMessage'
                                            placeholder='Type your message here...'
                                            onChange={(e) => e.target.value}
                                        />
                                    </Col>
                                    <Col xxl={6} lg={12} sm={12} className='mt-2'>
                                        <CommonInput
                                            type='textarea'
                                            register={register}
                                            label='Rewarded Person Message'
                                            errors={errors}
                                            className={`form-control ${errors?.sPersonMessage && 'error'} mt-3`}
                                            name='sPersonMessage'
                                            placeholder='Type your message here...'
                                            onChange={(e) => e.target.value}
                                        />
                                    </Col>
                                    <Col sm={12} className='mt-3'>
                                        <Button variant='primary' type='submit'>Submit</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Wrapper>
        </>
    )
}

export default InviteSettings

InviteSettings.propTypes = {
    settingData: PropTypes.any,
}
