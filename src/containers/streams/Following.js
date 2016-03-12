import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BEACONS } from '../../constants/action_types'
import { loadFriends } from '../../actions/stream'
import StreamComponent from '../../components/streams/StreamComponent'
import { ZeroStream } from '../../components/zeros/Zeros'

const BEACON_VERSION = '1'

class Following extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    lastFollowingBeaconVersion: PropTypes.string,
  }

  static preRender = (store) =>
    store.dispatch(loadFriends())

  componentWillMount() {
    const { lastFollowingBeaconVersion } = this.props
    this.state = {
      isBeaconActive: lastFollowingBeaconVersion !== BEACON_VERSION,
    }
  }

  onDismissZeroStream = () => {
    const { dispatch } = this.props
    this.setState({ isBeaconActive: false })
    dispatch({ type: BEACONS.LAST_FOLLOWING_VERSION, payload: { version: BEACON_VERSION } })
  }

  renderZeroStream() {
    return (
      <ZeroStream emoji="lollipop" onDismiss={ this.onDismissZeroStream }>
        Follow people and things that inspire you.
      </ZeroStream>
    )
  }

  render() {
    const { isBeaconActive } = this.state
    return (
      <section className="Following Panel">
        { isBeaconActive ? this.renderZeroStream() : null }
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

