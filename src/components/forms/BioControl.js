import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class BioControl extends Component {
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
    id: 'user_unsanitized_short_bio',
    name: 'user[unsanitized_short_bio]',
    placeholder: 'Bio (optional)',
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
    this.props.controlWasChanged({ unsanitized_short_bio: val })
  }

  render() {
    const { classModifiers, id, name, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const len = text ? text.length : 0
    const label = len > 192 ? `Bio ${len}` : 'Bio'
    const groupClassNames = classNames(
      'FormControlGroup',
      classModifiers,
      { hasFocus: hasFocus },
      { hasValue: hasValue },
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
          onFocus={(e) => this.handleFocus(e)}
          onBlur={(e) => this.handleBlur(e)}
          onChange={(e) => this.handleChange(e)}
        />
      </div>
    )
  }
}

export default BioControl

