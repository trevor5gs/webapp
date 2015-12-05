import React, { PropTypes } from 'react'
import classNames from 'classnames'
import FormControl from '../forms/FormControl'

class NameControl extends FormControl {
  static propTypes = {
    controlWasChanged: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    inputType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    tabIndex: PropTypes.string.isRequired,
  }

  static defaultProps = {
    id: 'user_name',
    inputType: 'text',
    name: 'user[name]',
    placeholder: 'Name (optional)',
    tabIndex: 0,
  }

  handleChange(e) {
    this.props.controlWasChanged({ name: e.target.value })
    super.handleChange(e)
  }

  render() {
    const { id, name, inputType, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      { hasFocus: hasFocus },
      { hasValue: hasValue },
    )

    return (
      <div className={groupClassNames}>
        <label className="FormControlLabel" htmlFor={id}>Name</label>
        <input
          className="FormControl NameControl"
          id={id}
          name={name}
          value={text}
          type={inputType}
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

