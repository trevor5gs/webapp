import React, { Component } from 'react'
import FormControl from './FormControl'

class NameControl extends Component {

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        maxLength="50"
        type="text"
      />
    )
  }
}

NameControl.defaultProps = {
  className: 'NameControl',
  id: 'name',
  label: 'Name',
  name: 'user[name]',
  placeholder: 'Name (optional)',
}

export default NameControl

