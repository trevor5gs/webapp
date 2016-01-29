import React, { Component } from 'react'
import { loadNoise } from '../../actions/stream'
import StreamComponent from '../../components/streams/StreamComponent'

class Starred extends Component {

  static preRender = (store) =>
    store.dispatch(loadNoise());

  render() {
    return (
      <section className="Starred Panel">
        <StreamComponent action={loadNoise()} />
      </section>
    )
  }
}

export default Starred

