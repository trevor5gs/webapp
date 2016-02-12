import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BEACONS } from '../../constants/action_types'
import { loadFriends } from '../../actions/stream'
import Beacon from '../../components/beacons/Beacon'
import StreamComponent from '../../components/streams/StreamComponent'

const BEACON_VERSION = '1'

class Following extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    lastFollowingBeaconVersion: PropTypes.string,
  };

  componentWillMount() {
    const { lastFollowingBeaconVersion } = this.props
    this.state = {
      isBeaconActive: lastFollowingBeaconVersion !== BEACON_VERSION,
    }
  }

  onDismissBeacon = () => {
    const { dispatch } = this.props
    this.setState({ isBeaconActive: false })
    dispatch({ type: BEACONS.LAST_FOLLOWING_VERSION, payload: { version: BEACON_VERSION } })
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

function mapStateToProps(state) {
  return {
    lastFollowingBeaconVersion: state.gui.lastFollowingBeaconVersion,
  }
}

export default connect(mapStateToProps)(Following)

