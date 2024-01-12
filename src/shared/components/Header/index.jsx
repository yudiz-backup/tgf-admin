import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { logout } from 'query/auth/auth.query'
import { route } from 'shared/constants/AllRoutes'
import { toaster } from 'helper/helper'
import CustomModal from 'shared/components/Modal'
import textLogo from 'assets/images/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


function Header() {
  const navigate = useNavigate()
  const query = useQueryClient()
  const [clickedLogOut, setClickedLogOut] = useState(false)
  const [show, setShow] = useState(false)
  const [profileName] = useState('')
  const handleClose = () => setShow(false)

  const temp = localStorage.getItem('mode') === 'true'

  const [mode, setMode] = useState(temp)

  const { isLoading, isFetching } = useQuery('logoutUser', () => logout(), {
    enabled: clickedLogOut,
    onSuccess: (res) => {
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      navigate('/login')
      toaster(res?.data?.message)
    },
    onError: () => {
      localStorage.removeItem('token')
      navigate('/login')
    }
  })

  // useQuery('profile', () => profile(), {
  //   select: (data) => data?.data?.data,
  //   onSuccess: (res) => {
  //     setProfileName(res.sUserName)
  //   },
  //   onError: () => {
  //     setProfileName('')
  //   }
  // })

  const handleLogout = () => setShow(!show)

  const handleConfirmLogout = () => {
    setClickedLogOut(true)
    query.invalidateQueries('logoutUser')
  }

  // function handleEditProfile() {
  //   navigate(route.editProfile)
  // }

  function handleChangePass() {
    navigate(route.changePassword)
  }

  useEffect(() => {
    localStorage.setItem('mode', mode)

    document.body.classList.remove(mode ? 'light' : 'dark')
    document.body.classList.add(!mode ? 'light' : 'dark');
  }, [mode])

  return (
    <header className='header'>
      <div className='header-left'>
        <Link className='logo' to={route.playstore_page}>
          {/* <img src={logo} className="logoIcon" alt='run to learn' /> */}
          <img src={textLogo} className="textLogo" alt='Poker Logo' />
          {/* <div className='logo-text'>Rummy One</div> */}
        </Link>
      </div>
      <div className='header-right'>
        <div className='user-name'>{profileName}</div>
        <Dropdown>
          <Dropdown.Toggle className='header-btn'>
            <div className='img d-flex align-items-center justify-content-center'>
              <FontAwesomeIcon icon={faUser} />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className='up-arrow'>
            {/* <Dropdown.Item onClick={handleEditProfile}>
              <i className='icon-account'></i>
              <FormattedMessage id='myProfile' />
            </Dropdown.Item> */}
            <Dropdown.Item onClick={handleChangePass}>
              <i className='icon-lock'></i>
              <FormattedMessage id='changePassword' />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleLogout()}>
              <i className='icon-logout'></i>
              <FormattedMessage id='logout' />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {/* <Button className='header-btn user-btn' >
          {mode ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
        </Button> */}
        <label id="label" className="switch toggle">
          <input type="checkbox" id="toggleMode" onClick={() => setMode(!mode)} />
          <span className="slider round"></span>
        </label>
      </div>
      <CustomModal
        open={show}
        handleClose={handleClose}
        handleConfirm={handleConfirmLogout}
        disableHeader
        bodyTitle='Are you sure you want to logout ?'
        isLoading={isLoading || isFetching}
      />
    </header>
  )
}

export default Header
