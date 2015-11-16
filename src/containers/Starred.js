import React from 'react'
import App from './App'
import StreamComponent from '../components/streams/StreamComponent'
import { loadNoise } from '../actions/stream'

class Starred extends React.Component {

  render() {
    return (
      <App>
        <section className="Starred Panel">
          <StreamComponent action={loadNoise()} />
        </section>
      </App>
    )
  }
}

Starred.preRender = (store) => {
  return store.dispatch(loadNoise())
}

export default Starred

