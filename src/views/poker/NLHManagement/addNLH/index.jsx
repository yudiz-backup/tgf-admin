import React, { useEffect, useRef, useState } from 'react'
import { fileToDataUri, toaster } from 'helper/helper'
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import CommonInput from 'shared/components/CommonInput'
import Wrapper from 'shared/components/Wrap'
import { route } from 'shared/constants/AllRoutes'
import { validationErrors } from 'shared/constants/ValidationErrors'
import Select from 'react-select'
import { addNLH, addPLO } from 'query/poker/poker.query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const AddNLH = () => {
    const location = useLocation()
    const query = useQueryClient()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, control, reset, getValues, setValue, watch } = useForm({ mode: 'all' })

    const eGameTypeOptions = [
        { label: 'Cash', value: 'cash' },
        { label: 'Practice', value: 'practice' },
    ]

    const statusOption = [
        { label: 'Active', value: 'y' },
        { label: 'In-Active', value: 'n' },
    ]

    const [show, setShow] = useState(false);
    const target = useRef(null)

    // ADD NLH POKER
    const { mutate } = useMutation(addNLH, {
        onSuccess: (response) => {
            toaster(response.data.message)

            if (location?.pathname === '/poker/add') {
                navigate(route.nlhManagement)
                query.invalidateQueries('NLHList')
            }
            reset()
        }
    })

    // ADD PLO POKER & OFC POKER
    const { mutate: mutatePLO } = useMutation(addPLO, {
        onSuccess: (response) => {
            toaster(response.data.message)
            if (location?.state?.endsWith('PLO')) {
                navigate(route.ploManagement)
                query.invalidateQueries('PLOList')
            }
            if (location?.state?.endsWith('OFC')) {
                navigate(route.ofcManagement)
                query.invalidateQueries('OFCList')
            }
            reset()
        }
    })

    async function onSubmit (data) {
        const addData = {
            sName: data?.sName?.toUpperCase(),
            eGameType: data?.eGameType?.value,
            ePokerType: location?.state?.endsWith('PLO') ? 'PLO' : 'NLH',
            eStatus: data?.eStatus?.value,
            nAnte: +data?.nAnte,
            nBigBlind: +data?.nBigBlind,
            nSmallBlind: +data?.nSmallBlind,
            nMaxBot: +data?.nMaxBot,
            nMinimumBuyIn: +data?.nMinimumBuyIn,
            nMaximumBuyIn: +data?.nMaximumBuyIn,
            nRake: +data?.nRake,
            nTurnTime: +data?.nTurnTime * 1000,
            sThumbnail: data?.sThumbnail || '',
            sBanner: data?.sBanner || ''
        }

        const ofcData = {
            sName: data?.sName?.toUpperCase(),
            eGameType: data?.eGameType?.value,
            ePokerType: 'OFC',
            eStatus: data?.eStatus?.value,
            nAnte: +data?.nAnte,
            nBlind: +data?.nBlind,
            nMaxBot: +data?.nMaxBot,
            nMinimumBuyIn: +data?.nMinimumBuyIn,
            nMaximumBuyIn: +data?.nMaximumBuyIn,
            nRake: +data?.nRake,
            nTurnTime: +data?.nTurnTime * 1000,
            sThumbnail: data?.sThumbnail || '',
            sBanner: data?.sBanner || ''
        }

        const sThumbnail = data?.sThumbnail;
        if (sThumbnail) {
            const sThumbnailFile = await fileToDataUri(sThumbnail);
            addData.sThumbnail = sThumbnailFile
            ofcData.sThumbnail = sThumbnailFile
        }

        const sBanner = data?.sBanner;
        if (sBanner) {
            const sBannerFile = await fileToDataUri(sBanner);
            addData.sBanner = sBannerFile
            ofcData.sBanner = sBannerFile
        }

        if (location?.pathname === '/poker/add' && !location?.state) {
            mutate(addData)
        }
        if (location?.state?.endsWith('PLO')) {
            mutatePLO(addData)
        }
        if (location?.state?.endsWith('OFC')) {
            mutatePLO(ofcData)
        }
    }

    const validateMaxValue = (data) => (value) => {
        if (data === 'min') {
            if (location?.state?.endsWith('OFC')) {
                const minValue = +getValues('nBlind') + +getValues('nAnte');
                if (value && +value <= +minValue) {
                    return 'Minimum Buy in must be greater than (Blind + Ante).';
                }
            } else {
                const minValue = +getValues('nBigBlind') + +getValues('nAnte');
                if (value && +value <= +minValue) {
                    return 'Minimum Buy in must be greater than (Big Blind + Ante).';
                }
            }
            return true;
        } else {
            const minValue = +getValues('nMinimumBuyIn');
            if (value && +value < +minValue) {
                return 'Maximum Buy in must be greater than or equal to Minimum Buy In.';
            }
            return true;
        }
    }

    const renderTooltip = (props) => {
      const tooltipMessage = "Image upload limit: 300 KB. Please ensure your file size is within this limit."

      return (
        <Tooltip id="button-tooltip" {...props}>
          <span style={{ fontSize: '10px', display: 'block' }}>{tooltipMessage}</span>
        </Tooltip>
      )
    }

    useEffect(() => {
        document.title = location?.state?.endsWith('PLO') ? 'Add PLO Table | Poker | PokerGold' : location?.state?.endsWith('OFC') ? 'Add OFC Table | Poker | PokerGold' : 'Add NLH Table | Poker | PokerGold'
    }, [location?.state])
    return (
        <>
            <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)} >
                <div className='personal-details'>
                    <div className='user-form'>
                        <Row>
                            <Col xxl={12}>
                                <Wrapper>
                                    <Row>
                                        <Col xxl={3} xl={4} lg={6} md={6} sm={12}>
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
                                                        message: validationErrors.nameRequired
                                                    },
                                                }}
                                            />
                                        </Col>
                                        <Col xxl={3} xl={4} lg={6} md={6} sm={12} className=''>
                                            <Form.Group className='form-group'>
                                                <Form.Label>
                                                    <span>
                                                        Game Type
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name='eGameType'
                                                    control={control}
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: 'Game type is required'
                                                        }
                                                    }}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <Select
                                                            placeholder='Select game type'
                                                            ref={ref}
                                                            options={eGameTypeOptions}
                                                            className={`react-select border-0 ${errors.eGameType && 'error'}`}
                                                            classNamePrefix='select'
                                                            isSearchable={false}
                                                            value={value}
                                                            onChange={onChange}
                                                            getOptionLabel={(option) => option.label}
                                                            getOptionValue={(option) => option.value}
                                                        />
                                                    )}
                                                />
                                                {errors.eGameType && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.eGameType.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col xxl={3} xl={4} lg={6} md={6} sm={12} className=''>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`for m-control ${errors?.nAnte && 'error'}`}
                                                name='nAnte'
                                                label='Ante'
                                                placeholder='Enter the Ante'
                                                required
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Ante is required'
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>
                                        {location?.state?.endsWith('OFC') ? <>
                                            <Col sm={3} className=''>
                                                <CommonInput
                                                    type='text'
                                                    register={register}
                                                    errors={errors}
                                                    className={`for m-control ${errors?.nBlind && 'error'}`}
                                                    name='nBlind'
                                                    label='Blind'
                                                    placeholder='Enter the blind'
                                                    required
                                                    validation={{
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Only numbers are allowed'
                                                        },
                                                        required: {
                                                            value: true,
                                                            message: 'Blind is required'
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        e.target.value =
                                                            e.target.value?.trim() &&
                                                            e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                    }}
                                                />
                                            </Col>
                                        </> : <>
                                            <Col xxl={3} xl={4} lg={6} md={6} sm={12}>
                                                <Row>
                                                    <Col sm={6} className='mt-xxl-0 mt-xl-2 mt-lg-0 mt-md-0 mt-2'>
                                                        <CommonInput
                                                            type='text'
                                                            register={register}
                                                            errors={errors}
                                                            className={`for m-control ${errors?.nSmallBlind && 'error'}`}
                                                            name='nSmallBlind'
                                                            label='Small Blind'
                                                            placeholder='Enter small blind'
                                                            required
                                                            validation={{
                                                                pattern: {
                                                                    value: /^[0-9]+$/,
                                                                    message: 'Only numbers are allowed'
                                                                },
                                                                required: {
                                                                    value: true,
                                                                    message: 'Small Blind is required'
                                                                },
                                                            }}
                                                            onChange={(e) => {
                                                                e.target.value =
                                                                    e.target.value?.trim() &&
                                                                    e.target.value.replace(/^[a-zA-z]+$/g, '')

                                                                setValue('nBigBlind', (+e?.target?.value * 2))
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col sm={6} className='mt-xxl-1 mt-xl-2 mt-lg-1 mt-md-1 mt-sm-3 mt-2'>
                                                        <CommonInput
                                                            type='text'
                                                            register={register}
                                                            errors={errors}
                                                            className={`for m-control ${errors?.nBigBlind && 'error'}`}
                                                            name='nBigBlind'
                                                            label='Big Blind'
                                                            placeholder='Enter small blind'
                                                            disabled
                                                            defaultValue='0'
                                                            validation={{
                                                                pattern: {
                                                                    value: /^[0-9]+$/,
                                                                    message: 'Only numbers are allowed'
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
                                            </Col>
                                        </>}
                                        <Col xxl={3} xl={4} lg={6} md={12} sm={12} className='mt-2'>
                                            <Row>
                                                <Col sm={6}>
                                                    <CommonInput
                                                        type='text'
                                                        register={register}
                                                        errors={errors}
                                                        className={`for m-control ${errors?.nMinimumBuyIn && 'error'}`}
                                                        name='nMinimumBuyIn'
                                                        label='Minimum Buy-In'
                                                        placeholder='Enter minimum buy-in'
                                                        validation={{
                                                            pattern: {
                                                                value: /^[0-9]+$/,
                                                                message: 'Only numbers are allowed'
                                                            },
                                                            validate: {
                                                                maxMinValue: (value) => validateMaxValue('min')(value)
                                                            },
                                                            required: {
                                                                value: true,
                                                                message: 'Minimum buy-in is required'
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            e.target.value =
                                                                e.target.value?.trim() &&
                                                                e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                        }}
                                                    />
                                                </Col>
                                                <Col sm={6} className='mt-sm-0 mt-2'>
                                                    <CommonInput
                                                        type='text'
                                                        register={register}
                                                        errors={errors}
                                                        className={`for m-control ${errors?.nMaximumBuyIn && 'error'}`}
                                                        name='nMaximumBuyIn'
                                                        label='Maximum Buy-In'
                                                        placeholder='Enter maximum buy-in'
                                                        validation={{
                                                            pattern: {
                                                                value: /^[0-9]+$/,
                                                                message: 'Only numbers are allowed'
                                                            },
                                                            validate: {
                                                                maxMinValue: (value) => validateMaxValue('max')(value)
                                                            },
                                                            required: {
                                                                value: true,
                                                                message: 'Maximum buy-in is required'
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            e.target.value =
                                                                e.target.value?.trim() &&
                                                                e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xxl={3} xl={4} lg={6} md={6} sm={12} className='mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`for m-control ${errors?.nTurnTime && 'error'}`}
                                                name='nTurnTime'
                                                label='Turn Time'
                                                placeholder='Enter turn time interval'
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    max: {
                                                        value: 60,
                                                        message: 'Turn time must be less than 60.'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Turn time is required'
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>
                                        <Col xxl={3} xl={4} lg={6} md={6} sm={12} className='mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.nRake && 'error'}`}
                                                name='nRake'
                                                label='Rake (%)'
                                                placeholder='Enter the rake'
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Rake is required'
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>
                                        <Col xxl={3} xl={4} lg={6} md={6} sm={12} className='mt-2'>
                                            <CommonInput
                                                type='text'
                                                register={register}
                                                errors={errors}
                                                className={`form-control ${errors?.nMaxBot && 'error'}`}
                                                name='nMaxBot'
                                                label='Max Bot'
                                                placeholder='Enter the max bot'
                                                validation={{
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'Only numbers are allowed'
                                                    },
                                                    max: {
                                                        value: location?.state?.endsWith('OFC') ? 5 : 8,
                                                        message: location?.state?.endsWith('OFC') ? 'Value must be less than 5.' : 'Value must be less than 8.'
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: 'Max Bot is required'
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    e.target.value =
                                                        e.target.value?.trim() &&
                                                        e.target.value.replace(/^[a-zA-z]+$/g, '')
                                                }}
                                            />
                                        </Col>
                                        <Col xxl={3} xl={4} lg={6} md={6} sm={12} className='mt-lg-0 mt-md-0 mt-1'>
                                            <Form.Group className='form-group'>
                                                <Form.Label>
                                                    <span>
                                                        Status
                                                        <span className='inputStar'>*</span>
                                                    </span>
                                                </Form.Label>
                                                <Controller
                                                    name='eStatus'
                                                    control={control}
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: 'Select the status'
                                                        }
                                                    }}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <Select
                                                            ref={ref}
                                                            value={value}
                                                            options={statusOption}
                                                            className={`react-select border-0 ${errors.eStatus && 'error'}`}
                                                            classNamePrefix='select'
                                                            closeMenuOnSelect={true}
                                                            onChange={(e) => {
                                                                onChange(e)
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.eStatus && (
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.eStatus.message}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col><hr className='my-3' />

                                        <Row className='m-0' style={{ padding: '0 5px' }}>
                                            <Col xxl={3} xl={4} lg={6} md={6} sm={12} className='mt-0 px-2'>
                                                <div className='info-content'>
                                                    <label>Add Banner<span className='inputStar'>*</span></label>
                                                    <OverlayTrigger
                                                        // placement="right"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={renderTooltip}
                                                    >
                                                        <span ref={target} onClick={() => setShow(!show)} className='information'><FontAwesomeIcon icon={faCircleInfo} color='var(--primary-color)' size='lg' /></span>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className='inputtypefile mt-2'>
                                                    <div className='inputMSG'>
                                                        <span>Add Banner Pics</span>
                                                    </div>

                                                    <Controller
                                                        name={`sBanner`}
                                                        control={control}
                                                        rules={{
                                                            required: "Please add Banner image",
                                                            validate: {
                                                                fileType: (value) => {
                                                                    if (value && typeof (getValues(`sBanner`)) !== 'string') {
                                                                        const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                                                        const fileExtension = value.name.split('.').pop().toLowerCase();

                                                                        if (!allowedFormats.includes(fileExtension)) {
                                                                            return "Unsupported file format";
                                                                        }

                                                                        const maxSize = 1 * 1000 * 300; // 500KB in bytes
                                                                        if (value.size >= maxSize) {
                                                                            return "File size must be less than 300 KB";
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
                                                                    name={`sBanner`}
                                                                    accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                                                    errors={errors}
                                                                    className={errors?.sBanner && 'error'}
                                                                    onChange={(e) => {
                                                                        onChange(e.target.files[0])
                                                                    }}
                                                                />
                                                            </>
                                                        }}
                                                    />
                                                </div>
                                                <span className='file'>{watch('sBanner')?.name}</span>

                                                <span className='card-error'>{errors && errors?.sBanner && <Form.Control.Feedback type="invalid">{errors?.sBanner.message}</Form.Control.Feedback>}</span>
                                            </Col>
                                            <Col xxl={3} xl={4} lg={6} md={6} sm={12} className='mt-md-0 mt-sm-2 mt-2 px-2'>
                                                <div className='info-content'>
                                                    <label>Add Thumbnail<span className='inputStar'>*</span></label>
                                                    <OverlayTrigger
                                                        // placement="right"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={renderTooltip}
                                                    >
                                                        <span ref={target} onClick={() => setShow(!show)} className='information'><FontAwesomeIcon icon={faCircleInfo} color='var(--primary-color)' size='lg' /></span>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className='inputtypefile mt-2'>
                                                    <div className='inputMSG'>
                                                        <span>Add Thumbnail Pics</span>
                                                    </div>

                                                    <Controller
                                                        name={`sThumbnail`}
                                                        control={control}
                                                        rules={{
                                                            required: "Please add Thumbnail image",
                                                            validate: {
                                                                fileType: (value) => {
                                                                    if (value && typeof (getValues(`sThumbnail`)) !== 'string') {
                                                                        const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                                                        const fileExtension = value.name.split('.').pop().toLowerCase();

                                                                        if (!allowedFormats.includes(fileExtension)) {
                                                                            return "Unsupported file format";
                                                                        }

                                                                        const maxSize = 1 * 1000 * 300; // 300 kb in bytes
                                                                        if (value.size >= maxSize) {
                                                                            return "File size must be less than 300 KB";
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
                                        </Row>

                                        <Row className='mt-4'>
                                            <Col sm={12}>
                                                <Button variant='secondary' className='me-2' onClick={() => location?.state?.endsWith('PLO') ? navigate(route.ploManagement) : location?.state?.endsWith('OFC') ? navigate(route.ofcManagement) : navigate(route.nlhManagement)}>
                                                    Cancel
                                                </Button>
                                                <Button variant='primary' type='submit'>
                                                    {location?.state?.endsWith('PLO') ? 'Add PLO' : location?.state?.endsWith('OFC') ? 'Add OFC' : 'Add NLH'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                </Wrapper>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Form >
        </>
    )
}

export default AddNLH
