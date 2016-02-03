import React, { Component, PropTypes } from 'react'
import Block from './Block'

class ImageBlock extends Component {

  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    data: {},
  };

  render() {
    const { data } = this.props
    return (
      <Block
        { ...this.props }
        children={ <img src={ data.url } alt={ data.alt } /> }
        ref="block"
      />
    )
  }
}

export default ImageBlock

