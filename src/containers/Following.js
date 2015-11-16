import React from 'react'
import App from './App'
import StreamComponent from '../components/streams/StreamComponent'
import { loadFriends } from '../actions/stream'

class Following extends React.Component {
  render() {
    return (
      <App path="/following">
        <section className="Following Panel">
          <StreamComponent action={loadFriends()} />
        </section>
      </App>
    )
  }
}

Following.preRender = (store) => {
  return store.dispatch(loadFriends())
}

export default Following

