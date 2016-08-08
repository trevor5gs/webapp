import React, { Component } from 'react'
import FormControl from './FormControl'

/* eslint-disable react/prefer-stateless-function */
class SearchControl extends Component {

  static defaultProps = {
    className: 'SearchControl',
    id: 'terms',
    label: 'Search',
    name: 'search[terms]',
    placeholder: 'Search',
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        autoFocus
        type="text"
      />
    )
  }
}

export default SearchControl

