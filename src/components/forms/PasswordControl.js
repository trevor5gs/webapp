import React from 'react'
import classNames from 'classnames'
import { SuccessIcon, FailureIcon } from './FormIcons'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'

class PasswordControl extends React.Component {

  static propTypes = {
    controlWasChanged: React.PropTypes.func.isRequired,
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired,
    tabIndex: React.PropTypes.string.isRequired,
    text: React.PropTypes.string,
    status: React.PropTypes.string,
    showSuggestion: React.PropTypes.any,
  }

  static defaultProps = {
    id: 'user_password',
    name: 'user[password]',
    placeholder: 'Password',
    tabIndex: 0,
    status: STATUS.INDETERMINATE,
    showSuggestion: true,
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
      <p className="FormFeedback FormFeedbackError">
        <span>Password must contain at least 8 characters.</span>
      </p>
    )
  }

  renderSuggestions() {
    return (
      <p className="FormFeedback FormFeedbackSuggestions">
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
      <div className="FormStatus">
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

