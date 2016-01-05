import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class NameControl extends Component {
  static propTypes = {
    classModifiers: PropTypes.string,
    controlWasChanged: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    tabIndex: PropTypes.string.isRequired,
    text: PropTypes.string,
  }

  static defaultProps = {
    classModifiers: '',
    id: 'user_name',
    name: 'user[name]',
    placeholder: 'Name (optional)',
    tabIndex: '0',
    text: '',
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
    this.props.controlWasChanged({ name: val })
  }

  render() {
    const { classModifiers, id, name, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      classModifiers,
      { hasFocus: hasFocus },
      { hasValue: hasValue },
    )
    const labelClassNames = classNames(
      'FormControlLabel',
      classModifiers,
    )
    const controlClassNames = classNames(
      'FormControl',
      'NameControl',
      classModifiers,
    )

    return (
      <div className={groupClassNames}>
        <label className={labelClassNames} htmlFor={id}>Name</label>
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
          onFocus={(e) => this.handleFocus(e)}
          onBlur={(e) => this.handleBlur(e)}
          onChange={(e) => this.handleChange(e)} />
      </div>
    )
  }
}

export default NameControl

