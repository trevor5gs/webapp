import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import * as DiscoverActions from '../../actions/discover'

class DiscoverView extends React.Component {
  render() {
    return (
      <div>
        <h1 className="heading">The Discover</h1>
        <StreamComponent action={DiscoverActions.loadRecommended} />
      </div>
    )
  }
}

export default DiscoverView

