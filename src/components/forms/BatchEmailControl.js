import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'

class BatchEmailControl extends Component {

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
    this.props.controlWasChanged({ emails: val })
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
        <span>There was an error submitting that form. Please contact support.</span>
      </p>
    )
  }

  render() {
    const { classModifiers, id, name, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      classModifiers,
      this.mapStatusToClass(),
      { hasFocus },
      { hasValue },
    )
    const labelClassNames = classNames(
      'FormControlLabel',
      classModifiers,
    )
    const controlClassNames = classNames(
      'FormControl',
      'BatchEmailControl',
      classModifiers,
    )

    return (
      <div className={groupClassNames}>
        <label className={labelClassNames} htmlFor={id}>Emails</label>
        <input
          className={controlClassNames}
          id={id}
          name={name}
          value={text}
          type="text"
          tabIndex={tabIndex}
          placeholder={placeholder}
          autoCapitalize="off"
          autoCorrect="off"
          ref="input"
          onBlur={::this.handleBlur}
          onChange={::this.handleChange}
          onFocus={::this.handleFocus}
        />
        { this.renderError() }
      </div>
    )
  }
}

BatchEmailControl.propTypes = {
  classModifiers: PropTypes.string,
  controlWasChanged: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  status: PropTypes.string,
  tabIndex: PropTypes.string.isRequired,
  text: PropTypes.string,
}

BatchEmailControl.defaultProps = {
  classModifiers: '',
  id: 'invitations_email',
  name: 'invitations[email]',
  placeholder: 'Enter email addresses',
  status: STATUS.INDETERMINATE,
  tabIndex: '0',
  text: '',
}

export default BatchEmailControl

