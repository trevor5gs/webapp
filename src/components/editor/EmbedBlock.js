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
  }

  static defaultProps = {
    data: {},
  }

  componentDidUpdate() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
  }

  render() {
    const { data: { service, url, thumbnailLargeUrl, id } } = this.props
    const children = typeof window !== 'undefined' ?
      window.embetter.utils.playerHTML(
        window.embetter.services[service],
        url,
        thumbnailLargeUrl,
        id
      ) :
      null
    return (
      <Block
        { ...this.props }
        dangerouslySetInnerHTML={{ __html: children }}
        ref="block"
      />
    )
  }

}

export default EmbedBlock

