/* eslint-disable react/display-name */
/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

/* eslint-disable react/react-in-jsx-scope */
export const validationErrors = {
  required: <FormattedMessage id='required' />,
  nameRequired: <FormattedMessage id='requiredName' />,
  promoCodeRequired: <FormattedMessage id='requiredPromoCode' />,
  cappedValueRequired: <FormattedMessage id='requiredCappedValue' />,
  bonusMaxAmountRequired: <FormattedMessage id='requiredBonusMaxAmount' />,
  emailRequired: <FormattedMessage id='requiredMail' />,
  firstNameRequired: <FormattedMessage id='requiredFirstName' />,
  fullNameRequired: <FormattedMessage id='requiredFullName' />,
  userPasswordRequired: <FormattedMessage id='requiredUserPassword' />,
  surNameRequired: <FormattedMessage id='requiredSurName' />,
  passwordRequired: <FormattedMessage id='requiredPassword' />,
  currentPasswordRequired: <FormattedMessage id='requiredCurrentPassword' />,
  newPasswordRequired: <FormattedMessage id='requiredNewPassword' />,
  confirmRequired: <FormattedMessage id='requiredConfirmPassword' />,
  userNameRequired: <FormattedMessage id='requiredUserName' />,
  mobileNoRequired: <FormattedMessage id='requiredMobileNo' />,
  email: <FormattedMessage id='validEmail' />,
  eGenderrequired: <FormattedMessage id='requiredGender' />,
  eStateRequired: <FormattedMessage id='requiredState' />,
  addressRequired: <FormattedMessage id='requiredAddress' />,
  passwordRegEx: <FormattedMessage id='passwordRegEx' />,
  url: <FormattedMessage id='validUrl' />,
  date: <FormattedMessage id='validDate' />,
  privacypolicy: <FormattedMessage id='privacypolicyrequred' />,
  minLength: (length) => `${useIntl().formatMessage({ id: 'enterGreater' })} ${length}.`,
  rangeLength: (min, max) =>
    `${useIntl().formatMessage({ id: 'rangeLength' })} ${min} ${useIntl().formatMessage({ id: 'and' })} ${max} ${useIntl().formatMessage({
      id: 'charLong'
    })}`,
  maxLength: (length) => `${useIntl().formatMessage({ id: 'enterLess' })} ${length}.`,
  passwordNotMatch: <FormattedMessage id='passwordNotMatch' />,
  commonRange: (min = 5, max = 1000) =>
    `${useIntl().formatMessage({
      id: 'rangeLength'
    })} ${min} ${useIntl().formatMessage({
      id: 'and'
    })} ${max} ${useIntl().formatMessage({
      id: 'charLong'
    })}`,
  underscoreAndDot: <FormattedMessage id='underscoreAndDot' />
}
