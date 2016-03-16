import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pasted } from './PasteHandler'
import Block from './Block'
import { placeCaretAtEnd } from './SelectionUtil'

class TextBlock extends Component {

  static propTypes = {
    data: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    editorId: PropTypes.string.isRequired,
    onInput: PropTypes.func.isRequired,
    shouldAutofocus: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    if (this.props.shouldAutofocus) {
      placeCaretAtEnd(this.refs.block.refs.text)
    }
  }

  shouldComponentUpdate(nextProps) {
    return !(nextProps.data === this.refs.block.refs.text.innerHTML)
  }

  componentDidUpdate() {
    placeCaretAtEnd(this.refs.block.refs.text)
  }

  getData() {
    return this.refs.block.refs.text.innerHTML
  }

  handleInput = () => {
    const { onInput } = this.props
    const uid = this.refs.block.props.uid
    onInput({ kind: 'text', data: this.getData(), uid })
  }

  handlePaste = (e) => {
    const { dispatch, editorId, onInput } = this.props
    const uid = this.refs.block.props.uid
    // order matters here!
    pasted(e, dispatch, editorId)
    onInput({ kind: 'text', data: this.getData(), uid })
  }

  render() {
    const { data } = this.props
    return (
      <Block
        { ...this.props }
        contentEditable
        dangerouslySetInnerHTML={{ __html: data }}
        onInput={ this.handleInput }
        onPaste={ this.handlePaste }
        ref="block"
      />
    )
  }
}

export default connect()(TextBlock)

