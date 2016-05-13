import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BEACONS } from '../../constants/action_types'
import { loadNoise } from '../../actions/stream'
import StreamComponent from '../../components/streams/StreamComponent'
import { ZeroStream } from '../../components/zeros/Zeros'

const BEACON_VERSION = '1'

class Starred extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    lastStarredBeaconVersion: PropTypes.string,
  }

  static preRender = (store) =>
    store.dispatch(loadNoise())

  componentWillMount() {
    const { lastStarredBeaconVersion } = this.props
    this.state = {
      isBeaconActive: lastStarredBeaconVersion !== BEACON_VERSION,
    }
  }

  onDismissZeroStream = () => {
    const { dispatch } = this.props
    this.setState({ isBeaconActive: false })
    dispatch({ type: BEACONS.LAST_STARRED_VERSION, payload: { version: BEACON_VERSION } })
  }

  renderZeroStream() {
    return (
      <ZeroStream onDismiss={this.onDismissZeroStream}>
       Star creators and communities to curate your second stream.
      </ZeroStream>
    )
  }

  render() {
    const { isBeaconActive } = this.state
    return (
      <main className="Starred View" role="main">
        {isBeaconActive ? this.renderZeroStream() : null}
        <StreamComponent
          action={loadNoise()}
          scrollSessionKey="/starred"
        />
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    lastStarredBeaconVersion: state.gui.lastStarredBeaconVersion,
  }
}

export default connect(mapStateToProps)(Starred)

