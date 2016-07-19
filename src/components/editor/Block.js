import React, { Component, PropTypes } from 'react'
import RegionTools from './RegionTools'
import { AffiliateLinkButton } from './AffiliateLinkButton'

class Block extends Component {

  static propTypes = {
    children: PropTypes.element,
    editorId: PropTypes.string.isRequired,
    kind: PropTypes.oneOf([
      'affiliate_embed',
      'affiliate_image',
      'affiliate_text',
      'block',
      'embed',
      'image',
      'text',
    ]).isRequired,
    linkURL: PropTypes.string,
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
    const { children, editorId, linkURL, uid } = this.props
    return (
      <div
        className="editor-block"
        data-collection-id={uid}
        data-editor-id={editorId}
        ref="editorBlock"
      >
        {children}
        {
          linkURL && linkURL.length ?
            <AffiliateLinkButton to={linkURL} /> :
            null
        }
        <RegionTools editorId={editorId} onRemoveBlock={this.removeBlock} />
      </div>
    )
  }

}

export default Block

