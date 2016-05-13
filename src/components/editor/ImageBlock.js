import React, { Component, PropTypes } from 'react'
import Block from './Block'

class ImageBlock extends Component {

  static propTypes = {
    blob: PropTypes.string,
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  onLoadImage = () => {
    const { data } = this.props
    URL.revokeObjectURL(data.src)
  }

  render() {
    const { blob, data } = this.props
    return (
      <Block
        { ...this.props }
        children={<img onLoad={this.onLoadImage} src={blob || data.url} alt={data.alt} />}
        ref="block"
      />
    )
  }
}

export default ImageBlock

