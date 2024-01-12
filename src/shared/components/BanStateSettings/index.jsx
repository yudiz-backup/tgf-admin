import React, { useEffect } from 'react'
import Wrapper from '../Wrap'
import { useMutation, useQueryClient } from 'react-query'
import { updateSetting } from 'query/settings/settings.query'
import { toaster } from 'helper/helper'
import Select from 'react-select'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { statesColumn } from 'shared/constants/TableHeaders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'


const BanStateSettings = ({ settingData }) => {
    const query = useQueryClient()
    const { handleSubmit, control, formState: { errors }, reset } = useForm({ mode: 'all' })

    useEffect(() => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const temp = settingData ? [...settingData?.aRestrictedState] : []

        const stateData = []
        for (let key of statesColumn) {
            if (temp?.filter(item => item === key?.value)?.length > 0) {
                stateData?.push(key)
            }
        }

        reset({
            aRestrictedState: stateData
        })
    }, [settingData, reset])

    const { mutate: updateMutate } = useMutation(updateSetting, {
        onSuccess: () => {
            query.invalidateQueries('setting')
            toaster('Ban State Settings has updated successfully.', 'success')
        }
    })

    function onSubmit (data) {
        updateMutate({
            aRestrictedState: data?.aRestrictedState?.map(item => item?.value),
            id: settingData?._id
        })
    }
    return (
        <Wrapper>
            <div className='ban-state'>
                <h1 className='label'>Ban State Settings</h1><hr className='line' />
                <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={10} sm={10}>
                            <Form.Group className='form-group'>
                                <Form.Label>Ban State</Form.Label>
                                <Controller
                                    name='aRestrictedState'
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Ban state is required'
                                        }
                                    }}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <Select
                                            placeholder='Select ban state'
                                            ref={ref}
                                            options={statesColumn}
                                            className={`react-select border-0 ${errors.aRestrictedState && 'error'}`}
                                            classNamePrefix='select'
                                            isSearchable={false}
                                            value={value}
                                            isMulti
                                            onChange={onChange}
                                            getOptionLabel={(option) => option.label}
                                            getOptionValue={(option) => option.value}
                                        />
                                    )}
                                />
                                {errors.eMode && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.eMode.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={2} sm={2}>
                            <Button variant='primary' type='submit'><FontAwesomeIcon icon={faPlus} /></Button>
                        </Col>
                        <Col sm={12} className='state'>
                            <Wrapper>
                                <div className='state-content'>
                                    {settingData?.aRestrictedState?.map((state, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}.</td>
                                                <td className='value'>{state}</td>
                                            </tr>
                                        )
                                    })}
                                </div>
                            </Wrapper>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Wrapper>
    )
}

export default BanStateSettings

BanStateSettings.propTypes = {
    settingData: PropTypes.object
}
