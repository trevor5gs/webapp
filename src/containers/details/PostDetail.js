import React from 'react'
import Helmet from 'react-helmet'
import StreamComponent from '../../components/streams/StreamComponent'
import { loadPostDetail } from '../../actions/posts'
import * as MAPPING_TYPES from '../../constants/mapping_types'

class PostDetail extends React.Component {
  render() {
    const { params } = this.props
    return (
      <section className="PostDetail Panel">
        <Helmet title={`${params.username}`} />
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

PostDetail.preRender = (store, routerState) => {
  return store.dispatch(loadPostDetail(`~${routerState.params.type}`))
}

export default PostDetail

