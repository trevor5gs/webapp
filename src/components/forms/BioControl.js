import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { RequestIcon } from '../forms/FormIcons'

class BioControl extends Component {

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
    this.props.controlWasChanged({ unsanitized_short_bio: val })
  }

  mapStatusToClass() {
    const { status } = this.props
    switch (status) {
      case STATUS.REQUEST:
        return 'isValidating'
      case STATUS.INDETERMINATE:
      default:
        return 'isIndeterminate'
    }
  }

  renderStatus() {
    const { status } = this.props
    let icon = null
    if (status === STATUS.REQUEST) {
      icon = <RequestIcon/>
    }
    return (
      <div className="FormControlStatus">
        {icon}
      </div>
    )
  }

  render() {
    const { classModifiers, id, name, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const len = text ? text.length : 0
    const label = len > 192 ? `Bio ${len}` : 'Bio'
    const groupClassNames = classNames(
      'FormControlGroup',
      classModifiers,
      this.mapStatusToClass(),
      { hasFocus },
      { hasValue },
      { hasExceeded: len > 192 },
    )
    const labelClassNames = classNames(
      'FormControlLabel',
      classModifiers,
    )
    const controlClassNames = classNames(
      'FormControl',
      'BioControl',
      classModifiers,
    )

    return (
      <div className={groupClassNames}>
        <label className={labelClassNames} htmlFor={id}>{label}</label>
        <textarea
          className={controlClassNames}
          id={id}
          name={name}
          value={text}
          type="text"
          tabIndex={tabIndex}
          placeholder={placeholder}
          autoCapitalize="off"
          autoCorrect="off"
          onBlur={::this.handleBlur}
          onChange={::this.handleChange}
          onFocus={::this.handleFocus}
        />
        { this.renderStatus() }
      </div>
    )
  }
}

BioControl.propTypes = {
  classModifiers: PropTypes.string,
  controlWasChanged: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  status: PropTypes.string,
  tabIndex: PropTypes.string.isRequired,
  text: PropTypes.string,
}

BioControl.defaultProps = {
  classModifiers: '',
  id: 'user_unsanitized_short_bio',
  name: 'user[unsanitized_short_bio]',
  placeholder: 'Bio (optional)',
  status: STATUS.INDETERMINATE,
  tabIndex: '0',
  text: '',
}

export default BioControl

