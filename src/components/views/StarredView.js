import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import * as StreamActions from '../../actions/stream'

class StarredView extends React.Component {

  render() {
    return (
      <div className="StarredView Panel">
        <StreamComponent action={StreamActions.loadNoise()} />
      </div>
    )
  }
}

StarredView.preRender = (store) => {
  return store.dispatch(StreamActions.loadNoise())
}

export default StarredView

