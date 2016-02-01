import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createPost } from '../../actions/posts'
import { closeModal } from '../../actions/modals'
import ElloEditor from './v3/ElloEditor'

class Editor extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    stream: PropTypes.object.isRequired,
  };

  submit(data) {
    const { dispatch } = this.props
    dispatch(createPost(data))
    dispatch(closeModal())
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

