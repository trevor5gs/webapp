import React, { Component, PropTypes } from 'react'
import Block from './Block'

class EmbedBlock extends Component {

  static propTypes = {
    data: PropTypes.shape({
      url: PropTypes.string,
      service: PropTypes.string,
      id: PropTypes.string,
      thumbnailLargeUrl: PropTypes.string,
      thumbnailSmallUrl: PropTypes.string,
    }),
  };

  static defaultProps = {
    data: {},
  };

  render() {
    const { data } = this.props
    return (
      <Block
        { ...this.props }
        children={ <img src={ data.thumbnailLargeUrl } /> }
        ref="block"
      />
    )
  }

}

export default EmbedBlock

