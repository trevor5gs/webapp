import React from 'react'
import StreamComponent from '../components/streams/StreamComponent'
import { loadFriends } from '../actions/stream'

class Following extends React.Component {
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

