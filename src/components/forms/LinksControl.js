import React, { Component } from 'react'
import FormControl from './FormControl'

/* eslint-disable react/prefer-stateless-function */
class LinksControl extends Component {

  static defaultProps = {
    className: 'LinksControl',
    id: 'external_links',
    label: 'Links',
    name: 'user[links]',
    placeholder: 'Links',
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        type="text"
      />
    )
  }
}

export default LinksControl

