import React, { Component, PropTypes } from 'react'
import FormControl from './FormControl'
import classNames from 'classnames'

class BioControl extends Component {

  constructor(props, context) {
    super(props, context)
    const { text } = this.props
    this.state = { textLength: text ? text.length : 0 }
    this.handleChange = ::this.handleChange
  }

  handleChange(vo) {
    const { id, onChange } = this.props
    const { textLength } = this.state
    const len = vo[id] ? vo[id].length : 0
    if (textLength !== len) {
      this.setState({ textLength: len })
    }
    if (id && typeof onChange === 'function') {
      onChange(vo)
    }
  }

  isValidBioLength() {
    const { textLength } = this.state
    return textLength > 192
  }

  // For consistency we should probably move the checks up to Validators and
  // let the Container control the state. The component is more portable this
  // way but it's still weird. Exceeding isn't really an error either.
  render() {
    const { textLength } = this.state
    const hasExceeded = this.isValidBioLength()
    const label = hasExceeded ? `Bio ${textLength}` : `Bio`
    return (
      <FormControl
        { ...this.props }
        className={ classNames({ hasExceeded }) }
        autoCapitalize="off"
        autoCorrect="off"
        kind="textarea"
        label={ label }
        onChange={ this.handleChange }
        type="text"
      />
    )
  }
}

BioControl.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  text: PropTypes.string,
}

BioControl.defaultProps = {
  className: 'BioControl',
  id: 'unsanitized_short_bio',
  label: 'Bio',
  name: 'user[unsanitized_short_bio]',
  placeholder: 'Bio (optional)',
}

export default BioControl

