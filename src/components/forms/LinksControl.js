import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class LinksControl extends Component {

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
    this.props.controlWasChanged({ external_links: val })
  }

  render() {
    const { classModifiers, id, name, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      classModifiers,
      { hasFocus },
      { hasValue },
    )
    const labelClassNames = classNames(
      'FormControlLabel',
      classModifiers,
    )
    const controlClassNames = classNames(
      'FormControl',
      'LinksControl',
      classModifiers,
    )

    return (
      <div className={groupClassNames}>
        <label className={labelClassNames} htmlFor={id}>Links</label>
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
          onBlur={::this.handleBlur}
          onChange={::this.handleChange}
          onFocus={::this.handleFocus}
        />
      </div>
    )
  }
}

LinksControl.propTypes = {
  classModifiers: PropTypes.string,
  controlWasChanged: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  tabIndex: PropTypes.string.isRequired,
  text: PropTypes.string,
}

LinksControl.defaultProps = {
  classModifiers: '',
  id: 'user_links',
  name: 'user[links]',
  placeholder: 'Links (optional)',
  tabIndex: '0',
  text: '',
}

export default LinksControl

