import React, { Component, PropTypes } from 'react'
import RegionTools from '../RegionTools'

class ImageBlock extends Component {

  static propTypes = {
    data: PropTypes.object,
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
          <img src={ data.url } alt={ data.alt } />
        </div>
        <RegionTools/>
      </div>
    )
  }
}

export default ImageBlock

