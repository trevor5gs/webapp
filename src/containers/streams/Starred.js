import React, { Component } from 'react'
import { loadNoise } from '../../actions/stream'
import StreamComponent from '../../components/streams/StreamComponent'

class Starred extends Component {

  render() {
    return (
      <section className="Starred Panel">
        <StreamComponent action={loadNoise()} />
      </section>
    )
  }
}

Starred.preRender = (store) => {
  return store.dispatch(loadNoise())
}

export default Starred

