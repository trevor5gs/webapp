import React, { Component, PropTypes } from 'react'
import Block from './Block'

class EmbedBlock extends Component {

  static propTypes = {
    data: PropTypes.shape(),
  }

  static defaultProps = {
    data: {},
  }

  componentDidMount() {
    this.reloadPlayers()
  }

  componentDidUpdate() {
    this.reloadPlayers()
  }

  reloadPlayers() {
    if (typeof window !== 'undefined' && window.embetter) {
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
    /* eslint-disable react/no-danger */
    return (
      <Block
        {...this.props}
      >
        <div
          className="editable embed"
          dangerouslySetInnerHTML={{ __html: children }}
        />
      </Block>
    )
    /* eslint-enable react/no-danger */
  }

}

export default EmbedBlock

