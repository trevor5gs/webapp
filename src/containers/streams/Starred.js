import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BEACONS } from '../../constants/action_types'
import { loadNoise } from '../../actions/stream'
import Beacon from '../../components/beacons/Beacon'
import StreamComponent from '../../components/streams/StreamComponent'

const BEACON_VERSION = '1'

class Starred extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    lastStarredBeaconVersion: PropTypes.string,
  };

  componentWillMount() {
    const { lastStarredBeaconVersion } = this.props
    this.state = {
      isBeaconActive: lastStarredBeaconVersion !== BEACON_VERSION,
    }
  }

  onDismissBeacon = () => {
    const { dispatch } = this.props
    this.setState({ isBeaconActive: false })
    dispatch({ type: BEACONS.LAST_STARRED_VERSION, payload: { version: BEACON_VERSION } })
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

function mapStateToProps(state) {
  return {
    lastStarredBeaconVersion: state.gui.lastStarredBeaconVersion,
  }
}

export default connect(mapStateToProps)(Starred)

