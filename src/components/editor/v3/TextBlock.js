import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pasted } from './PasteHandler'
import RegionTools from '../RegionTools'

class TextBlock extends Component {

  static propTypes = {
    data: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    uid: PropTypes.number.isRequired,
  };

  static defaultProps = {
    data: '',
  };

  handleInput = (e) => {
    const { uid, onChange } = this.props
    onChange({ kind: 'text', data: e.target.innerHTML, uid })
  };

  handlePaste = (e) => {
    const { dispatch } = this.props
    pasted(e, dispatch)
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
          contentEditable="true"
          onInput={ this.handleInput }
          onPaste={ this.handlePaste }
          dangerouslySetInnerHTML={{ __html: data }}
        />
        <RegionTools/>
      </div>
    )
  }
}

export default connect()(TextBlock)

