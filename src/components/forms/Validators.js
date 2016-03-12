import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'

export function isFormValid(states) {
  return states.every((state) => state.status === STATUS.SUCCESS)
}

export function containsSpace(value) {
  return (/\s/).test(value)
}

export function containsInvalidUsernameCharacters(value) {
  return (!(/^[a-zA-Z0-9\-_]+$/).test(value))
}

// Client-side only validation
export function getUsernameStateFromClient({ currentStatus, value }) {
  if (!value && !value.length && currentStatus !== STATUS.INDETERMINATE) {
    return { status: STATUS.INDETERMINATE, suggestions: null, message: '' }
  } else if (containsSpace(value)) {
    return {
      status: STATUS.FAILURE,
      suggestions: null,
      message: 'must not contain a space.',
    }
  } else if (containsInvalidUsernameCharacters(value)) {
    return {
      status: STATUS.FAILURE,
      suggestions: null,
      message: 'must only contain letters, numbers, underscores & dashes.',
    }
  }
  return { status: STATUS.SUCCESS, message: '' }
}

// Validate and normalize the response from the API's validation
export function getUsernameStateFromServer({ availability, currentStatus }) {
  if (!availability && currentStatus !== STATUS.FAILURE) {
    return { status: STATUS.FAILURE, suggestions: null, message: 'is invalid.' }
  }
  const { username, suggestions } = availability
  if (username && currentStatus !== STATUS.SUCCESS) {
    return { status: STATUS.SUCCESS, suggestions: null, message: '' }
  } else if (!username && currentStatus !== STATUS.FAILURE) {
    const list = suggestions.username && suggestions.username.length ? suggestions.username : null
    return { status: STATUS.FAILURE, suggestions: list, message: 'already exists.' }
  }
  return null
}

export function isValidEmail(value) {
  return value.match(/(.+)@(.+)\.([a-z]{2,})/)
}

// Client-side only validation
export function getEmailStateFromClient({ currentStatus, value }) {
  if (!value && !value.length && currentStatus) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  return (
    isValidEmail(value) ?
      { status: STATUS.SUCCESS, message: '' } :
      { status: STATUS.FAILURE, message: 'appears to be invalid.' }
  )
}

// Validate and normalize the response from the API's validation
export function getEmailStateFromServer({ availability, currentStatus }) {
  if (!availability && currentStatus !== STATUS.FAILURE) {
    return { status: STATUS.FAILURE, message: 'is invalid.' }
  }
  const { email, suggestions } = availability
  const full = suggestions.email && suggestions.email.full && suggestions.email.full.length ?
    suggestions.email.full :
    null
  const message = full && full.length ? `- did you mean ${full}?` : ''
  if (email && currentStatus !== STATUS.SUCCESS) {
    return { status: STATUS.SUCCESS, message }
  } else if (!email && currentStatus !== STATUS.FAILURE) {
    return { status: STATUS.FAILURE, message }
  }
  return null
}

export function isValidPassword(value) {
  return (/^.{8,128}$/).test(value)
}

export function getPasswordState({ currentStatus, value }) {
  if (!value && !value.length && currentStatus) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  return (
    isValidPassword(value) ?
      { status: STATUS.SUCCESS, message: '' } :
      { status: STATUS.FAILURE, message: 'must be at least 8 characters.' }
  )
}

// TODO: This could probably validate each of the individual values
export function getBatchEmailState({ currentStatus, value }) {
  if (!value && !value.length && currentStatus) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  // return if the field only has commas and spaces
  if (value.replace(/(,|\s)/g, '').length === 0) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  const emails = value.split(/[,\s]+/)
  return (
    emails.length > 0 ?
      { status: STATUS.SUCCESS, message: '' } :
      { status: STATUS.FAILURE, message: 'appears to be invalid.' }
  )
}

