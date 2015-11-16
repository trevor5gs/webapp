import React from 'react'
import App from './App'
import StreamComponent from '../components/streams/StreamComponent'
import { loadPostDetail } from '../actions/posts'
import * as MAPPING_TYPES from '../constants/mapping_types'

class PostDetail extends React.Component {
  render() {
    const { params } = this.props
    return (
      <App>
        <section className="PostDetail Panel">
          <StreamComponent
            ref="streamComponent"
            action={loadPostDetail(`~${params.token}`)}
            initModel={{ collection: MAPPING_TYPES.POSTS, findObj: { token: params.token } }} />
        </section>
      </App>
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

