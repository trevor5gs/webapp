import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pasted } from './PasteHandler'
import Block from './Block'
import { placeCaretAtEnd } from './SelectionUtil'
import { addKeyObject, removeKeyObject } from '../viewport/KeyComponent'

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
    addKeyObject(this)
    document.addEventListener('click', this.onClickDocument, false)
  }

  shouldComponentUpdate(nextProps) {
    return !(nextProps.data === this.refs.block.refs.text.innerHTML)
  }

  componentDidUpdate() {
    placeCaretAtEnd(this.refs.block.refs.text)
  }

  componentWillUnmount() {
    removeKeyObject(this)
    document.removeEventListener('click', this.onClickDocument, false)
  }

  // TODO: Send `isEditorFocused` through the modal reducer
  // instead once PR #577 is merged: ag isEditorFocused
  onBlurText = () => {
    document.body.classList.remove('isEditorFocused')
  }

  // TODO: Send `isEditorFocused` through the modal reducer
  // instead once PR #577 is merged: ag isEditorFocused
  onFocusText = () => {
    document.body.classList.add('isEditorFocused')
  }

  onClickDocument = (e) => {
    if (e.target.classList.contains('TextToolButton')) {
      this.updateTextBlock()
    }
  }

  // need to use onKeyUp instead of onInput due to IE
  // and Edge not supporting the input event
  onKeyUp() {
    this.updateTextBlock()
  }

  onPasteText = (e) => {
    const { dispatch, editorId } = this.props
    // order matters here!
    const uid = this.refs.block.props.uid
    pasted(e, dispatch, editorId, uid)
    this.updateTextBlock()
  }

  getData() {
    return this.refs.block.refs.text.innerHTML
  }

  updateTextBlock() {
    const { onInput } = this.props
    const uid = this.refs.block.props.uid
    onInput({ kind: 'text', data: this.getData(), uid })
  }

  render() {
    const { data } = this.props
    return (
      <Block
        { ...this.props }
        contentEditable
        dangerouslySetInnerHTML={{ __html: data }}
        onBlur={ this.onBlurText }
        onFocus={ this.onFocusText }
        onInput={ null }
        onPaste={ this.onPasteText }
        ref="block"
      />
    )
  }
}

export default connect()(TextBlock)

