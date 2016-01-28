import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { RequestIcon, SuccessIcon, FailureIcon } from '../forms/FormIcons'

class FormControl extends Component {

  componentWillMount() {
    const { text } = this.props
    this.state = {
      hasFocus: false,
      hasValue: text && text.length,
      isInitialValue: true,
      text,
    }
    this.initialValue = text
    this.handleBlur = ::this.handleBlur
    this.handleChange = ::this.handleChange
    this.handleFocus = ::this.handleFocus
  }

  getStatusAsClassName() {
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

  getGroupClassNames() {
    const { classList, className } = this.props
    const { hasFocus, hasValue, isInitialValue } = this.state
    const statusClassName = this.getStatusAsClassName()
    return classNames(
      'FormControl',
      classList,
      className,
      statusClassName,
      { hasFocus },
      { hasValue },
      { isInitialValue },
    )
  }

  getLabelClassNames() {
    const { classList } = this.props
    return classNames('FormControlLabel', classList)
  }

  getInputClassNames() {
    const { classList } = this.props
    return classNames('FormControlInput', classList)
  }

  getStatusClassNames() {
    const { classList } = this.props
    return classNames('FormControlStatus', classList)
  }

  getStatusIcon() {
    const { status } = this.props
    switch (status) {
      case STATUS.REQUEST:
        return <RequestIcon/>
      case STATUS.FAILURE:
        return <FailureIcon/>
      case STATUS.SUCCESS:
        return <SuccessIcon/>
      case STATUS.INDETERMINATE:
      default:
        return null
    }
  }

  handleFocus(e) {
    this.setState({ hasFocus: true })
    const { onFocus } = this.props
    if (typeof onFocus === 'function') {
      onFocus(e)
    }
  }

  handleBlur(e) {
    this.setState({ hasFocus: false })
    const { onBlur } = this.props
    if (typeof onBlur === 'function') {
      onBlur(e)
    }
  }

  handleChange(e) {
    const val = e.target.value
    const { id, onChange } = this.props
    this.setState({
      text: val,
      hasValue: val.length,
      isInitialValue: val === this.initialValue,
    })
    if (id && typeof onChange === 'function') {
      onChange({ [id]: val })
    }
  }

  renderTextArea(text, inputClassNames) {
    return (
      <textarea
        { ...this.props }
        className={ inputClassNames }
        onFocus={ this.handleFocus }
        onBlur={ this.handleBlur }
        onChange={ this.handleChange }
        ref="input"
        value={ text }
      />
    )
  }

  renderInput(text, inputClassNames) {
    return (
      <input
        { ...this.props }
        className={ inputClassNames }
        onFocus={ this.handleFocus }
        onBlur={ this.handleBlur }
        onChange={ this.handleChange }
        ref="input"
        value={ text }
      />
    )
  }

  render() {
    const { id, kind, label, renderFeedback } = this.props
    const { text } = this.state
    const groupClassNames = this.getGroupClassNames()
    const labelClassNames = this.getLabelClassNames()
    const inputClassNames = this.getInputClassNames()
    const statusClassNames = this.getStatusClassNames()
    return (
      <div className={ groupClassNames }>
        <label className={ labelClassNames } htmlFor={ id }>
          { label }
        </label>
        {
          kind === 'textarea' ?
            this.renderTextArea(text, inputClassNames) :
            this.renderInput(text, inputClassNames)
        }
        <span className={ statusClassNames }>
          { this.getStatusIcon() }
        </span>
        { renderFeedback ? renderFeedback() : null }
      </div>
    )
  }
}

FormControl.propTypes = {
  classList: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  kind: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  renderFeedback: PropTypes.func,
  status: PropTypes.string,
  tabIndex: PropTypes.string.isRequired,
  text: PropTypes.string,
}

FormControl.defaultProps = {
  kind: 'input',
  renderFeedback: null,
  status: STATUS.INDETERMINATE,
  tabIndex: '0',
  text: '',
  type: 'text',
}

export default FormControl

