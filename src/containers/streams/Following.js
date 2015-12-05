import React, { Component } from 'react'
import { loadFriends } from '../../actions/stream'
import StreamComponent from '../../components/streams/StreamComponent'

class Following extends Component {
  render() {
    return (
      <section className="Following Panel">
        <StreamComponent action={loadFriends()} />
      </section>
    )
  }
}

Following.preRender = (store) => {
  return store.dispatch(loadFriends())
}

export default Following

