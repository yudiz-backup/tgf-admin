/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select'

const PrototypeFilter = ({ filterChange, type, defaultValue, closeDrawer, location }) => {
    const { handleSubmit, control, reset } = useForm({})

    useEffect(() => {
        reset({
            eStatus: statusColumns?.find(item => item?.value === defaultValue?.eStatus),
            ePokerType: pokerTypeColumns?.find(item => item?.value === defaultValue?.ePokerType),
            eType: tournamentTypeColumns?.find(item => item?.value === defaultValue?.eType)
        })
    }, [defaultValue, reset])

    const statusColumns = [
        { label: 'All', value: '' },
        { label: 'Active', value: 'y' },
        { label: 'Inactive', value: 'n' },
    ]

    const pokerTypeColumns = [
        { label: 'All', value: '' },
        { label: 'NLH', value: 'NLH' },
        { label: 'NLO', value: 'NLO' },
        { label: 'PLO', value: 'PLO' },
    ]

    const tournamentTypeColumns = [
        { label: 'All', value: '' },
        { label: 'Spin Up', value: 'spin-up' },
        { label: 'MTT', value: 'mtt' },
    ]

    function onSubmit (data) {
        filterChange({
            eStatus: data?.eStatus?.value,
            ePokerType: data?.ePokerType?.value,
            eType: data?.eType?.value,
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eStatus: '',
            ePokerType: '',
            eType: ''
        })
        closeDrawer()
    }
    return (
        <>
            <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>

                <Form.Group className='form-group'>
                    <Form.Label>
                        Status
                    </Form.Label>
                    <Controller
                        name='eStatus'
                        control={control}
                        defaultValue={statusColumns?.[0]}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={statusColumns}
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
                    <Form.Label>
                        Poker Type
                    </Form.Label>
                    <Controller
                        name='ePokerType'
                        control={control}
                        defaultValue={statusColumns?.[0]}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={pokerTypeColumns}
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
                    <Form.Label>
                        Tournament Type
                    </Form.Label>
                    <Controller
                        name='eType'
                        control={control}
                        defaultValue={statusColumns?.[0]}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={tournamentTypeColumns}
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

export default PrototypeFilter
