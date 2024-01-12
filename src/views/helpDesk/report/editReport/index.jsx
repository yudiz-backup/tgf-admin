import React, { useEffect } from 'react'
import { getSpecificReport, updateReport } from 'query/help/report/report.query'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import CommonInput from 'shared/components/CommonInput'
import Wrapper from 'shared/components/Wrap'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faPenToSquare, faPhotoFilm, faUser } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { toaster } from 'helper/helper'
import { route } from 'shared/constants/AllRoutes'

const EditReport = () => {
    const { id } = useParams()
    const query = useQueryClient()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm({ mode: 'all' })

    const reportState = [
        { label: 'Opened', value: 'opened' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Closed', value: 'closed' }
    ]

    // GET SPECIFIC REPORT
    const { data } = useQuery('reportDataById', () => getSpecificReport(id), {
        enabled: !!id,
        select: (data) => data?.data?.data,
        onSuccess: (data) => {
            reset({
                ...data,
                sTitle: data?.sTitle,
                sDescription: data?.sDescription,
                eState: reportState?.find(item => item?.value === data?.eState)
            })
        }
    })

    // EDIT REPORT
    const { mutate } = useMutation(updateReport, {
        onSuccess: (response) => {
            toaster(response.data.message)
            query.invalidateQueries('reportDataById')
            navigate(route.report)
            setValue('sMessage', '')
        }
    })

    function onSubmit (data) {
        mutate({
            id: id,
            sMessage: data?.sMessage,
            eState: data?.eState?.value
        })
    }

    useEffect(() => {
        document.title = 'Edit Report | Help Desk | PokerGold'
    }, [])
    return (
        <>
            <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)} >
                <div className='personal-details'>
                    <div className='user-form'>
                        <Row>
                            <Col xxl={6} xl={6} lg={6} md={12}>
                                <Wrapper>
                                    <h2>Edit {data?.sTitle} <FontAwesomeIcon icon={faPenToSquare} color='#ffb744' size='xs' /></h2><hr />
                                    <Row>
                                        <Col xl={6} lg={12} md={12} sm={12}>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.sTitle && 'error'}`}
                                                name='sTitle'
                                                label='Time'
                                                disabled
                                                placeholder='Enter the Title'
                                            />
                                        </Col>

                                        <Col xl={6} lg={12} md={12} sm={12}>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.sDescription && 'error'}`}
                                                name='sDescription'
                                                label='Description'
                                                disabled
                                                placeholder='Enter the description'
                                            />
                                        </Col>

                                        <Col sm={12}>
                                            <CommonInput
                                                type='textarea'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.sMessage && 'error'} mt-3`}
                                                name='sMessage'
                                                label='Message'
                                                placeholder='Type your message here...'
                                                onChange={(e) => e.target.value}
                                            />
                                        </Col>
                                        <Col xl={6} lg={12} md={12} sm={12}>
                                            <Form.Group className='form-group'>
                                                <Form.Label> Report State </Form.Label>
                                                <Controller
                                                    name='eState'
                                                    control={control}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <Select
                                                            placeholder='Select report state'
                                                            ref={ref}
                                                            options={reportState}
                                                            className={`react-select border-0 ${errors.eState && 'error'}`}
                                                            classNamePrefix='select'
                                                            isSearchable={false}
                                                            value={value}
                                                            onChange={onChange}
                                                            getOptionLabel={(option) => option.label}
                                                            getOptionValue={(option) => option.value}
                                                        />
                                                    )}
                                                />
                                                {errors.eState && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.eState.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Row className='mt-3'>
                                            <Col xl={12} lg={12} md={12} sm={12}>
                                                <Button variant='secondary' className='me-2' onClick={() => setValue('sMessage', '')}>
                                                    Clear
                                                </Button>
                                                <Button variant='primary' type='submit'>
                                                    Submit
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                </Wrapper>
                            </Col>

                            <Col xxl={6} xl={6} lg={6} md={12} className='chat mt-lg-0 mt-md-3 mt-sm-3 mt-3'>
                                <Wrapper>
                                    <h2>Discussion Chat <FontAwesomeIcon icon={faCommentDots} color='var(--primary-color)' size='sm' /></h2><hr />
                                    <div className='report-discussion'>
                                        {data?.aDiscussion?.length !== 0 ? data?.aDiscussion?.map(element => {
                                            return (
                                                <>
                                                    <div className='d-flex mb-2'>
                                                        <div className='report-comment-user'><div><FontAwesomeIcon icon={faUser} /></div><div className='report-comment-user-name'>{data?.sUserName}</div></div>
                                                        <div>
                                                            <div className='report-comment-message'>{element?.sMessage}</div>
                                                            {/* <div className='report-comment-state'>{element?.sOldState} 	&rarr; {element?.sNewState}</div> */}
                                                            <div className='report-comment-date'>{moment(element?.dCreatedDate).format('DD-MM-YYYY, hh:MM A') || '-'}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }) : <span className='empty-msg'>No Discussion Yet</span>}
                                    </div>
                                </Wrapper>
                            </Col>

                            <Col xxl={12} className='mt-3'>
                                <Wrapper>
                                    <h2>Media Gallery <FontAwesomeIcon icon={faPhotoFilm} color='var(--primary-color)' size='xs' /></h2><hr />
                                    {data?.aMedia?.length > 0 &&
                                        <Row>
                                            {data?.aMedia?.map(media => {
                                                return (
                                                    <Col lg={3} sm={12}>
                                                        <tr key={media?._id}>
                                                            <div className="document-preview-group">
                                                                {media?.sUrl && (
                                                                    typeof (media?.sUrl) !== 'string'
                                                                        ? <div className="document-preview"> <img src={URL.createObjectURL(media?.sUrl)} alt='altImage' /> </div>
                                                                        : <div className="document-preview"><img src={media?.sUrl} alt='altImage' /> </div>)}
                                                            </div>
                                                        </tr>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    }
                                </Wrapper>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Form>
        </>
    )
}

export default EditReport
