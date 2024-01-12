import React, { useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import CommonInput from 'shared/components/CommonInput'
import Wrapper from 'shared/components/Wrap'
import { validationErrors } from 'shared/constants/ValidationErrors'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { getTicketDropDownList } from 'query/tickets/tickets.query'
import { route } from 'shared/constants/AllRoutes'
import { addPrototype } from 'query/prototype/prototype.query'
import { fileToDataUri, getImageFileFromUrl, toaster } from 'helper/helper'

const AddPrototype = () => {
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, control, reset, getValues, watch, setError, clearErrors, setValue } = useForm({ mode: 'all' })

  const eEntryFeeTypeOption = [
    { label: 'Chips', value: 'chips' },
    { label: 'Tickets', value: 'tickets' },
  ]

  const eTournamentTypeOption = [
    { label: 'Spin Up', value: 'spin-up' },
    { label: 'MTT', value: 'mtt' },
  ]

  const eBlindStructureTypeOption = [
    { label: 'Dynamic Structure', value: 'dynamic' },
    { label: 'Static Structure By File', value: 'static' },
  ]

  const ePokerTypeOption = [
    { label: 'NLH', value: 'NLH' },
    { label: 'NLO', value: 'NLO' },
    { label: 'PLO', value: 'PLO' },
  ]

  const eNoOfPlayerOption = [
    { label: '3', value: 3 },
    { label: '6', value: 6 },
    { label: '9', value: 9 },
  ]

  // List
  const { data: ticketDropDown } = useQuery('ticketList', () => getTicketDropDownList(), {
    enabled: !!watch('eEntryFeeType')?.value !== 'chips',
    select: (data) => data.data.data?.tournament,
  })

  // ADD PROTOTYPE
  const { mutate } = useMutation(addPrototype, {
    onSuccess: (response) => {
      toaster(response.data.message)
      navigate(route.prototype)

      reset()
    }
  })

  async function onSubmit (data) {
    const formData = new FormData();

    const addData = {
      sName: data?.sName,
      nBuyIn: +data?.nBuyIn,
      eType: data?.eTournamentType?.value, // tournament type
      oEntryFee: {
        eType: data?.eEntryFeeType?.value, //entry fee type
        aTicketId: data?.aTicketId?.map(ticket => ticket?._id) || null,
        nAmount: +data?.nEntryFee || 0
      },
      ePokerType: data?.ePokerType?.value,
      nPlayerPerTable: +data?.nPlayer?.value,
      nStartingChip: +data?.nStartingChip,
      nBuildUp: +data?.nBuildUp * 1000, // blind up interval
      nReEntryPerPlayer: +data?.nReEntryLimit, // re entry limit
      oMTTEntries: { // min player entry and max player entry
        nMaximum: +data?.nMaximum,
        nMinimum: +data?.nMinimum
      },
      oDynamicControl: {
        oBlind: {
          nDefaultAmount: +data?.nBlindDefaultAmount || '',
          nMultiplier: +data?.nBlindMultiplier || ''
        },
        oAnte: {
          nDefaultAmount: +data?.nAnteDefaultAmount || '',
          nLevelFrom: +data?.nAnteLevelFrom || '',
          nMultiplier: +data?.nAnteMultiplier || ''
        },
        oBreak: {
          nLevelInterval: data?.nLevelInterval || '', //break: level interval
          nDuration: +(+data?.nDuration * 1000) || ''
        },
        oReBuy: {
          nLevelFrom: +data?.nLevelFrom || '',
          nLevelTo: +data?.nLevelTo || '',
          nFee: +data?.nReBuyFee || '',
          nChips: +data?.nReBuyChip || '',
          nLimit: +data?.nLimit || ''
        },
        oAddOn: {
          nLevel: +data?.nLevel || '',
          nFee: +data?.nAddOnFee || '',
          nChips: +data?.nAddOnChip || '',
          nOffset: +data?.nOffset || '',
          nDuration: +(+data?.nDuration * 1000) || ''
        }
      },
      eMttType: data?.eMttType?.value || '', // MTT Winning type 
      iTicketId: data?.iTicketId?._id || null, // Winning ticket ratio id
    }

    formData.append('oEntryFee', JSON.stringify(addData.oEntryFee));
    formData.append('oMTTEntries', JSON.stringify(addData.oMTTEntries));
    formData.append('oDynamicControl', JSON.stringify(addData.oDynamicControl));

    for (const key in addData) {
      if (addData.hasOwnProperty(key) && key !== 'oEntryFee' && key !== 'oMTTEntries' && key !== 'oDynamicControl') {
        formData.append(key, addData[key]);
      }
    }

    const sThumbnail = data?.sThumbnail;

    if (sThumbnail) {
      const sThumbnailFile = await fileToDataUri(sThumbnail);
      formData.append('sThumbnail', sThumbnailFile)
    }

    if (typeof (data?.oWinningRatio) === 'string') {
      await getImageFileFromUrl(data?.oWinningRatio).then((imageFile) => formData.append('oWinningRatio', imageFile))
    } else {
      formData.append('oWinningRatio', data?.oWinningRatio);
    }

    if (typeof (data?.aBlindStructure) === 'string') {
      await getImageFileFromUrl(data?.aBlindStructure).then((imageFile) => formData.append('oWinningRatio', imageFile))
    } else {
      formData.append('aBlindStructure', data?.aBlindStructure);
    }

    mutate(formData)
  }

  useEffect(() => {
    document.title = 'Add Prototype | Tournament | PokerGold'
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
                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className=''>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span>
                            Tournament Type
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name='eTournamentType'
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: 'Please select the tournament type.'
                            }
                          }}
                          defaultValue={eTournamentTypeOption?.[1]}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select poker type'
                              ref={ref}
                              options={eTournamentTypeOption}
                              className={`react-select border-0 ${errors.eTournamentType && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                        {errors.eTournamentType && (
                          <Form.Control.Feedback type='invalid'>
                            {errors.eTournamentType.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className=''>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sName && 'error'}`}
                        name='sName'
                        label='Name'
                        placeholder='Enter tournament name'
                        required
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[0-9]+$/g, '')
                        }}
                        validation={{
                          required: {
                            value: true,
                            message: validationErrors.nameRequired
                          },
                        }}
                      />
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-2'>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`for m-control ${errors?.nBuyIn && 'error'}`}
                        name='nBuyIn'
                        label='Buy In'
                        placeholder='Enter buy in'
                        required
                        validation={{
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Only numbers are allowed'
                          },
                          required: {
                            value: true,
                            message: 'Buy In is required'
                          },
                        }}
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                        }}
                      />
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xxl-0 mt-xl-2 mt-lg-2 mt-md-2'>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span>
                            Entry Fee Type
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name='eEntryFeeType'
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: 'Please select the entry fee type.'
                            }
                          }}
                          defaultValue={eEntryFeeTypeOption?.[0]}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select entry fee type'
                              ref={ref}
                              options={eEntryFeeTypeOption}
                              className={`react-select border-0 ${errors.eEntryFeeType && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                        {errors.eEntryFeeType && (
                          <Form.Control.Feedback type='invalid'>
                            {errors.eEntryFeeType.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                      {watch('eEntryFeeType')?.value === 'chips' ?
                        <CommonInput
                          defaultValue='0'
                          type='text'
                          register={register}
                          errors={errors}
                          className={`for m-control ${errors?.nEntryFee && 'error'}`}
                          name='nEntryFee'
                          label='Entry Fee'
                          placeholder='Enter entry fee amount'
                          required
                          validation={{
                            pattern: {
                              value: /^[0-9]+$/,
                              message: 'Only numbers are allowed'
                            },
                            required: {
                              value: true,
                              message: 'Entry fee amount is required'
                            },
                          }}
                          onChange={(e) => {
                            e.target.value =
                              e.target.value?.trim() &&
                              e.target.value.replace(/^[a-zA-z]+$/g, '')
                          }}
                        /> :
                        <Form.Group className='form-group'>
                          <Form.Label>
                            <span>
                              Joining Tickets
                              <span className='inputStar'>*</span>
                            </span>
                          </Form.Label>
                          <Controller
                            name='aTicketId'
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: 'Please select joining tickets'
                              }
                            }}
                            render={({ field: { onChange, value, ref } }) => (
                              <Select
                                placeholder='Select entry fee type'
                                ref={ref}
                                isMulti={true}
                                options={ticketDropDown}
                                className={`react-select border-0 ${errors.aTicketId && 'error'}`}
                                classNamePrefix='select'
                                isSearchable={false}
                                value={value}
                                onChange={onChange}
                                getOptionLabel={(option) => option.sName}
                                getOptionValue={(option) => option._id}
                              />
                            )}
                          />
                          {errors.aTicketId && (
                            <Form.Control.Feedback type='invalid'>
                              {errors.aTicketId.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      }
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span>
                            Poker Type
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name='ePokerType'
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: 'Please select the poker type.'
                            }
                          }}
                          defaultValue={ePokerTypeOption?.[0]}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select poker type'
                              ref={ref}
                              options={ePokerTypeOption}
                              className={`react-select border-0 ${errors.ePokerType && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                        {errors.ePokerType && (
                          <Form.Control.Feedback type='invalid'>
                            {errors.ePokerType.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span>
                            No. of Player / Table
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name='nPlayer'
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: 'Number of player / table is required'
                            }
                          }}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select no. of player'
                              ref={ref}
                              options={eNoOfPlayerOption}
                              className={`react-select border-0 ${errors.nPlayer && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                        {errors.nPlayer && (
                          <Form.Control.Feedback type='invalid'>
                            {errors.nPlayer.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`for m-control ${errors?.nStartingChip && 'error'}`}
                        name='nStartingChip'
                        label='Starting Chip'
                        placeholder='Enter starting chip'
                        required
                        validation={{
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Only numbers are allowed'
                          },
                          required: {
                            value: true,
                            message: 'Starting chip is required'
                          },
                        }}
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                        }}
                      />
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nBuildUp && 'error'}`}
                        name='nBuildUp'
                        label='Build Up Interval (Seconds)'
                        placeholder='Enter build up interval'
                        required
                        validation={{
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Only numbers are allowed'
                          },
                          required: {
                            value: true,
                            message: 'Build up interval is required'
                          },
                          max: {
                            value: 600,
                            message: 'Build up must be less than 600 seconds'
                          }
                        }}
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                        }}
                      />
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                      <label>Add Thumbnail<span className='inputStar'>*</span></label>
                      <div className='inputtypefile mt-2'>
                        <div className='inputMSG'>
                          <span>Add Thumbnail Pics</span>
                        </div>

                        <Controller
                          name={`sThumbnail`}
                          control={control}
                          rules={{
                            required: "Please add PAN card front view ",
                            validate: {
                              fileType: (value) => {
                                if (value && typeof (watch(`sLogo`)) !== 'string') {
                                  const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                  const fileExtension = value.name.split('.').pop().toLowerCase();

                                  if (!allowedFormats.includes(fileExtension)) {
                                    return "Unsupported file format";
                                  }

                                  const maxSize = 1 * 1000 * 1000; // 1MB in bytes
                                  if (value.size >= maxSize) {
                                    return "File size must be less than 1MB";
                                  }
                                }
                                return true;
                              },
                            }
                          }}
                          render={({ field: { onChange, value, ref } }) => {

                            return <>
                              <Form.Control
                                ref={ref}
                                type='file'
                                name={`sThumbnail`}
                                // disabled={updateFlag}
                                accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                errors={errors}
                                className={errors?.sThumbnail && 'error'}
                                onChange={(e) => {
                                  onChange(e.target.files[0])
                                }}
                              />
                            </>
                          }}
                        />
                      </div>
                      <span className='file'>{watch('sThumbnail')?.name}</span>

                      <span className='card-error'>{errors && errors?.sThumbnail && <Form.Control.Feedback type="invalid">{errors?.sThumbnail.message}</Form.Control.Feedback>}</span>
                    </Col>

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`for m-control ${errors?.nReEntryLimit && 'error'}`}
                        name='nReEntryLimit'
                        label='Re-Entry Limit'
                        placeholder='Enter re-entry limit'
                        required
                        validation={{
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Only numbers are allowed'
                          },
                          required: {
                            value: true,
                            message: 'Re-Entry limit is required'
                          },
                        }}
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                        }}
                      />
                    </Col>

                    {watch('eTournamentType')?.value === 'mtt' ?
                      <>
                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                          <CommonInput
                            type='text'
                            register={register}
                            errors={errors}
                            className={`for m-control ${errors?.nMinimum && 'error'}`}
                            name='nMinimum'
                            label='Minimum Player Entry'
                            placeholder='Enter minimum player entry'
                            required
                            validation={{
                              pattern: {
                                value: /^[0-9]+$/,
                                message: 'Only numbers are allowed'
                              },
                              required: {
                                value: true,
                                message: 'Minimum player entry is required'
                              },
                            }}
                            onChange={(e) => {
                              e.target.value =
                                e.target.value?.trim() &&
                                e.target.value.replace(/^[a-zA-z]+$/g, '')
                            }}
                          />
                        </Col>

                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                          <CommonInput
                            type='text'
                            register={register}
                            errors={errors}
                            className={`for m-control ${errors?.nMaximum && 'error'}`}
                            name='nMaximum'
                            label='Maximum Player Entry'
                            placeholder='Enter maximum player entry'
                            required
                            validation={{
                              pattern: {
                                value: /^[0-9]+$/,
                                message: 'Only numbers are allowed'
                              },
                              required: {
                                value: true,
                                message: 'Maximum player entry is required'
                              },
                              min: {
                                value: getValues('nMinimum'),
                                message: 'Maximum entry must be greater than Minimum entry.'
                              }
                            }}
                            onChange={(e) => {
                              e.target.value =
                                e.target.value?.trim() &&
                                e.target.value.replace(/^[a-zA-z]+$/g, '')

                              if (+e?.target?.value <= +getValues('nMinimum')) {
                                setError('nMaximum', {
                                  type: 'manual',
                                  message: 'Maximum entry must be greater than Minimum entry.'
                                })
                              }
                              clearErrors('nMaximum')
                            }}
                          />
                        </Col>

                        <div className='wrapper mt-4 re-buy'>
                          <h3>Break</h3><hr />
                          <Row>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`for m-control ${errors?.nBreakLevelInterval && 'error'}`}
                                name='nBreakLevelInterval'
                                label='Level Interval'
                                placeholder='Enter level interval'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'Level interval is required'
                                  },
                                  min: {
                                    value: getValues('nLevelTo'),
                                    message: "Break Level must be greater than ReBuy's Level To."
                                  }
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')

                                  if (+e?.target?.value <= +getValues('nLevelTo')) {
                                    setError('nBreakLevelInterval', {
                                      type: 'manual',
                                      message: "Break Level must be greater than ReBuy's Level To."
                                    })
                                  }
                                  clearErrors('nBreakLevelInterval')
                                }}
                              />
                            </Col>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nBreakDuration && 'error'}`}
                                name='nBreakDuration'
                                label='Duration (in Seconds)'
                                placeholder='Enter the break duration'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'Break duration is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                          </Row>
                        </div>

                        <div className='wrapper mt-4 re-buy'>
                          <h3>ReBuy</h3><hr />
                          <Row>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`for m-control ${errors?.nLevelFrom && 'error'}`}
                                name='nLevelFrom'
                                label='Level From'
                                placeholder='Enter starting level'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'Level From is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`for m-control ${errors?.nLevelTo && 'error'}`}
                                name='nLevelTo'
                                label='Level To'
                                placeholder='Enter ending level'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'Level To is required'
                                  },
                                  min: {
                                    value: getValues('nLevelTo'),
                                    message: 'Level To entry must be greater than Level From.'
                                  }
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')

                                  setValue('nBreakLevelInterval', '')

                                  if (+e?.target?.value <= +getValues('nLevelFrom')) {
                                    setError('nLevelTo', {
                                      type: 'manual',
                                      message: 'Level To entry must be greater than Level From.'
                                    })
                                  }
                                  clearErrors('nLevelTo')
                                }}
                              />
                            </Col>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nReBuyFee && 'error'}`}
                                name='nReBuyFee'
                                label='Fee'
                                placeholder='Enter re-buy fee'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'ReBuy fee is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nReBuyChip && 'error'}`}
                                name='nReBuyChip'
                                label='Chips'
                                placeholder='Enter re-buy chips'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'ReBuy chip is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nLimit && 'error'}`}
                                name='nLimit'
                                label='Limit per User'
                                placeholder='Enter re-buy limit'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'ReBuy Limit is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                          </Row>
                        </div>

                        <div className='wrapper mt-3 addOn'>
                          <h3>Add On</h3><hr />
                          <Row>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`for m-control ${errors?.nLevel && 'error'}`}
                                name='nLevel'
                                label='Level'
                                placeholder='Enter add-on level'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'Add on level is required'
                                  },
                                  min: {
                                    value: getValues('nLevelTo'),
                                    message: "Level must be greater than ReBuy's level to."
                                  }
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')

                                  if (+e?.target?.value <= +getValues('nLevelTo')) {
                                    setError('nLevel', {
                                      type: 'manual',
                                      message: "Level must be greater than ReBuy's level to."
                                    })
                                  }
                                  clearErrors('nLevel')
                                }}
                              />
                            </Col>

                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nAddOnFee && 'error'}`}
                                name='nAddOnFee'
                                label='Fee'
                                placeholder='Enter add-on fee'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'AddOn fee is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nAddOnChip && 'error'}`}
                                name='nAddOnChip'
                                label='Chips'
                                placeholder='Enter add-on chips'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'AddOn chip is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nOffset && 'error'}`}
                                name='nOffset'
                                label='Offset (Level Based)'
                                placeholder='Enter add-on offset'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'AddOn offset is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`form-control ${errors?.nDuration && 'error'}`}
                                name='nDuration'
                                label='Duration (in Seconds)'
                                placeholder='Enter the add-on duration'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'AddOn duration is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                          </Row>
                        </div>

                        <div className='wrapper mt-3 addOn'>
                          <h3>MTT Winning</h3><hr />
                          <Row>
                            <Col xxl={3} xl={4} lg={6} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              <Form.Group className='form-group'>
                                <Form.Label>
                                  <span>
                                    Winning Type
                                    <span className='inputStar'>*</span>
                                  </span>
                                </Form.Label>
                                <Controller
                                  name='eMttType'
                                  control={control}
                                  rules={{
                                    required: {
                                      value: true,
                                      message: 'Please select the winning type.'
                                    }
                                  }}
                                  defaultValue={eEntryFeeTypeOption?.[0]}
                                  render={({ field: { onChange, value, ref } }) => (
                                    <Select
                                      placeholder='Select winning type'
                                      ref={ref}
                                      options={eEntryFeeTypeOption}
                                      className={`react-select border-0 ${errors.eMttType && 'error'}`}
                                      classNamePrefix='select'
                                      isSearchable={false}
                                      value={value}
                                      onChange={onChange}
                                      getOptionLabel={(option) => option.label}
                                      getOptionValue={(option) => option.value}
                                    />
                                  )}
                                />
                                {errors.eMttType && (
                                  <Form.Control.Feedback type='invalid'>
                                    {errors.eMttType.message}
                                  </Form.Control.Feedback>
                                )}
                              </Form.Group>
                            </Col>

                            <Col xxl={3} xl={4} lg={6} md={6} sm={6} className='mt-xl-2 mt-md-2 mt-sm-2'>
                              {(watch('eMttType')?.value === 'chips' || watch('eMttType')?.value === undefined) ?
                                <>
                                  <label>Winning Ratio<span className='inputStar'>*</span></label>
                                  <div className='inputtypefile mt-2'>
                                    <div className='inputMSG'>
                                      <span>Upload CSV File</span>
                                    </div>
                                    <Controller
                                      name={`oWinningRatio`}
                                      control={control}
                                      rules={{
                                        required: "Please upload winning ratio csv file",
                                        validate: {
                                          fileType: (value) => (value && typeof (watch(`oWinningRatio`)) !== 'string') ? (/csv|CSV/.test(value.name) || "Unsupported file format") : true,
                                        }
                                      }}
                                      render={({ field: { onChange, value, ref } }) => {
                                        return <>
                                          <Form.Control
                                            ref={ref}
                                            type='file'
                                            name={`oWinningRatio`}
                                            // disabled={updateFlag}
                                            accept='.csv,.CSV'
                                            errors={errors}
                                            className={errors?.oWinningRatio && 'error'}
                                            onChange={(e) => {
                                              onChange(e.target.files[0])
                                            }}
                                          />
                                        </>
                                      }}
                                    />
                                  </div>
                                  <span className='file'>{watch('oWinningRatio')?.name}</span>

                                  <span className='card-error'>{errors && errors?.oWinningRatio && <Form.Control.Feedback type="invalid">{errors?.oWinningRatio.message}</Form.Control.Feedback>}</span>
                                </> :
                                <Form.Group className='form-group'>
                                  <Form.Label>
                                    <span>
                                      Winning Ticket
                                      <span className='inputStar'>*</span>
                                    </span>
                                  </Form.Label>
                                  <Controller
                                    name='iTicketId'
                                    control={control}
                                    rules={{
                                      required: {
                                        value: true,
                                        message: 'Please select the winning ticket.'
                                      }
                                    }}
                                    render={({ field: { onChange, value, ref } }) => (
                                      <Select
                                        placeholder='Select winning ticket'
                                        ref={ref}
                                        options={ticketDropDown}
                                        className={`react-select border-0 ${errors.iTicketId && 'error'}`}
                                        classNamePrefix='select'
                                        isSearchable={false}
                                        value={value}
                                        onChange={onChange}
                                        getOptionLabel={(option) => option.sName}
                                        getOptionValue={(option) => option._id}
                                      />
                                    )}
                                  />
                                  {errors.iTicketId && (
                                    <Form.Control.Feedback type='invalid'>
                                      {errors.iTicketId.message}
                                    </Form.Control.Feedback>
                                  )}
                                </Form.Group>}
                            </Col>
                          </Row>
                        </div>
                      </>
                      : <>
                        <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-2'>
                          <CommonInput
                            type='text'
                            register={register}
                            errors={errors}
                            className={`for m-control ${errors?.nReSpinFee && 'error'}`}
                            name='nReSpinFee'
                            label='Re-Spin Fee'
                            placeholder='Enter re-spin fee'
                            required
                            validation={{
                              pattern: {
                                value: /^[0-9]+$/,
                                message: 'Only numbers are allowed'
                              },
                              required: {
                                value: true,
                                message: 'Re-Spin fee is required'
                              },
                            }}
                            onChange={(e) => {
                              e.target.value =
                                e.target.value?.trim() &&
                                e.target.value.replace(/^[a-zA-z]+$/g, '')
                            }}
                          />
                        </Col>

                        <div className='wrapper mt-3 addOn'>
                          <h3>Spin-Up Winning Range</h3><hr />
                          <Row>
                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className=''>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`for m-control ${errors?.nSpinUpMinimum && 'error'}`}
                                name='nSpinUpMinimum'
                                label='Minimum'
                                placeholder='Enter minimum spin-up'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'Minimum spin-up is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>

                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className=''>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`for m-control ${errors?.nSpinUpMaximum && 'error'}`}
                                name='nSpinUpMaximum'
                                label='Maximum'
                                placeholder='Enter maximum spin-up'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'Maximum spin-up is required'
                                  },
                                  min: {
                                    value: getValues('nSpinUpMinimum'),
                                    message: 'Maximum spin-up must be greater than Minimum spin-up.'
                                  }
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')

                                  if (+e?.target?.value <= +getValues('nSpinUpMinimum')) {
                                    setError('nSpinUpMaximum', {
                                      type: 'manual',
                                      message: 'Maximum spin-up must be greater than Minimum spin-up.'
                                    })
                                  }
                                  clearErrors('nSpinUpMaximum')
                                }}
                              />
                            </Col>

                            <Col xxl={3} xl={4} lg={4} md={6} sm={6} className=''>
                              <CommonInput
                                type='text'
                                register={register}
                                errors={errors}
                                className={`for m-control ${errors?.nSpinUpOffset && 'error'}`}
                                name='nSpinUpOffset'
                                label='Offset'
                                placeholder='Enter offset of spin-up'
                                required
                                validation={{
                                  pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Only numbers are allowed'
                                  },
                                  required: {
                                    value: true,
                                    message: 'Spin-up offset is required'
                                  },
                                }}
                                onChange={(e) => {
                                  e.target.value =
                                    e.target.value?.trim() &&
                                    e.target.value.replace(/^[a-zA-z]+$/g, '')
                                }}
                              />
                            </Col>
                          </Row>
                        </div>
                      </>}

                    <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-3'>
                      <Form.Group className='form-group'>
                        <Form.Label>
                          <span>
                            Blind Structure
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name='eBlindStructureType'
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: 'Please select the blind structure type.'
                            }
                          }}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select blind structure type'
                              ref={ref}
                              options={eBlindStructureTypeOption}
                              className={`react-select border-0 ${errors.eBlindStructureType && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                        {errors.eBlindStructureType && (
                          <Form.Control.Feedback type='invalid'>
                            {errors.eBlindStructureType.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    {watch('eBlindStructureType')?.value === 'dynamic' &&
                      <div className='wrapper mt-4 addOn'>
                        <h3>Blind</h3><hr />
                        <Row>
                          <Col xxl={3} xl={4} lg={6} md={6} sm={6} className=''>
                            <CommonInput
                              type='text'
                              register={register}
                              errors={errors}
                              className={`for m-control ${errors?.nBlindDefaultAmount && 'error'}`}
                              name='nBlindDefaultAmount'
                              label='Small Blind Amount'
                              placeholder='Enter default amount'
                              required
                              validation={{
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: 'Only numbers are allowed'
                                },
                                required: {
                                  value: true,
                                  message: 'Blind default amount is required'
                                },
                              }}
                              onChange={(e) => {
                                e.target.value =
                                  e.target.value?.trim() &&
                                  e.target.value.replace(/^[a-zA-z]+$/g, '')
                              }}
                            />
                          </Col>

                          <Col xxl={3} xl={4} lg={6} md={6} sm={6} className=''>
                            <CommonInput
                              type='text'
                              register={register}
                              errors={errors}
                              className={`for m-control ${errors?.nBlindMultiplier && 'error'}`}
                              name='nBlindMultiplier'
                              label='Multiplier'
                              placeholder='Enter multiplier'
                              required
                              validation={{
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: 'Only numbers are allowed'
                                },
                                required: {
                                  value: true,
                                  message: 'Blind multiplier is required'
                                },
                              }}
                              onChange={(e) => {
                                e.target.value =
                                  e.target.value?.trim() &&
                                  e.target.value.replace(/^[a-zA-z]+$/g, '')
                              }}
                            />
                          </Col>
                        </Row>

                        <h3 className='mt-3'>Ante</h3><hr />
                        <Row>
                          <Col xxl={3} xl={4} lg={6} md={6} sm={6} className=''>
                            <CommonInput
                              type='text'
                              register={register}
                              errors={errors}
                              className={`for m-control ${errors?.nAnteDefaultAmount && 'error'}`}
                              name='nAnteDefaultAmount'
                              label='Default Amount'
                              placeholder='Enter default amount'
                              required
                              validation={{
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: 'Only numbers are allowed'
                                },
                                required: {
                                  value: true,
                                  message: 'Ante default amount is required'
                                },
                              }}
                              onChange={(e) => {
                                e.target.value =
                                  e.target.value?.trim() &&
                                  e.target.value.replace(/^[a-zA-z]+$/g, '')
                              }}
                            />
                          </Col>

                          <Col xxl={3} xl={4} lg={6} md={6} sm={6} className=''>
                            <CommonInput
                              type='text'
                              register={register}
                              errors={errors}
                              className={`for m-control ${errors?.nAnteLevelFrom && 'error'}`}
                              name='nAnteLevelFrom'
                              label='Level From'
                              placeholder='Enter level from'
                              required
                              validation={{
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: 'Only numbers are allowed'
                                },
                                required: {
                                  value: true,
                                  message: 'Ante level from is required'
                                },
                              }}
                              onChange={(e) => {
                                e.target.value =
                                  e.target.value?.trim() &&
                                  e.target.value.replace(/^[a-zA-z]+$/g, '')
                              }}
                            />
                          </Col>

                          <Col xxl={3} xl={4} lg={6} md={6} sm={6} className=''>
                            <CommonInput
                              type='text'
                              register={register}
                              errors={errors}
                              className={`for m-control ${errors?.nAnteMultiplier && 'error'}`}
                              name='nAnteMultiplier'
                              label='Multiplier'
                              placeholder='Enter multiplier'
                              required
                              validation={{
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: 'Only numbers are allowed'
                                },
                                required: {
                                  value: true,
                                  message: 'Ante multiplier is required'
                                },
                              }}
                              onChange={(e) => {
                                e.target.value =
                                  e.target.value?.trim() &&
                                  e.target.value.replace(/^[a-zA-z]+$/g, '')
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    }

                    {watch('eBlindStructureType')?.value === 'static' &&
                      <Col xxl={3} xl={4} lg={4} md={6} sm={6} className='mt-3'>
                        <label>Upload CSV<span className='inputStar'>*</span></label>
                        <div className='inputtypefile mt-2'>
                          <div className='inputMSG'>
                            <span>Add CSV File</span>
                          </div>
                          <Controller
                            name={`aBlindStructure`}
                            control={control}
                            rules={{
                              required: "Please upload csv file",
                              validate: {
                                fileType: (value) => (value && typeof (watch(`aBlindStructure`)) !== 'string') ? (/csv|CSV/.test(value.name) || "Unsupported file format") : true,
                              }
                            }}
                            render={({ field: { onChange, value, ref } }) => {

                              return <>
                                <Form.Control
                                  ref={ref}
                                  type='file'
                                  name={`aBlindStructure`}
                                  // disabled={updateFlag}
                                  accept='.csv,.CSV'
                                  errors={errors}
                                  className={errors?.aBlindStructure && 'error'}
                                  onChange={(e) => {
                                    onChange(e.target.files[0])
                                  }}
                                />
                              </>
                            }}
                          />
                        </div>
                        <span className='file'>{watch('aBlindStructure')?.name}</span>

                        <span className='card-error'>{errors && errors?.aBlindStructure && <Form.Control.Feedback type="invalid">{errors?.aBlindStructure.message}</Form.Control.Feedback>}</span>
                      </Col>
                    }

                    <Row className='mt-4'>
                      <Col sm={6}>
                        <Button variant='secondary' className='me-2' onClick={() => navigate(route.prototype)}>
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

export default AddPrototype