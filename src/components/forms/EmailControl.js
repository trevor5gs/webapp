import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { RequestIcon, SuccessIcon, FailureIcon } from '../forms/FormIcons'

class EmailControl extends Component {

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
    if (typeof this.props.controlWasChanged === 'function') {
      this.props.controlWasChanged({ email: e.target.value })
    }
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

  // Todo: Eventually this and renderSuggestions should return null or empty
  // components. This would have to happen after all animations though.
  renderError() {
    return (
      <p className="FormControlFeedback FormControlFeedbackError">
        <span>That email is invalid.<br/>Please try again.</span>
      </p>
    )
  }

  renderSuggestions() {
    const { suggestions } = this.props
    return (
      <p className="FormControlFeedback FormControlFeedbackSuggestions">
        <span>Did you mean<br/>{suggestions}?</span>
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
    const { classModifiers, id, name, tabIndex, placeholder, suggestions } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      classModifiers,
      this.mapStatusToClass(),
      { hasFocus },
      { hasValue },
      { hasSuggestions: suggestions && suggestions.length },
    )
    const labelClassNames = classNames(
      'FormControlLabel',
      classModifiers,
    )
    const controlClassNames = classNames(
      'FormControl',
      'EmailControl',
      classModifiers,
    )

    return (
      <div className={groupClassNames}>
        <label className={labelClassNames} htmlFor={id}>Email</label>
        <input
          className={controlClassNames}
          id={id}
          name={name}
          value={text}
          type="email"
          tabIndex={tabIndex}
          placeholder={placeholder}
          ref="input"
          autoCapitalize="off"
          autoCorrect="off"
          onBlur={::this.handleBlur}
          onChange={::this.handleChange}
          onFocus={::this.handleFocus}
        />
        { this.renderError() }
        { this.renderSuggestions() }
        { this.renderStatus() }
      </div>
    )
  }
}

EmailControl.propTypes = {
  classModifiers: PropTypes.string,
  controlWasChanged: PropTypes.func,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  status: PropTypes.string,
  suggestions: PropTypes.string,
  tabIndex: PropTypes.string.isRequired,
  text: PropTypes.string,
}

EmailControl.defaultProps = {
  classModifiers: '',
  id: 'user_email',
  name: 'user[email]',
  placeholder: 'Enter your email',
  status: STATUS.INDETERMINATE,
  suggestions: null,
  tabIndex: '0',
}

export default EmailControl

