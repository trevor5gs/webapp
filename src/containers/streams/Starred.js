import React from 'react'
import StreamComponent from '../../components/streams/StreamComponent'
import { loadNoise } from '../../actions/stream'

class Starred extends React.Component {

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

