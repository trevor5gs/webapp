import React, { Component } from 'react'
import FormControl from './FormControl'

class SearchControl extends Component {

  static defaultProps = {
    className: 'SearchControl',
    id: 'terms',
    label: 'Search',
    name: 'search[terms]',
    placeholder: 'Search',
  };

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        type="text"
      />
    )
  }
}

export default SearchControl

