import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import * as StreamActions from '../../actions/stream'

class FollowingView extends React.Component {
  render() {
    return (
      <div className="FollowingView Panel">
        <StreamComponent action={StreamActions.loadFriends()} />
      </div>
    )
  }
}

FollowingView.preRender = (store) => {
  return store.dispatch(StreamActions.loadFriends())
}

export default FollowingView

