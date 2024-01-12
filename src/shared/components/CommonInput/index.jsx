import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { FormattedMessage } from 'react-intl'
import CommonSpinner from '../CommonSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

function CommonInput ({
  type,
  info,
  infoMsg,
  errors,
  className,
  onChange,
  label,
  name,
  register,
  disabled,
  value,
  required,
  onBlur,
  placeholder,
  defaultValue,
  validation,
  style,
  children,
  viewOnly,
  veiwValue,
  isLoading,
  customerror,
  onPaste
}) {
  const splitName = name?.split('.')

  const [show, setShow] = useState(false)
  const target = useRef(null)

  function applyValidation () {
    if (required) {
      return {
        required: validationErrors.required,
        maxLength: { value: 10000, message: validationErrors.maxLength(10000) },
        minLength: { value: 1, message: validationErrors.minLength(1) },
        onChange: () => { },
        ...validation
      }
    } else {
      return {
        maxLength: { value: 10000, message: validationErrors.maxLength(10000) },
        ...validation
      }
    }
  }

  const setRegister = register(name, applyValidation())

  const renderTooltip = (props) => {
    const tooltipMessage = infoMsg

    return (
      <Tooltip id="button-tooltip" {...props}>
        <span style={{ fontSize: '10px', display: 'block' }}>{tooltipMessage}</span>
      </Tooltip>
    )
  }

  return (
    <Form.Group className='form-group w-100'>
      {label && (
        <Form.Label>
          <span>
            {label && <FormattedMessage id={label} />}
            {label && required && <span className='inputStar'>*</span>}
          </span>
          {info &&
            <OverlayTrigger
              // placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <span ref={target} onClick={() => setShow(!show)} className='information'><FontAwesomeIcon icon={faCircleInfo} color='var(--primary-color)' size='lg' /></span>
            </OverlayTrigger>
          }
        </Form.Label>
      )}

      {(() => {
        if (viewOnly) {
          return <Form.Control as={type === 'text' ? 'input' : 'textarea'} className={className} disabled={disabled} value={veiwValue} />
        } else {
          return (
            <div className='common-view-input'>
              <Form.Control
                as={type === 'text' ? 'input' : 'textarea'}
                name={name}
                className={className}
                defaultValue={defaultValue}
                disabled={disabled}
                style={style}
                value={value}
                placeholder={placeholder}
                onPaste={
                  onPaste &&
                  ((e) => {
                    e.preventDefault()
                    return false
                  })
                }
                {...setRegister}
                onChange={(e) => {
                  setRegister.onChange(e)
                  onChange && onChange(e)
                }}
                onBlur={(e) => {
                  e.target.value = e?.target?.value?.trim()
                  onBlur && onBlur(e)
                  setRegister.onChange(e)
                }}
              />
              {isLoading && <CommonSpinner />}
            </div>
          )
        }
      })()}
      {splitName?.length > 1 && errors && errors?.[splitName?.[0]] && errors?.[splitName?.[0]]?.[splitName?.[1]] && (
        <Form.Control.Feedback type='invalid'>{errors?.[splitName?.[0]]?.[splitName?.[1]]?.message}</Form.Control.Feedback>
      )}
      {splitName?.length > 2 &&
        errors &&
        errors[splitName[0]] &&
        errors[splitName[0]][splitName[1]] &&
        errors[splitName[0]][splitName[1]][splitName[2]] && (
          <Form.Control.Feedback type='invalid'>{errors[splitName[0]][splitName[1]][splitName[2]].message}</Form.Control.Feedback>
        )}
      {errors && customerror
        ? errors && customerror && <Form.Control.Feedback type='invalid'>errorsmessage</Form.Control.Feedback>
        : errors && errors[name] && <Form.Control.Feedback type='invalid'>{errors[name].message}</Form.Control.Feedback>}
      {children}
    </Form.Group>
  )
}
CommonInput.propTypes = {
  type: PropTypes.string,
  viewOnly: PropTypes.bool,
  info: PropTypes.bool,
  name: PropTypes.string,
  veiwValue: PropTypes.any,
  placeholder: PropTypes.string,
  categoryURL: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  maxWord: PropTypes.number,
  register: PropTypes.func,
  children: PropTypes.node,
  onBlur: PropTypes.any,
  onChange: PropTypes.any,
  control: PropTypes.object,
  style: PropTypes.object,
  errors: PropTypes.object,
  className: PropTypes.any,
  availableSlug: PropTypes.string,
  altTextLabel: PropTypes.string,
  validation: PropTypes.object,
  infoMsg:PropTypes.any,
  customerror:PropTypes.any,
  isLoading:PropTypes.bool,
  value:PropTypes.any,
  onPaste:PropTypes.any
}
export default CommonInput
