import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleEditing, updatePost } from '../../actions/posts'
import BlockCollection from './BlockCollection'

class InlineEditor extends Component {

  static propTypes = {
    blocks: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    post: PropTypes.object,
  };

  submit(data) {
    const { dispatch, post } = this.props
    dispatch(updatePost(post, data))
    dispatch(toggleEditing(post, false))
  }

  render() {
    const { blocks, post } = this.props
    console.log('blocks', blocks)
    console.log('post', post)
    return (
      <BlockCollection
        blocks={ blocks }
        delegate={ this }
      />
    )
  }
}

export default connect()(InlineEditor)

