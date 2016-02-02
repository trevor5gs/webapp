import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createPost } from '../../actions/posts'
import { closeOmnibar } from '../../actions/omnibar'
import ElloEditor from './v3/ElloEditor'

class Editor extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    stream: PropTypes.object.isRequired,
  };

  submit(data) {
    const { dispatch } = this.props
    dispatch(createPost(data))
    dispatch(closeOmnibar())
  }

  imageUploader(file, callback) {
    return { file, callback }
    // console.log('upload file:', file, 'when complete callback:', callback)
  }

  render() {
    return <ElloEditor delegate={ this } />
  }
}

function mapStateToProps(state) {
  return {
    stream: state.stream,
  }
}

export default connect(mapStateToProps)(Editor)

