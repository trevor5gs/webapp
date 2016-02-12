import React, { Component } from 'react'
import { loadNoise } from '../../actions/stream'
import Beacon from '../../components/beacons/Beacon'
import StreamComponent from '../../components/streams/StreamComponent'

class Starred extends Component {

  componentWillMount() {
    this.state = {
      isBeaconActive: true,
    }
  }

  onDismissBeacon = () => {
    this.setState({ isBeaconActive: false })
    // TODO: When a beacon is closed it's permanent until we update the version
    // number. We'll need to save this state to the GUI store.
  };

  static preRender = (store) =>
    store.dispatch(loadNoise());

  renderBeacon() {
    return (
      <Beacon emoji="star" onDismiss={ this.onDismissBeacon }>
        When you Star someone their posts appear here. Star people to create a second stream.
      </Beacon>
    )
  }

  render() {
    const { isBeaconActive } = this.state
    return (
      <section className="Starred Panel">
        { isBeaconActive ? this.renderBeacon() : null }
        <StreamComponent action={loadNoise()} />
      </section>
    )
  }
}

export default Starred

