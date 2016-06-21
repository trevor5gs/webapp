import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { RequestIcon, SuccessIcon, FailureIcon } from '../forms/FormIcons'

class FormControl extends Component {

  static propTypes = {
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
    renderStatus: PropTypes.func,
    renderFeedback: PropTypes.func,
    status: PropTypes.string,
    tabIndex: PropTypes.string.isRequired,
    text: PropTypes.string,
  }

  static defaultProps = {
    kind: 'input',
    renderFeedback: null,
    status: STATUS.INDETERMINATE,
    tabIndex: '0',
    text: '',
    type: 'text',
  }

  componentWillMount() {
    const { text } = this.props
    this.state = {
      hasFocus: false,
      hasValue: text && text.length,
      isInitialValue: true,
      text,
    }
    this.initialValue = text
  }

  componentDidMount() {
    this.timer = setTimeout(this.checkValue, 250)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  onFocusControl = (e) => {
    this.setState({ hasFocus: true })
    const { onFocus } = this.props
    if (typeof onFocus === 'function') {
      onFocus(e)
    }
  }

  onBlurControl = (e) => {
    this.setState({ hasFocus: false })
    const { onBlur } = this.props
    if (typeof onBlur === 'function') {
      onBlur(e)
    }
  }

  onChangeControl = (e) => {
    this.onChangeValue(e.target.value)
  }

  onChangeValue = (val) => {
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
        return <RequestIcon />
      case STATUS.FAILURE:
        return <FailureIcon />
      case STATUS.SUCCESS:
        return <SuccessIcon />
      case STATUS.INDETERMINATE:
      default:
        return null
    }
  }

  checkValue = () => {
    const inputControl = this.refs.input
    const { text } = this.state
    if (inputControl && inputControl.value !== text) {
      this.onChangeValue(inputControl.value)
    }
    this.timer = setTimeout(this.checkValue, 250)
  }

  clear() {
    this.setState({ text: '' })
  }

  renderLabel() {
    const { id, label } = this.props
    const labelClassNames = this.getLabelClassNames()
    return (
      <label className={labelClassNames} htmlFor={id}>
        {label}
      </label>
    )
  }

  renderTextArea(text, inputClassNames) {
    return (
      <textarea
        { ...this.props }
        className={inputClassNames}
        onFocus={this.onFocusControl}
        onBlur={this.onBlurControl}
        onChange={this.onChangeControl}
        ref="input"
        defaultValue={text}
      />
    )
  }

  renderInput(text, inputClassNames) {
    return (
      <input
        { ...this.props }
        className={inputClassNames}
        onFocus={this.onFocusControl}
        onBlur={this.onBlurControl}
        onChange={this.onChangeControl}
        ref="input"
        defaultValue={text}
      />
    )
  }

  render() {
    const { kind, label, renderFeedback, renderStatus } = this.props
    const { text } = this.state
    const groupClassNames = this.getGroupClassNames()
    const inputClassNames = this.getInputClassNames()
    const statusClassNames = this.getStatusClassNames()
    return (
      <div className={groupClassNames}>
        {label && this.renderLabel()}
        {
          kind === 'textarea' ?
            this.renderTextArea(text, inputClassNames) :
            this.renderInput(text, inputClassNames)
        }
        <span className={statusClassNames}>
          {this.getStatusIcon()}
        </span>
        {renderStatus ? renderStatus() : null}
        {renderFeedback ? renderFeedback() : null}
      </div>
    )
  }
}

export default FormControl
