import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import BlockCollection from './BlockCollection'
import PostActionBar from './PostActionBar'

class ElloEditor extends Component {

  submit() {
    const { delegate } = this.props
    const data = this.refs.collection.serialize()
    delegate.submit(data)
  }

  addImage() {
    this.refs.collection.add()
  }

  render() {
    const { dispatch, editor } = this.props
    return (
      <div className="editor" data-placeholder="Say Ello...">
        <BlockCollection ref="collection" dispatch={ dispatch } editorStore={ editor } />
        <PostActionBar ref="postActionBar" editor={ this } />
      </div>
    )
  }
}

ElloEditor.propTypes = {
  delegate: PropTypes.any.isRequired,
  dispatch: PropTypes.func.isRequired,
  editor: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    editor: state.editor,
  }
}



export default connect(mapStateToProps)(ElloEditor)

