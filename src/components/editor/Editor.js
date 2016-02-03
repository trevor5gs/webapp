import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createPost } from '../../actions/posts'
import { closeOmnibar } from '../../actions/omnibar'
import BlockCollection from './v3/BlockCollection'

class Editor extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  submit(data) {
    const { dispatch } = this.props
    dispatch(createPost(data))
    dispatch(closeOmnibar())
  }

  render() {
    return <BlockCollection delegate={ this } />
  }
}

export default connect()(Editor)

