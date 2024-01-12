import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import EditProfileComponent from 'shared/components/Profile'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { profile, UpdateProfile } from 'query/profile/profile.query'
import { toaster } from 'helper/helper'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'shared/components/Loader'
import Wrapper from 'shared/components/Wrap'
import { route } from 'shared/constants/AllRoutes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'

function EditProfile () {
  const navigate = useNavigate()
  const query = useQueryClient()
  const [updateFlag, setUpdateFlag] = useState(false)
  const [profileData, setProfileData] = useState({})

  const {
    register,
    control,
    formState: { errors },
    clearErrors,
    trigger,
    getValues,
    reset,
    handleSubmit,
    setValue,
  } = useForm({
    mode: 'all',
    defaultValues: {
      sProfilePicture: '',
      sPanPicture: '',
      aSocialProfiles: [{ eSocialNetworkType: '', sDisplayName: '', sLink: '' }]
    }
  })

  const { isLoading: getLoading, isFetching } = useQuery('getProfile', profile, {
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      setProfileData(data)
      reset({
        sUserName: data?.sUserName,
        sFullName: data?.sFullName,
        sEmail: data?.sEmail,
        sMobile: data?.sMobile,
        eGender: data?.eGender
      })
    },
    onError: () => {
      setProfileData({})
    }
  })

  const { mutate, isLoading } = useMutation(UpdateProfile, {
    onSuccess: (response) => {
      toaster(response?.data?.message || 'Profile updated successfully')
      query.invalidateQueries({ queryKey: ['profile'] })
      navigate('/dashboard')
    }
  })

  function handleChange (e) {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const onsubmit = (data) => {
    mutate({
      sUserName: data.sUserName,
      sEmail: data.sEmail,
      sMobile: data.sMobile,
    })
  }

  function usernameUpdate () {
  }
  function mobileNumberUpdate () {
  }
  useEffect(() => {
    document.title = 'My Profile'
  }, [])
  return (
    <>
      {getLoading || isFetching ? (
        <Loader />
      ) : (
        <Row className='justify-content-center'>
          <Col xxl={8} >
            <Wrapper>
              {!updateFlag ?
                (<button className='Profile-main-edit' onClick={() => setUpdateFlag(!updateFlag)}><FontAwesomeIcon icon={faPenToSquare} /></button>)
                : (<button className='Profile-main-cancel' onClick={() => setUpdateFlag(!updateFlag)}><FontAwesomeIcon icon={faXmark} /></button>)
              }
              <div className='edit-profile'>
                <div className='profile_icon'><FontAwesomeIcon icon={faUser} /></div>
                <p>Profile Details</p>
                <Form onSubmit={handleSubmit(onsubmit)} autoComplete='off'>
                  <EditProfileComponent
                    register={register}
                    control={control}
                    errors={errors}
                    clearErrors={clearErrors}
                    trigger={trigger}
                    values={getValues()}
                    profileData={profileData}
                    handleChange={(e) => handleChange(e)}
                    setValue={setValue}
                    updateFlag={updateFlag}
                    usernameUpdate={usernameUpdate}
                    mobileNumberUpdate={mobileNumberUpdate}
                  />
                  {updateFlag !== false &&
                  <>
                    <Button variant='secondary' className='me-2' disabled={isLoading} onClick={() => navigate(route.dashboard)}>
                      Cancel
                    </Button>
                    <Button variant='primary' type='submit' disabled={!updateFlag || isLoading}>
                      <FormattedMessage id='update' />
                      {isLoading && <Spinner animation='border' size='sm' />}
                    </Button>
                  </>
                  }
                </Form>
              </div>
            </Wrapper>
          </Col>
        </Row>
      )
      }
    </>
  )
}

export default EditProfile
