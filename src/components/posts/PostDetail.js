import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import { loadPostDetail } from '../../actions/posts'
import * as MAPPING_TYPES from '../../constants/mapping_types'

class PostDetail extends React.Component {
  render() {
    const { params } = this.props
    return (
      <section className="PostDetail Panel">
        <StreamComponent
          ref="streamComponent"
          action={loadPostDetail(`~${params.token}`)}
          initModel={{ collection: MAPPING_TYPES.POSTS, findObj: { token: params.token } }} />
      </section>
    )
  }
}

PostDetail.propTypes = {
  params: React.PropTypes.shape({
    token: React.PropTypes.string.isRequired,
  }).isRequired,
}

export default PostDetail

