import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { RequestIcon, SuccessIcon, FailureIcon } from '../forms/FormIcons'

class UsernameControl extends Component {

  constructor(props, context) {
    super(props, context)
    const { text } = this.props
    this.state = {
      text,
      hasValue: text && text.length,
      hasFocus: false,
    }
  }

  handleFocus() {
    this.setState({ hasFocus: true })
  }

  handleBlur() {
    this.setState({ hasFocus: false })
  }

  handleChange(e) {
    const val = e.target.value
    this.setState({ text: val, hasValue: val.length })
    this.props.controlWasChanged({ username: val })
  }

  handleUsernameSuggestionClick(e) {
    const val = e.target.title
    this.setState({ text: val, hasValue: val.length })
    this.props.controlWasChanged({ username: val })
  }

  mapStatusToClass() {
    const { status } = this.props
    switch (status) {
      case STATUS.REQUEST:
        return 'isValidating'
      case STATUS.FAILURE:
        return 'isFailing'
      case STATUS.SUCCESS:
        return 'isSucceeding'
      case STATUS.INDETERMINATE:
      default:
        return 'isIndeterminate'
    }
  }

  renderInvalidCharacterError() {
    return (
      <span>
        Username contains invalid characters. Letters, numbers, underscores &
        dashes only. No spaces.
      </span>
    )
  }

  renderAlreadyExistsError() {
    return (
      <span>
        Username already exists. Please try a new one. You can change your
        username at any time.
      </span>
    )
  }

  renderError() {
    const { failureType } = this.props
    let message = null
    if (failureType === 'client') {
      message = this.renderInvalidCharacterError()
    } else if (failureType === 'server') {
      message = this.renderAlreadyExistsError()
    }
    return (
      <p className="FormControlFeedback FormControlFeedbackError">
        {message}
      </p>
    )
  }

  renderAdvice() {
    return (
      <p className="FormControlFeedback FormControlFeedbackSuggestions">
        <span>
          You can change your username at any time. Letters, numbers,
          dashes & underscores only. No spaces.
        </span>
      </p>
    )
  }

  renderSuggestionList() {
    const { suggestions } = this.props
    if (suggestions && suggestions.length) {
      return (
        <div className="FormControlSuggestionList">
          <p>Here are some available usernames &mdash;</p>
          {suggestions.map((suggestion, i) => {
            return (
              <button
                title={suggestion}
                onClick={::this.handleUsernameSuggestionClick}
                key={'suggestion_' + i}
              >
                {suggestion}
              </button>
            )
          })}
        </div>
      )
    }
    return (
      <p className="FormControlSuggestionList">
        <span></span>
      </p>
    )
  }

  renderStatus() {
    const { status } = this.props
    let icon = null
    if (status === STATUS.REQUEST) {
      icon = <RequestIcon/>
    } else if (status === STATUS.FAILURE) {
      icon = <FailureIcon/>
    } else if (status === STATUS.SUCCESS) {
      icon = <SuccessIcon/>
    }
    return (
      <div className="FormControlStatus">
        {icon}
      </div>
    )
  }

  render() {
    const { classModifiers, id, name, tabIndex, placeholder, suggestions, showAdvice } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      classModifiers,
      this.mapStatusToClass(),
      { hasFocus },
      { hasValue },
      { showAdvice },
      { showSuggestionList: suggestions && suggestions.length },
    )
    const labelClassNames = classNames(
      'FormControlLabel',
      classModifiers,
    )
    const controlClassNames = classNames(
      'FormControl',
      'UsernameControl',
      classModifiers,
    )

    return (
      <div className={groupClassNames}>
        <label className={labelClassNames} htmlFor={id}>Username</label>
        <input
          className={controlClassNames}
          id={id}
          name={name}
          value={text}
          type="text"
          tabIndex={tabIndex}
          placeholder={placeholder}
          maxLength="50"
          autoCapitalize="off"
          autoCorrect="off"
          onBlur={::this.handleBlur}
          onChange={::this.handleChange}
          onFocus={::this.handleFocus}
        />
        { this.renderError() }
        { this.renderAdvice() }
        { this.renderSuggestionList() }
        { this.renderStatus() }
      </div>
    )
  }
}

UsernameControl.propTypes = {
  classModifiers: PropTypes.string,
  controlWasChanged: PropTypes.func.isRequired,
  failureType: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  status: PropTypes.string,
  showAdvice: PropTypes.bool,
  suggestions: PropTypes.array,
  tabIndex: PropTypes.string.isRequired,
  text: PropTypes.string,
}

UsernameControl.defaultProps = {
  classModifiers: '',
  failureType: null,
  id: 'user_username',
  name: 'user[username]',
  placeholder: 'Enter your username',
  showAdvice: true,
  status: STATUS.INDETERMINATE,
  suggestions: null,
  tabIndex: 0,
}

export default UsernameControl

