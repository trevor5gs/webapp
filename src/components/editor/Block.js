import React, { Component, PropTypes } from 'react'
import RegionTools from './RegionTools'

class Block extends Component {

  static propTypes = {
    children: PropTypes.element,
    editorId: PropTypes.string.isRequired,
    kind: PropTypes.oneOf([
      'block',
      'embed',
      'image',
      'text',
    ]).isRequired,
    onRemoveBlock: PropTypes.func.isRequired,
    uid: PropTypes.number.isRequired,
  }

  static defaultProps = {
    data: '',
    ref: 'editable',
  }

  removeBlock = () => {
    const { onRemoveBlock, uid } = this.props
    onRemoveBlock(uid)
  }

  render() {
    const { children, editorId, uid } = this.props
    return (
      <div
        className="editor-block"
        data-collection-id={uid}
        data-editor-id={editorId}
        ref="editorBlock"
      >
        {children}
        <RegionTools editorId={editorId} onRemoveBlock={this.removeBlock} />
      </div>
    )
  }

}

export default Block

