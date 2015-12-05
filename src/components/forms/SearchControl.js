import React, { PropTypes } from 'react'
import classNames from 'classnames'
import FormControl from '../forms/FormControl'

class SearchControl extends FormControl {
  static propTypes = {
    controlWasChanged: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    inputType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    tabIndex: PropTypes.string.isRequired,
  }

  static defaultProps = {
    id: 'search_field',
    inputType: 'text',
    name: 'terms',
    placeholder: 'Search',
    tabIndex: '0',
  }

  handleChange(e) {
    this.props.controlWasChanged({ terms: e.target.value })
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
        <label className="FormControlLabel" htmlFor={id}>Search</label>
        <input
          className="FormControl SearchControl"
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

export default SearchControl

