import React, { Component } from 'react'
import FormControl from './FormControl'

/* eslint-disable react/prefer-stateless-function */
class NameControl extends Component {

  static defaultProps = {
    className: 'NameControl',
    id: 'name',
    label: 'Name',
    name: 'user[name]',
    placeholder: 'Name',
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        maxLength="50"
        type="text"
      />
    )
  }
}

export default NameControl

