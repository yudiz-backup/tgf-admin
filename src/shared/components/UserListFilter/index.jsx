import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { BotStateColumns, GenderColumns, VerifiedEmailColumns, statesColumn, statusColumns } from 'shared/constants/TableHeaders'
import DatePicker from 'react-datepicker'

function UserFilters({ filterChange, defaultValue, closeDrawer, location }) {
    const { handleSubmit, control, reset } = useForm({})

    useEffect(() => {
        const seletctData = defaultValue?.selectedState?.map((e) => {
            const temp = statesColumn?.filter(item => item?.value === e)
            return temp[0]
        })
        reset({
            isEmailVerified: VerifiedEmailColumns?.find(item => item?.value === defaultValue?.isEmailVerified),
            isMobileVerified: VerifiedEmailColumns?.find(item => item?.value === defaultValue?.isMobileVerified),
            eGender: GenderColumns?.find(item => item?.value === defaultValue?.eGender),
            selectedState: seletctData,
            eStatus: statusColumns?.find(item => item?.value === defaultValue?.eStatus),
            eState: BotStateColumns?.find(item => item?.value === defaultValue?.eState)
        })
    }, [defaultValue])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange

    function onSubmit(data) {
        if (location?.pathname?.startsWith('/user')) {
            filterChange({
                isEmailVerified: data?.isEmailVerified?.value,
                isMobileVerified: data?.isMobileVerified?.value,
                eGender: data?.eGender?.value,
                eStatus: data?.eStatus?.value,
                selectedState: data?.selectedState
            })
            closeDrawer()
        } else {
            filterChange({
                eStatus: data?.eStatus?.value,
                eState: data?.eState?.value,
                dStartDate: startDate?.toISOString(),
                dEndDate: endDate?.toISOString()
            })
            closeDrawer()
        }
    }

    function onReset() {
        if (location?.pathname?.startsWith('/user')) {
            filterChange({
                isEmailVerified: '',
                isMobileVerified: '',
                eGender: '',
                eStatus: 'y',
                selectedState: []
            })
            reset({})
            closeDrawer()
        } else {
            filterChange({
                eStatus: '',
                eState: '',
                dStartDate: '',
                dEndDate: '',
                selectedState: []
            })
            reset({})
            closeDrawer()
        }
    }

    return (
        <Form className='user-filter' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            {location?.pathname?.startsWith('/user') &&
                <>
                    <Form.Group className='form-group'>
                        <Form.Label>
                            Email Verified Users
                        </Form.Label>
                        <Controller
                            name='isEmailVerified'
                            control={control}
                            render={({ field: { onChange, value = [], ref } }) => (
                                <Select
                                    ref={ref}
                                    value={value}
                                    options={VerifiedEmailColumns}
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
                            Mobile Verified Users
                        </Form.Label>
                        <Controller
                            name='isMobileVerified'
                            control={control}
                            render={({ field: { onChange, value = [], ref } }) => (
                                <Select
                                    ref={ref}
                                    value={value}
                                    options={VerifiedEmailColumns}
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
                            Select Gender
                        </Form.Label>
                        <Controller
                            name='eGender'
                            control={control}
                            render={({ field: { onChange, value = [], ref } }) => (
                                <Select
                                    ref={ref}
                                    value={value}
                                    options={GenderColumns}
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
                            Select State
                        </Form.Label>
                        <Controller
                            name='selectedState'
                            control={control}
                            render={({ field: { onChange, value = [], ref } }) => (
                                <Select
                                    ref={ref}
                                    value={value}
                                    options={statesColumn}
                                    isMulti
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
                </>
            }
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

            {location?.pathname?.startsWith('/bot') &&
                <Form.Group className='form-group'>
                    <Form.Label>
                        Bot State
                    </Form.Label>
                    <Controller
                        name='eState'
                        control={control}
                        render={({ field: { onChange, value = [], ref } }) => (
                            <Select
                                ref={ref}
                                value={value}
                                options={BotStateColumns}
                                className='react-select'
                                classNamePrefix='select'
                                closeMenuOnSelect={true}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                            />
                        )}
                    />
                </Form.Group>}

            <Form.Group className='form-group'>
                <Form.Label className='date-lable'>
                    Select Date Range
                </Form.Label>
                <Controller
                    name="dDateRange"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            selected={field.value}
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText='Select Date Range'
                            onChange={(date) => setDateRange(date)}
                            isClearable={true}
                            showYearDropdown
                            dateFormatCalendar="MMMM"
                            yearDropdownItemNumber={15}
                            scrollableYearDropdown
                            className="datepicker-inputbox"
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
    )
}
UserFilters.propTypes = {
    filterChange: PropTypes.func,
    defaultValue: PropTypes.object,
    type: PropTypes.string,
    closeDrawer: PropTypes.any,
    location: PropTypes.string

}
export default UserFilters
