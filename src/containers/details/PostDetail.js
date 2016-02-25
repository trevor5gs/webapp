import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { loadPostDetail } from '../../actions/posts'
import StreamComponent from '../../components/streams/StreamComponent'

class PostDetail extends Component {

  static propTypes = {
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }).isRequired,
  };

  static preRender = (store, routerState) =>
    store.dispatch(loadPostDetail(`~${routerState.params.type}`));

  render() {
    const { params } = this.props
    return (
      <section className="PostDetail Panel">
        <Helmet title={`${params.username}`} />
        <StreamComponent
          action={loadPostDetail(`~${params.token}`)}
          initModel={{ collection: MAPPING_TYPES.POSTS, findObj: { token: params.token } }}
          key={ params.token }
          ref="streamComponent"
        />
      </section>
    )
  }
}

export default PostDetail

