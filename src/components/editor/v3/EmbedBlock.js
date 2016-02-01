import React, { Component, PropTypes } from 'react'

class EmbedBlock extends Component {

  static propTypes = {
    data: PropTypes.shape({
      url: PropTypes.string,
      service: PropTypes.string,
      id: PropTypes.string,
      thumbnailLargeUrl: PropTypes.string,
      thumbnailSmallUrl: PropTypes.string,
    }),
    uid: PropTypes.number.isRequired,
  };

  static defaultProps = {
    data: {},
  };

  render() {
    const { data } = this.props
    return (
      <div
        className="editor-block"
        data-collection-id={ this.uid }
      >
        <div
          ref="editable"
          className="editable"
        >
          <img src={ data.thumbnailLargeUrl } />
        </div>
      </div>
    )
  }

}

export default EmbedBlock

