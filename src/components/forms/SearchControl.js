import React, { Component } from 'react'
import FormControl from './FormControl'

class SearchControl extends Component {
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

SearchControl.defaultProps = {
  className: 'SearchControl',
  id: 'terms',
  label: 'Search',
  name: 'search[terms]',
  placeholder: 'Search',
}

export default SearchControl

