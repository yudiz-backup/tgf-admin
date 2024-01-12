import React, { useEffect, useRef, useState } from 'react'
import Wrapper from '../Wrap'
import CommonInput from '../CommonInput'
import { Controller, useForm } from 'react-hook-form'
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { fileToDataUri, toaster } from 'helper/helper'
import Select from 'react-select'
import { docColumns } from 'shared/constants/TableHeaders'
import { useMutation, useQueryClient } from 'react-query'
import { addUserPanCard, updateUserKYCCardStatus } from 'query/user/user.mutation'
import CommonPasswordModal from '../CommonPasswordModal'
import CustomModal from '../Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const UserKYCDetail = ({ id, userKYC }) => {
  const query = useQueryClient()

  const [modal, setModal] = useState({ open: false, type: '' })
  const [panDetail, setPanDetail] = useState()

  const [show, setShow] = useState(false)
  const target = useRef(null)

  const { register, handleSubmit, formState: { errors }, control, watch, reset, getValues } = useForm({ mode: 'all' })
  const { handleSubmit: kycHandleSubmit, formState: { errors: kycErrors }, control: kycControl, watch: kycWatch, reset: resetKYC } = useForm({ mode: 'all' })

  useEffect(() => {
    const pan = userKYC?.find(item => item?.sNumber !== null)
    const doc = userKYC?.find(item => item?.sNumber === null)

    reset({
      sPanCard: pan?.sFront,
      sNumber: pan?.sNumber,
    })

    resetKYC({
      eDocument: docColumns?.find(item => item?.value === doc?.eDocument),
      sFront: doc?.sFront,
      sBack: doc?.sBack
    })

  }, [reset, userKYC, resetKYC])


  // ADD or EDIT PAN CARD
  const { mutate } = useMutation(addUserPanCard, {
    enabled: !!watch('sPassword'),
    onSuccess: (response) => {
      toaster(response.data.message)
      query.invalidateQueries('userKYCData')
      setModal({ open: false, type: '' })
      reset()
    }
  })

  // UPDATE PAN CARD STATUS
  const { mutate: mutateUserKYCCardStatus } = useMutation(updateUserKYCCardStatus, {
    enabled: !!watch('sPassword'),
    onSuccess: (response) => {
      toaster(response.data.message)
      setModal({ open: false, type: '' })
      query.invalidateQueries('userKYCData')
      reset({
        sPassword: '',
        sDescription: ''
      })
    }
  })

  const onSubmit = async (data) => {
    const addData = {
      sNumber: data?.sNumber,
      sDescription: data?.sDescription || '',
      iUserId: id,
      iDocumentId: userKYC?.find(item => item?._id === 'pan_card')?.iDocumentId || '',
      eStatus: userKYC?.find(item => item?._id === 'pan_card')?.eStatus || '',
      sFront: await fileToDataUri(data?.sPanCard).then((imageFile) => imageFile) || '',
      eDocument: userKYC?.find(item => item?._id === 'pan_card')?._id || ''
    }
    setPanDetail(addData)
    setModal({ open: true, type: 'pan-submit-button' })
  }

  const handleConfirmAdd = () => {
    mutate({ ...panDetail, sPassword: getValues('sPassword') })
  }

  const onKYCSubmit = async (document) => {
    const addData = {
      eDocument: document?.eDocument?.value || '',
      eStatus: userKYC?.find(item => item?._id !== 'pan_card')?.eStatus || '',
      iDocumentId: userKYC?.find(item => item?._id !== 'pan_card')?.iDocumentId || '',
      iUserId: id,
      sDescription: document?.sDescription || '',
      sFront: await fileToDataUri(document?.sFront).then((imageFile) => imageFile) || '',
      sBack: await fileToDataUri(document?.sBack).then((imageFile) => imageFile) || '',
    }
    setPanDetail(addData)
    setModal({ open: true, type: 'kyc-submit-button' })
  }

  const handleApproveButton = (docID) => {
    setModal({ open: true, type: 'approve-button', iDocumentId: docID })
  }

  const handleRejectButton = (docID) => {
    setModal({ open: true, type: 'reject-button', iDocumentId: docID })
  }

  const handleStatusOperation = () => {
    if (modal?.type === 'approve-button') {

      mutateUserKYCCardStatus({
        id: id,
        payload: {
          eStatus: 'approved',
          iDocumentId: modal?.iDocumentId,
          sPassword: getValues('sPassword')
        }
      })
    }
    if (modal?.type === 'reject-button') {

      mutateUserKYCCardStatus({
        id: id,
        payload: {
          eStatus: 'rejected',
          iDocumentId: modal?.iDocumentId,
          sDescription: getValues('sDescription'),
          sPassword: getValues('sPassword')
        }
      })
    }
  }

  const renderTooltip = (props) => {
    const tooltipMessage = "Image upload limit: 800 KB. Please ensure your file size is within this limit."

    return (
      <Tooltip id="kyc-tooltip" {...props}>
        <span style={{ fontSize: '10px', display: 'block' }}>{tooltipMessage}</span>
      </Tooltip>
    )
  }

  return (
    <>
      <Row>
        <Col xxl={6} xl={12} lg={12}>
          <Wrapper>
            <h2 className='pan-header'>PAN Card Details</h2><hr />
            <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Row className='mt-4'>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12}>
                  <Row>
                    <Col xxl={6} xl={6} lg={6} md={6}>
                      <CommonInput
                        type='text'
                        info={true}
                        infoMsg={'PAN Number must contain 6 char, 4 digits number & no space allowed.'}
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sNumber && 'error'}`}
                        name='sNumber'
                        // disabled={updateFlag}
                        label='PAN Number'
                        placeholder='eg: ABCDE0000F'
                        required
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.toUpperCase()?.trim() &&
                            e.target.value?.toUpperCase()?.replace(/^[0-9]+$/g, '')
                        }}
                        // defaultValue={panDetail?.sNumber}
                        validation={{
                          pattern: {
                            value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                            message: 'Please enter valid PAN card number.'
                          },
                          required: {
                            value: true,
                            message: 'Pan card number required'
                          }
                        }}
                      />
                    </Col>
                    <Col className='fileinput' xxl={6} xl={6} lg={6} md={6}>
                      <div className='info-content'>
                        <label>Add PAN Card Front View<span className='inputStar'>*</span></label>
                        <OverlayTrigger
                          // placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip}
                        >
                          <span ref={target} onClick={() => setShow(!show)} className='information'><FontAwesomeIcon icon={faCircleInfo} color='var(--primary-color)' size='lg' /></span>
                        </OverlayTrigger>
                      </div>
                      <div className='inputtypefile'>
                        <div className='inputMSG'>
                          <span>Add PAN Card Front View </span>
                        </div>
                        <Controller
                          name={`sPanCard`}
                          control={control}
                          rules={{
                            required: "Please add PAN card front view ",
                            validate: {
                              fileType: (value) => {
                                if (value && typeof (watch(`sPanCard`)) !== 'string') {
                                  const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                  const fileExtension = value.name?.split('.').pop().toLowerCase();

                                  if (!allowedFormats.includes(fileExtension)) {
                                    return "Unsupported file format";
                                  }

                                  const maxSize = 1 * 1000 * 800; // 1MB in bytes
                                  if (value.size >= maxSize) {
                                    return "File size must be less than 800 KB";
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
                                name={`sPanCard`}
                                // disabled={updateFlag}
                                accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                errors={errors}
                                className={errors?.sPanCard && 'error'}
                                onChange={(e) => {
                                  onChange(e.target.files[0])
                                }}
                              />
                            </>
                          }}
                        />
                      </div>

                      <span className='card-error'>{errors && errors?.sPanCard && <Form.Control.Feedback type="invalid">{errors?.sPanCard.message}</Form.Control.Feedback>}</span>
                    </Col>
                    {userKYC?.find(item => item?._id === 'pan_card')?.sDescription && userKYC?.find(item => item?._id === 'pan_card')?.eStatus === 'rejected' &&
                      <Col xxl={6} xl={6} lg={6} md={6} className='mt-xxl-0 mt-xl-0 mt-lg-0 mt-3'>
                        <div className='reason'>
                          <span className=''>Reason for Rejection :- </span>
                          <span className='description'>{userKYC?.find(item => item?._id === 'pan_card')?.sDescription}</span>
                        </div>
                      </Col>
                    }
                    <Col lg={12} sm={6}>
                      <div className="document-preview-group d-flex justify-content-start">
                        {watch('sPanCard') && (
                          typeof (watch('sPanCard')) !== 'string'
                            ? <div className="document-preview"> <img src={URL.createObjectURL(watch('sPanCard'))} alt='altImage' /> </div>
                            : <div className="document-preview"><img src={watch('sPanCard')} alt='altImage' /> </div>)}
                      </div>
                    </Col>
                  </Row>
                </Col>

              </Row>
              <div className='d-flex gap-2 justify-content-end'>
                <Button type='submit' className='mt-3 mt-lg-3'>Submit</Button>
                {userKYC?.length > 0 ?
                  userKYC?.find(item => item?._id === 'pan_card')?.eStatus === 'pending' ? <>
                    <Button className='mt-3 mt-lg-3 approve' onClick={() => handleApproveButton(userKYC?.find(item => item?._id === 'pan_card')?.iDocumentId)}>Approve</Button>
                    <Button className='mt-3 mt-lg-3 reject' onClick={() => handleRejectButton(userKYC?.find(item => item?._id === 'pan_card')?.iDocumentId)}>Reject</Button>
                  </>
                    : userKYC?.find(item => item?._id === 'pan_card')?.eStatus === 'approved' ?
                      <Button className='mt-3 mt-lg-3 reject' onClick={() => handleRejectButton(userKYC?.find(item => item?._id === 'pan_card')?.iDocumentId)}>Reject</Button> :
                      userKYC?.find(item => item?._id === 'pan_card')?.eStatus === 'rejected' && <Button className='mt-3 mt-lg-3 approve' onClick={() => handleApproveButton(userKYC?.find(item => item?._id === 'pan_card')?.iDocumentId)}>Approve</Button>
                  : ''}
              </div>
            </Form>
          </Wrapper><br />
        </Col>

        <Col xxl={6} xl={12} lg={12}>
          <Wrapper>
            <h2 className='pan-header'>KYC Documents</h2><hr />
            <Form className='step-one' autoComplete='off' onSubmit={kycHandleSubmit(onKYCSubmit)}>
              <Row className='mt-4'>
                <Col sm={12}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='form-group mb-3'>
                        <Form.Label>
                          <span>
                            KYC Details
                            <span className='inputStar'>*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name='eDocument'
                          control={kycControl}
                          rules={{
                            required: {
                              value: true,
                              message: 'Please select document type'
                            }
                          }}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select document'
                              ref={ref}
                              defaultValue={userKYC?.sNumber === null && docColumns?.find(item => item?.value === userKYC?.eDocument)}
                              options={docColumns}
                              getOptionLabel={(option) => option?.label}
                              getOptionValue={(option) => option?.value}
                              className={`react-select border-0 ${kycErrors.eDocument && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                            />
                          )}
                        />
                        {kycErrors.eDocument && (
                          <Form.Control.Feedback type='invalid'>
                            {kycErrors.eDocument.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col className='fileinput mt-xxl-0 mt-xl-0 p-1' xxl={12} xl={6} lg={12} md={12}>
                      <Row className='p-2 pt-0 mt-xxl-0 mt-xl-0'>
                        <Col className='fileinput' sm={6}>
                          <div className='info-content'>
                            <label>Add Document Front View<span className='inputStar'>*</span></label>
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
                              <span>Upload Front View </span>
                            </div>
                            <Controller
                              name={`sFront`}
                              control={kycControl}
                              rules={{
                                required: "Please add document front view",
                                validate: {
                                  fileType: (value) => {
                                    if (value && typeof (kycWatch(`sFront`)) !== 'string') {
                                      const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                      const fileExtension = value.name?.split('.').pop().toLowerCase();

                                      if (!allowedFormats.includes(fileExtension)) {
                                        return "Unsupported file format";
                                      }

                                      const maxSize = 1 * 1000 * 800; // 1MB in bytes
                                      if (value.size >= maxSize) {
                                        return "File size must be less than 800 KB";
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
                                    name={`sFront`}
                                    accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                    errors={errors}
                                    className={kycErrors?.sFront && 'error'}
                                    onChange={(e) => {
                                      onChange(e.target.files[0])
                                    }}
                                  />
                                </>
                              }}
                            />
                          </div>

                          {kycErrors && kycErrors?.sFront && <Form.Control.Feedback type="invalid" className='p-3 pt-0'>{kycErrors?.sFront.message}</Form.Control.Feedback>}
                        </Col>
                        <Col className='fileinput mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-0 mt-sm-0 mt-2' sm={6}>
                          <div className='info-content'>
                            <label>Add Document Back View<span className='inputStar'>*</span></label>
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
                              <span>Upload Back View</span>
                            </div>
                            <Controller
                              name={`sBack`}
                              control={kycControl}
                              rules={{
                                required: "Please add document back view",
                                validate: {
                                  fileType: (value) => {
                                    if (value && typeof (kycWatch(`sBack`)) !== 'string') {
                                      const allowedFormats = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
                                      const fileExtension = value.name?.split('.').pop().toLowerCase();

                                      if (!allowedFormats.includes(fileExtension)) {
                                        return "Unsupported file format";
                                      }

                                      const maxSize = 1 * 1000 * 800; // 1MB in bytes
                                      if (value.size >= maxSize) {
                                        return 'File size must be less than 800 KB';
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
                                    name={`sBack`}
                                    accept='.jpg,.jpeg,.png,.JPEG,.JPG,.PNG'
                                    errors={kycErrors}
                                    className={kycErrors?.sBack && 'error'}
                                    onChange={(e) => {
                                      onChange(e.target.files[0])
                                    }}
                                  />
                                </>
                              }}
                            />
                          </div>

                          {kycErrors && kycErrors?.sBack && <Form.Control.Feedback type="invalid" className='p-3 pt-0'>{kycErrors?.sBack.message}</Form.Control.Feedback>}
                        </Col>
                      </Row>
                    </Col>

                    {userKYC?.find(item => item?._id !== 'pan_card')?.sDescription && userKYC?.find(item => item?._id !== 'pan_card')?.eStatus === 'rejected' &&
                      <Col md={6}>
                        <div className='reason'>
                          <span className=''>Reason for Rejection :- </span>
                          <span className='description'>{userKYC?.find(item => item?._id !== 'pan_card')?.sDescription}</span>
                        </div>
                      </Col>
                    }
                    <Col md={12}>
                      <div className="document-preview-group d-flex justify-content-start flex-nowrap">
                        {kycWatch('sFront') && (
                          typeof (kycWatch('sFront')) !== 'string'
                            ? <div className="document-preview"> <img src={URL.createObjectURL(kycWatch('sFront'))} alt='altImage' /><span>{kycWatch('eDocument')?.label} Front View</span> </div>
                            : <div className="document-preview"><img src={kycWatch('sFront')} alt='altImage' /><span>{kycWatch('eDocument')?.label} Front View</span> </div>)}

                        {kycWatch('sBack') && (
                          typeof (kycWatch('sBack')) !== 'string'
                            ? <div className="document-preview"><img src={URL.createObjectURL(kycWatch('sBack'))} alt='altImage' /><span>{kycWatch('eDocument')?.label} Back View</span> </div>
                            : <div className="document-preview"><img src={kycWatch('sBack')} alt='altImage' /><span>{kycWatch('eDocument')?.label} Back View</span> </div>)}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className='d-flex justify-content-end gap-2'>
                <Button type='submit' className='mt-3 mt-lg-3'>Submit</Button>
                {userKYC?.length > 0 ?
                  userKYC?.find(item => item?._id !== 'pan_card')?.eStatus === 'pending' ? <>
                    <Button className='mt-3 mt-lg-3 approve' onClick={() => handleApproveButton(userKYC?.find(item => item?._id !== 'pan_card')?.iDocumentId)}>Approve</Button>
                    <Button className='mt-3 mt-lg-3 reject' onClick={() => handleRejectButton(userKYC?.find(item => item?._id !== 'pan_card')?.iDocumentId)}>Reject</Button>
                  </>
                    : userKYC?.find(item => item?._id !== 'pan_card')?.eStatus === 'approved' ?
                      <Button className='mt-3 mt-lg-3 reject' onClick={() => handleRejectButton(userKYC?.find(item => item?._id !== 'pan_card')?.iDocumentId)}>Reject</Button> :
                      userKYC?.find(item => item?._id !== 'pan_card')?.eStatus === 'rejected' && <Button className='mt-3 mt-lg-3 approve' onClick={() => handleApproveButton(userKYC?.find(item => item?._id !== 'pan_card')?.iDocumentId)}>Approve</Button>
                  : ''}
              </div>
            </Form>
          </Wrapper>
        </Col>
      </Row>


      {modal?.type === 'reject-button' ?
        <CustomModal
          open={modal.open}
          handleClose={() => setModal({ open: false, type: '' })}
          handleConfirm={() => handleStatusOperation(modal?.iDocumentId)}
          disableHeader
          bodyTitle='Reject Reason?'
          confirmValue={getValues('sPassword')}
        >
          <article>
            <h5>
              <div>
                Are you sure want to reject it?
              </div>
            </h5>
            <CommonInput
              type='text'
              register={register}
              errors={errors}
              className={`form-control ${errors?.sPassword && 'error'}`}
              name='sPassword'
              placeholder='Enter password'
              onChange={(e) => {
                e.target.value =
                  e.target.value?.trim() &&
                  e.target.value.replace(/^[0-9]+$/g, '')
              }}
            />
            <CommonInput
              type='textarea'
              register={register}
              errors={errors}
              className={`form-control ${errors?.name && 'error'} mt-3`}
              name='sDescription'
              placeholder='Type rejection reason here...'
              onChange={(e) => e.target.value}
            />
          </article>
        </CustomModal>
        : modal?.open === true &&
        <CommonPasswordModal
          isTextArea={false}
          modal={modal?.open}
          setModal={setModal}
          bodyTitle={
            modal?.type === 'pan-submit-button' ?
              'Submit PAN Card Detail' : modal?.type === 'approve-button' ?
                'Approved Request' : 'KYC Submit'
          }
          message={
            modal?.type === 'pan-submit-button' ?
              'Are you sure want to submit Pan card ?' : modal?.type === 'approve-button' ?
                'Are you sure want to approve this document?' : 'Are you sure want to submit kyc document ?'
          }
          handleConfirm={modal?.type === 'approve-button' ? handleStatusOperation : handleConfirmAdd}
          confirmValue={getValues('sPassword')}
          register={register}
          errors={errors}
          name='sPassword'
        />
      }
    </>
  )
}

export default UserKYCDetail
