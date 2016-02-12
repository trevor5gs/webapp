import React, { Component } from 'react'
import { loadFriends } from '../../actions/stream'
import Beacon from '../../components/beacons/Beacon'
import StreamComponent from '../../components/streams/StreamComponent'

class Following extends Component {

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
    store.dispatch(loadFriends());

  renderBeacon() {
    return (
      <Beacon emoji="lollipop" onDismiss={ this.onDismissBeacon }>
        Follow people and things that inspire you.
      </Beacon>
    )
  }

  render() {
    const { isBeaconActive } = this.state
    return (
      <section className="Following Panel">
        { isBeaconActive ? this.renderBeacon() : null }
        <StreamComponent action={loadFriends()} />
      </section>
    )
  }
}

export default Following

