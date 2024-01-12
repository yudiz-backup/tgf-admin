import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Col } from 'react-bootstrap';
import textLogo from 'assets/images/logo.svg'

function AuthLayout ({ children }) {
  return (
    <div className='auth-main'>
      <div className='child-box-second row'>
        <Col xl={6} lg={6} md={6} sm={12} className='side-logo'>
          <div className='logo-container'>
            <img src={textLogo} className="textLogo" alt='Poker Logo' />
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={12} className='login-form-container'>
          <Suspense
            fallback={
              <div>
                <FormattedMessage id='loading' />
                ...
              </div>
            }>
            {children}
          </Suspense>
        </Col>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthLayout
