import React from 'react'
import { connect } from 'react-redux'
import StreamComponent from '../streams/StreamComponent'
import { postDetail } from '../streams/StreamRenderables'
import { loadPostDetail } from '../../actions/posts'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { findBy } from '../../util/json_helper'
import { ElloMark } from '../iconography/ElloIcons'

class PostDetail extends React.Component {

  render() {
    const initModel = { collection: MAPPING_TYPES.POSTS, findObj: { token: this.props.params.token } }
    return <StreamComponent action={loadPostDetail(this.props.params.token)} initModel={initModel} />
  }
  // constructor(props, context) {
  //   super(props, context)
  //   const post = this.getPost(props)
  //   if (!post) {
  //     props.dispatch(loadPostDetail(props.params.token))
  //   }
  // }

  // getPost(props) {
  //   return findBy({token: props.params.token}, MAPPING_TYPES.POSTS, props.json)
  // }

  // render() {
  //   const post = this.getPost(this.props)
  //   if (!post) {
  //     return (
  //       <section className="StreamComponent isBusy">
  //         <div className="StreamBusyIndicator">
  //           <ElloMark />
  //         </div>
  //       </section>
  //     )
  //   }
  //   return (
  //     <div className="PostDetail" key={post.id}>
  //       {postDetail([post], this.props.json)}
  //     </div>
  //   )
  // }
}

export default PostDetail

