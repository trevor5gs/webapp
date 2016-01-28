import React, { Component } from 'react'
import { loadFriends } from '../../actions/stream'
import StreamComponent from '../../components/streams/StreamComponent'

class Following extends Component {

  static preRender = (store) => {
    return store.dispatch(loadFriends())
  };

  render() {
    return (
      <section className="Following Panel">
        <StreamComponent action={loadFriends()} />
      </section>
    )
  }
}

export default Following

