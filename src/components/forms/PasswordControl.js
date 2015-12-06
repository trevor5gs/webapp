import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { SuccessIcon, FailureIcon } from '../forms/FormIcons'

class PasswordControl extends Component {
  static propTypes = {
    controlWasChanged: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    showSuggestion: PropTypes.bool,
    status: PropTypes.string,
    tabIndex: PropTypes.string.isRequired,
    text: PropTypes.string,
  }

  static defaultProps = {
    id: 'user_password',
    name: 'user[password]',
    placeholder: 'Password',
    showSuggestion: true,
    status: STATUS.INDETERMINATE,
    tabIndex: 0,
  }

  constructor(props, context) {
    super(props, context)
    const { text } = this.props
    this.state = {
      text: text,
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
    this.props.controlWasChanged({ password: e.target.value })
  }

  mapStatusToClass() {
    const { status } = this.props
    switch (status) {
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
        <span>Password must contain at least 8 characters.</span>
      </p>
    )
  }

  renderSuggestions() {
    return (
      <p className="FormControlFeedback FormControlFeedbackSuggestions">
        <span>At least 8 characters.</span>
      </p>
    )
  }

  renderStatus() {
    const { status } = this.props
    let icon = null
    if (status === STATUS.FAILURE) {
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
    const { id, name, tabIndex, placeholder, showSuggestion } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      this.mapStatusToClass(),
      { hasFocus: hasFocus },
      { hasValue: hasValue },
      { hasSuggestions: showSuggestion },
    )

    return (
      <div className={groupClassNames}>
        <label className="FormControlLabel" htmlFor={id}>Password</label>
        <input
          className="FormControl PasswordControl"
          id={id}
          name={name}
          value={text}
          type="password"
          tabIndex={tabIndex}
          placeholder={placeholder}
          autoCapitalize="off"
          autoCorrect="off"
          onFocus={(e) => this.handleFocus(e)}
          onBlur={(e) => this.handleBlur(e)}
          onChange={(e) => this.handleChange(e)} />
        { this.renderError() }
        { this.renderSuggestions() }
        { this.renderStatus() }
      </div>
    )
  }
}

export default PasswordControl

