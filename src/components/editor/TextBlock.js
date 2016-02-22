import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pasted } from './PasteHandler'
import Block from './Block'

class TextBlock extends Component {

  static propTypes = {
    data: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    onInput: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return !(nextProps.data === this.refs.block.refs.text.innerHTML)
  }

  getData() {
    return this.refs.block.refs.text.innerHTML
  }

  handleInput = () => {
    const { onInput } = this.props
    const uid = this.refs.block.props.uid
    onInput({ kind: 'text', data: this.getData(), uid })
  };

  handlePaste = (e) => {
    const { dispatch, onInput } = this.props
    const uid = this.refs.block.props.uid
    // order matters here!
    pasted(e, dispatch)
    onInput({ kind: 'text', data: this.getData(), uid })
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

