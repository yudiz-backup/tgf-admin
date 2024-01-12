import React, { useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select'

const PromoCodeFilter = ({ filterChange, closeDrawer, defaultValue }) => {
    const { handleSubmit, control, reset } = useForm({})

    const statusOption = [
        { label: 'All', value: '' },
        { label: 'Active', value: 'y' },
        { label: 'Inactive', value: 'n' },
        { label: 'Deleted', value: 'd' },
    ]

    const bonusTypeColumns = [
        { label: 'All', value: '' },
        { label: 'Amount', value: 'amount' },
        { label: 'Percentage', value: 'percentage' },
    ]

    useEffect(() => {
        reset({
            eStatus: statusOption?.find(item => item?.value === defaultValue?.eStatus),
            eValueType: bonusTypeColumns?.find(item => item?.value === defaultValue?.eValueType)
        })
    }, [defaultValue, reset])


    function onSubmit (data) {
        filterChange({
            eStatus: data?.eStatus?.value,
            eValueType: data?.eValueType?.value,
        })
        closeDrawer()
    }

    function onReset () {
        reset({})
        filterChange({
            eStatus: '',
            eValueType: '',
        })
        closeDrawer()
    }

  return (
    <>
      <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Form.Group className='form-group'>
                <Form.Label>
                    Select Status
                </Form.Label>
                <Controller
                    name='eStatus'
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                            ref={ref}
                            value={value}
                            options={statusOption}
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
                    Bonus Type
                </Form.Label>
                <Controller
                    name='eValueType'
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                            ref={ref}
                            value={value}
                            options={bonusTypeColumns}
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

export default PromoCodeFilter
