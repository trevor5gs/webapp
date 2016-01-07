import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class SearchControl extends Component {

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
    this.props.controlWasChanged({ terms: val })
  }

  render() {
    const { id, name, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      { hasFocus },
      { hasValue },
    )

    return (
      <div className={groupClassNames}>
        <label className="FormControlLabel" htmlFor={id}>Search</label>
        <input
          className="FormControl SearchControl"
          id={id}
          name={name}
          value={text}
          type="text"
          tabIndex={tabIndex}
          placeholder={placeholder}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          onBlur={::this.handleBlur}
          onChange={::this.handleChange}
          onFocus={::this.handleFocus}
        />
      </div>
    )
  }
}

SearchControl.propTypes = {
  controlWasChanged: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  tabIndex: PropTypes.string.isRequired,
  text: PropTypes.string,
}

SearchControl.defaultProps = {
  id: 'search_field',
  name: 'terms',
  placeholder: 'Search',
  tabIndex: '0',
  text: '',
}

export default SearchControl

