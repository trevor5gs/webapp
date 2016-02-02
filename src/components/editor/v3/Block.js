import React, { Component, PropTypes } from 'react'
import RegionTools from '../RegionTools'
import classNames from 'classnames'

class Block extends Component {

  static propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    data: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    onRemoveBlock: PropTypes.func.isRequired,
    kind: PropTypes.oneOf([
      'text',
      'image',
      'embed',
    ]).isRequired,
    uid: PropTypes.number.isRequired,
  };

  static defaultProps = {
    data: '',
    ref: 'editable',
  };

  removeBlock = () => {
    const { onRemoveBlock, uid } = this.props
    onRemoveBlock(uid)
  };

  render() {
    const { children, className } = this.props
    return (
      <div
        className="editor-block"
        data-collection-id={ this.uid }
      >
        <div
          { ...this.props }
          className={classNames('editable', className)}
        >
          { children }
        </div>
        <RegionTools onRemoveBlock={ this.removeBlock }/>
      </div>
    )
  }

}

export default Block

