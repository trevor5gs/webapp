import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pasted } from './PasteHandler'
import Block from './Block'

class TextBlock extends Component {

  static propTypes = {
    data: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleInput = (e) => {
    const { onChange } = this.props
    const uid = this.refs.block.props.uid
    onChange({ kind: 'text', data: e.target.innerHTML, uid })
  };

  handlePaste = (e) => {
    const { dispatch } = this.props
    pasted(e, dispatch)
  };

  render() {
    const { data } = this.props
    return (
      <Block
        { ...this.props }
        contentEditable
        onInput={ this.handleInput }
        onPaste={ this.handlePaste }
        dangerouslySetInnerHTML={{ __html: data }}
        ref="block"
      />
    )
  }
}

export default connect()(TextBlock)

