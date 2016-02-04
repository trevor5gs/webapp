import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pasted } from './PasteHandler'
import Block from './Block'
import TextTools from './TextTools'

class TextBlock extends Component {

  static propTypes = {
    data: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    onInput: PropTypes.func.isRequired,
  };

  // TODO: hideTextTools should be set to true, before merging in.
  componentWillMount() {
    this.state = {
      hideTextTools: false,
    }
  }

  handleInput = (e) => {
    const { onInput } = this.props
    const uid = this.refs.block.props.uid
    onInput({ kind: 'text', data: e.target.innerHTML, uid })
  };

  handlePaste = (e) => {
    const { dispatch } = this.props
    pasted(e, dispatch)
  };

  render() {
    const { data } = this.props
    const { hideTextTools } = this.state
    return (
      <Block
        { ...this.props }
        component={
          <TextTools isHidden={ hideTextTools } />
        }
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

