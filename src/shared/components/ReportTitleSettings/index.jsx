import React from 'react'
import Wrapper from '../Wrap'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from 'react-query'
import { addReportTitleSetting, deleteReportTitleSetting } from 'query/settings/settings.query'
import { toaster } from 'helper/helper'
import CommonInput from '../CommonInput'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

const ReportTitleSettings = ({ settingData, }) => {
    const query = useQueryClient()
    const { handleSubmit, reset, errors, register } = useForm({ mode: 'all' })

    const { mutate: addMutate } = useMutation(addReportTitleSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('Report Title added successfully.', 'success')
        }
    })

    const { mutate: deleteMutate } = useMutation(deleteReportTitleSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('Report Title deleted successfully.', 'success')
        }
    })

    function onSubmit (data) {
        reset()
        addMutate(data)
    }

    function handleDelete (data) {
        deleteMutate({
            aReportTitle: data
        })
    }
    return (
        <Wrapper>
            <div className='report-title-settings'>
                <h1 className='label'>Report Title Settings</h1><hr className='line' />
                <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12}>
                            <div className='title-content'>
                                {settingData && settingData?.aReportTitle?.map((title, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <span className="title">{title} <span onClick={() => handleDelete(title)} className='cancel'><FontAwesomeIcon icon={faXmark} size='lg' /></span></span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </div>
                        </Col>
                        <Col xxl={10} lg={9} md={10} sm={10} className='mt-3'>
                            <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.aReportTitle && 'error'}`}
                                name='aReportTitle'
                                // label='Title'
                                placeholder='Enter report title'
                                onChange={(e) => {
                                    e.target.value =
                                        e.target.value?.trim() &&
                                        e.target.value.replace(/^[0-9]+$/g, '')
                                }}
                                validation={{
                                    required: {
                                        value: true,
                                        message: 'Title is required'
                                    },
                                }}
                            />
                        </Col>
                        <Col xxl={2} lg={3} md={2} sm={2} className='mt-3'>
                            <Button variant='primary' type='submit'><FontAwesomeIcon icon={faPlus} /></Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Wrapper>
    )
}

export default ReportTitleSettings

ReportTitleSettings.propTypes = {
    settingData: PropTypes.any,
}

