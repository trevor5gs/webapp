import React from 'react'
import classNames from 'classnames'
import FormControl from './FormControl'

class BioControl extends FormControl {

  handleChange(e) {
    this.props.controlWasChanged({ unsanitized_short_bio: e.target.value })
    super.handleChange(e)
  }

  render() {
    const { id, name, inputType, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const len = text ? text.length : 0
    const label = len > 192 ? `Bio ${len}` : 'Bio'
    const groupClassNames = classNames(
      'FormControlGroup',
      { hasFocus: hasFocus },
      { hasValue: hasValue },
      { hasExceeded: len > 192 },
    )

    return (
      <div className={groupClassNames}>
        <label className="FormControlLabel" htmlFor={id}>{label}</label>
        <textarea
          className="FormControl BioControl"
          id={id}
          name={name}
          value={text}
          type={inputType}
          tabIndex={tabIndex}
          placeholder={placeholder}
          autoCapitalize="off"
          autoCorrect="off"
          onFocus={(e) => this.handleFocus(e)}
          onBlur={(e) => this.handleBlur(e)}
          onChange={(e) => this.handleChange(e)} />
      </div>
    )
  }
}

BioControl.defaultProps = {
  placeholder: 'Bio (optional)',
  id: 'user_unsanitized_short_bio',
  name: 'user[unsanitized_short_bio]',
  inputType: 'text',
  tabIndex: 0,
}

BioControl.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  inputType: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  controlWasChanged: React.PropTypes.func.isRequired,
}

export default BioControl

