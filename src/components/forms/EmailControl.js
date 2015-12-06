import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { RequestIcon, SuccessIcon, FailureIcon } from '../forms/FormIcons'

class EmailControl extends Component {
  static propTypes = {
    controlWasChanged: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    status: PropTypes.string,
    suggestions: PropTypes.string,
    tabIndex: PropTypes.string.isRequired,
    text: PropTypes.string,
  }

  static defaultProps = {
    id: 'user_email',
    name: 'user[email]',
    placeholder: 'Email',
    status: STATUS.INDETERMINATE,
    suggestions: null,
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
    this.props.controlWasChanged({ email: e.target.value })
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
    const { id, name, tabIndex, placeholder, suggestions } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      this.mapStatusToClass(),
      { hasFocus: hasFocus },
      { hasValue: hasValue },
      { hasSuggestions: suggestions && suggestions.length },
    )

    return (
      <div className={groupClassNames}>
        <label className="FormControlLabel" htmlFor={id}>Email</label>
        <input
          className="FormControl EmailControl"
          id={id}
          name={name}
          value={text}
          type="email"
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

export default EmailControl

