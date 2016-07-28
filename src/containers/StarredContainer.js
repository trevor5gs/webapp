import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { loadNoise } from '../actions/stream'
import { setLastStarredBeaconVersion } from '../actions/gui'
import { Starred } from '../components/views/Starred'

const BEACON_VERSION = '1'

function mapStateToProps(state) {
  return {
    isBeaconActive: state.gui.lastStarredBeaconVersion !== BEACON_VERSION,
  }
}

export class StarredContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isBeaconActive: PropTypes.bool.isRequired,
  }

  static preRender = (store) =>
    store.dispatch(loadNoise())

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps)
  }

  onDismissZeroStream = () => {
    const { dispatch } = this.props
    dispatch(setLastStarredBeaconVersion({ version: BEACON_VERSION }))
  }

  render() {
    const { isBeaconActive } = this.props
    const props = {
      isBeaconActive,
      onDismissZeroStream: this.onDismissZeroStream,
      streamAction: loadNoise(),
    }
    return <Starred {...props} />
  }
}

export default connect(mapStateToProps)(StarredContainer)

