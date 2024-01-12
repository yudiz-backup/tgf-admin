import React, { useEffect, useMemo, useState } from 'react'
import { toaster } from 'helper/helper'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import CommonInput from 'shared/components/CommonInput'
import Wrapper from 'shared/components/Wrap'
import { route } from 'shared/constants/AllRoutes'
import { validationErrors } from 'shared/constants/ValidationErrors'
import Datetime from 'react-datetime';
import Select from 'react-select'
import { pokerTypeColumns } from 'shared/constants/TableHeaders'
import { getPrototypeByID } from 'query/prototype/prototype.query'
import moment from 'moment-timezone'
import { addSchedule } from 'query/schedule/schedule.query'

const AddSchedule = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const { register, handleSubmit, formState: { errors }, control, reset, getValues } = useForm({ mode: 'all' })

  const eType = [
    { label: 'All', value: '' },
    { label: 'MTT', value: 'mtt' },
    { label: 'Spin Up', value: 'spin-up' }
  ]

  const eEntryFeeType = [
    { label: 'Chips', value: 'chips' },
    { label: 'Tickets', value: 'tickets' },
  ]

  const RescheduleOption = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'None', value: 'none' },
  ]

  const [date, setDate] = useState(null)
  const key = useMemo(() => (0), [])

  // GET SPECIFIC USER
  const { data } = useQuery('scheduleDataById', () => getPrototypeByID(id), {
    enabled: !!id,
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({
        ...data,
        eType: eType.find(item => item?.value === data?.eType),
        eEntryFeeType: eEntryFeeType.find(item => item?.value === data?.oEntryFee?.eType),
        ePokerType: pokerTypeColumns.find(item => item?.value === data?.ePokerType),
        nEntryFeeAmount: data?.oEntryFee?.nAmount || 0,
        nReSpinFee: data?.SpinUpConfiguration?.nReSpinFee || 0
      })
    }
  })

  // EDIT USER
  const { mutate } = useMutation(addSchedule, {
    onSuccess: (response) => {
      toaster(response.data.message)
      navigate(route.schedule)

      reset()
    }
  })

  async function onSubmit (data) {
    const dAnnounceDate = await moment(data?.dAnnounce?._d)?.tz('Asia/Kolkata')?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
    const dRegistrationStartDate = await moment(data?.dRegistrationStart?._d)?.tz('Asia/Kolkata')?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
    const dRegistrationEndDate = await moment(data?.dRegistrationEnd?._d)?.tz('Asia/Kolkata')?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
    const dScheduledAtDate = await moment(data?.dScheduledAt?._d)?.tz('Asia/Kolkata')?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'

    const addData = {
      ...data,
      iProtoId: data?._id,
      eType: data?.eType?.value,
      ePokerType: data?.ePokerType?.value,
      eRescheduled: data?.eRescheduled?.value,
      eEntryFeeType: data?.eEntryFeeType?.value,
      dAnnounce: dAnnounceDate,
      dRegistrationStart: dRegistrationStartDate,
      dRegistrationEnd: dRegistrationEndDate,
      dScheduledAt: dScheduledAtDate || '',
      dScheduledEndAt: dRegistrationEndDate || ''
    }
    mutate(addData)
  }

  useEffect(() => {
    document.title = 'Add Schedule | Tournament | PokerGold'
  }, [])

  return (
    <>
      <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)} >
        <div className='personal-details'>
          <div className='user-form'>
            <Row>
              <Col xxl={12}>
                <Wrapper>
                  <Row>
                    <Col sm={3}>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span> Tournament Type </span>
                        </Form.Label>
                        <Controller
                          name='eType'
                          control={control}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select tournament type'
                              ref={ref}
                              options={eType}
                              className={`react-select border-0 ${errors.eType && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              isDisabled={true}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sName && 'error'}`}
                        name='sName'
                        label='Name'
                        placeholder='Enter the name'
                        required
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[0-9]+$/g, '')
                        }}
                        validation={{
                          required: {
                            value: true,
                            message: validationErrors.NameRequired
                          },
                        }}
                      />
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nBuyIn && 'error'}`}
                        name='nBuyIn'
                        label='Buy In'
                        disabled
                      />
                    </Col>
                    <Col sm={3}>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span>Entry Fee Type </span>
                        </Form.Label>
                        <Controller
                          name='eEntryFeeType'
                          control={control}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select entry fee type'
                              ref={ref}
                              options={eEntryFeeType}
                              className={`react-select border-0 ${errors.eEntryFeeType && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              isDisabled={true}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nEntryFeeAmount && 'error'}`}
                        name='nEntryFeeAmount'
                        label='Entry Fee Amount'
                        disabled
                      />
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nStartingChip && 'error'}`}
                        name='nStartingChip'
                        label='Starting Chip'
                        disabled
                      />
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nPoolAmount && 'error'}`}
                        name='nPoolAmount'
                        label='Pool Amount'
                        disabled
                      />
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nBlindUp && 'error'}`}
                        name='nBlindUp'
                        label='Blind Up'
                        disabled
                      />
                    </Col>
                    <Col sm={3}>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span> Poker Type </span>
                        </Form.Label>
                        <Controller
                          name='ePokerType'
                          control={control}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select poker type'
                              ref={ref}
                              options={pokerTypeColumns}
                              className={`react-select border-0 ${errors.ePokerType && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              isDisabled={true}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nPlayerPerTable && 'error'}`}
                        name='nPlayerPerTable'
                        label='No. of Player'
                        disabled
                      />
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nReEntryPerPlayer && 'error'}`}
                        name='nReEntryPerPlayer'
                        label='Re-Entry Limit'
                        disabled
                      />
                    </Col>
                    <Col sm={3}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nReSpinFee && 'error'}`}
                        name='nReSpinFee'
                        label='Re-Spin Fee'
                        disabled
                      />
                    </Col>
                    <Col sm={3}>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span>
                            Re-Schedule
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name='eRescheduled'
                          control={control}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select re-schedule type'
                              ref={ref}
                              options={RescheduleOption}
                              className={`react-select border-0 ${errors.eRescheduled && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                        {errors.eRescheduled && (
                          <Form.Control.Feedback type='invalid'>
                            {errors.eRescheduled.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col sm={3}>
                      <Form.Group className='form-group reSchedule-datepicker mb-2'>
                        <Form.Label>
                          <span>
                            Announce Time
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name="dAnnounce"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: 'Announce time is required'
                            }
                          }}
                          render={({ field }) => (
                            <Datetime
                              ref={field.ref}
                              id="dAnnounce"
                              key={key}
                              inputProps={{
                                placeholder: 'Select date and time',
                              }}
                              isValidDate={(currentDate, selectedDate) => {
                                return !currentDate.isBefore(new Date(), 'day');
                              }}
                              value={date?.name === 'announce' && date?.data}
                              onChange={(date) => {
                                field.onChange(date || null)
                                setDate({ data: date, name: 'announce' } || null)
                              }}
                            />
                          )}
                        />
                        {errors?.dAnnounce && (
                          <Form.Control.Feedback type='invalid'>
                            {errors?.dAnnounce.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={3}>
                      <Form.Group className='form-group reSchedule-datepicker mb-2'>
                        <Form.Label>
                          <span>
                            Registration Start Time
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name="dRegistrationStart"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: 'Registration start date time is required'
                            }
                          }}
                          render={({ field }) => (
                            <Datetime
                              ref={field.ref}
                              id="dRegistrationStart"
                              key={key}
                              inputProps={{
                                placeholder: 'Select date and time',
                              }}
                              isValidDate={(currentDate, selectedDate) => {
                                return (
                                  !currentDate.isBefore(new Date(), 'day') &&
                                  (getValues('dAnnounce') ? !currentDate.isBefore(getValues('dAnnounce'), 'day') : true)
                                );
                              }}
                              value={date?.name === 'registration-start' && date?.data}
                              onChange={(date) => {
                                field.onChange(date || null)
                                setDate({ data: date, name: 'registration-start' } || null)
                              }}
                            />
                          )}
                        />
                        {errors?.dRegistrationStart && (
                          <Form.Control.Feedback type='invalid'>
                            {errors?.dRegistrationStart.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={3}>
                      <Form.Group className='form-group reSchedule-datepicker mb-2'>
                        <Form.Label>
                          <span>
                            Registration End Time
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name="dRegistrationEnd"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: 'Registration end date time is required'
                            }
                          }}
                          render={({ field }) => (
                            <Datetime
                              ref={field.ref}
                              id="dRegistrationEnd"
                              key={key}
                              inputProps={{
                                placeholder: 'Select date and time',
                              }}
                              isValidDate={(currentDate, selectedDate) => {
                                return (
                                  !currentDate.isBefore(new Date(), 'day') &&
                                  (getValues('dRegistrationStart') ? !currentDate.isBefore(getValues('dRegistrationStart'), 'day') : true)
                                );
                              }}
                              value={date?.name === 'registration-end' && date?.data}
                              onChange={(date) => {
                                field.onChange(date || null)
                                setDate({ data: date, name: 'registration-end' } || null)
                              }}
                            />
                          )}
                        />
                        {errors?.dRegistrationEnd && (
                          <Form.Control.Feedback type='invalid'>
                            {errors?.dRegistrationEnd.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    {data?.eType === 'mtt' &&

                      <Col sm={3}>
                        <Form.Group className='form-group reSchedule-datepicker mb-2'>
                          <Form.Label>
                            <span>
                              Schedule Time
                              <span className='inputStar'>*</span>
                            </span>
                          </Form.Label>
                          <Controller
                            name="dScheduledAt"
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: 'Schedule time is required'
                              }
                            }}
                            render={({ field }) => (
                              <Datetime
                                ref={field.ref}
                                id="dScheduledAt"
                                key={key}
                                inputProps={{
                                  placeholder: 'Select date and time',
                                }}
                                isValidDate={(currentDate, selectedDate) => {
                                  return (
                                    !currentDate.isBefore(new Date(), 'day') &&
                                    (getValues('dRegistrationEnd') ? !currentDate.isBefore(getValues('dRegistrationEnd'), 'day') : true)
                                  );
                                }}
                                value={date?.name === 'schedule' && date?.data}
                                onChange={(date) => {
                                  field.onChange(date || null)
                                  setDate({ data: date, name: 'schedule' } || null)
                                }}
                              />
                            )}
                          />
                          {errors?.dScheduledAt && (
                            <Form.Control.Feedback type='invalid'>
                              {errors?.dScheduledAt.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    }
                    <Row>
                      <Col sm={6}>
                        <Button variant='secondary' className='my-3' onClick={() => navigate(route.prototype)}>
                          Cancel
                        </Button>
                        <Button variant='primary' type='submit'>
                          Submit
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

export default AddSchedule
