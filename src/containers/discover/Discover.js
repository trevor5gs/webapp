import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BEACONS } from '../../constants/action_types'
import { LOGGED_IN_PROMOTIONS } from '../../constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../../constants/promotions/logged_out'
import { loadCommunities, loadDiscoverUsers, loadFeaturedUsers } from '../../actions/discover'
import { trackEvent } from '../../actions/tracking'
import Promotion from '../../components/assets/Promotion'
import StreamComponent from '../../components/streams/StreamComponent'
import { TabListLinks } from '../../components/tabs/TabList'
import { ZeroStream } from '../../components/zeros/Zeros'

const BEACON_VERSION = '1'

export class Discover extends Component {

  static propTypes = {
    currentStream: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    lastDiscoverBeaconVersion: PropTypes.string,
    params: PropTypes.shape({
      type: PropTypes.string,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'))

  componentWillMount() {
    const { lastDiscoverBeaconVersion, isLoggedIn } = this.props

    this.state = {
      isBeaconActive: isLoggedIn && lastDiscoverBeaconVersion !== BEACON_VERSION,
    }
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('banderole-credits-clicked'))
  }

  onDismissZeroStream = () => {
    const { dispatch } = this.props
    this.setState({ isBeaconActive: false })
    dispatch({ type: BEACONS.LAST_DISCOVER_VERSION, payload: { version: BEACON_VERSION } })
  }

  renderZeroStream() {
    return (
      <ZeroStream emoji="crystal_ball" onDismiss={ this.onDismissZeroStream }>
        Discover inspiring people and beautiful things you won’t find anywhere else.
      </ZeroStream>
    )
  }

  render() {
    const { isLoggedIn, params, pathname } = this.props
    const { isBeaconActive } = this.state
    const type = params.type || 'recommended'
    let action = loadDiscoverUsers(type)
    if (type === 'communities') {
      action = loadCommunities()
    } else if (type === 'featured-users') {
      action = loadFeaturedUsers()
    }
    const tabs = [
      { to: '/discover', children: 'Recommended', activePattern: /^\/(?:discover)?$/ },
      { to: '/discover/trending', children: 'Trending' },
      { to: '/discover/recent', children: 'Recent' },
      // { to: '/discover/communities', children: 'Communities' },
      // { to: '/discover/featured-users', children: 'Featured Users' },
    ]
    return (
      <section className="Discover Panel" key={ `discover_${type}` }>
        { isBeaconActive ? this.renderZeroStream() : null }
        <Promotion
          creditsClickAction={ this.onClickTrackCredits }
          isLoggedIn={ isLoggedIn }
          userlist={ isLoggedIn ? LOGGED_IN_PROMOTIONS : LOGGED_OUT_PROMOTIONS }
        />
        <TabListLinks
          activePath={ pathname }
          className="LabelTabList"
          tabClasses="LabelTab"
          tabs={ tabs }
        />
        <StreamComponent action={ action } ref="streamComponent" />
      </section>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentStream: state.gui.currentStream,
    isLoggedIn: state.authentication.isLoggedIn,
    lastDiscoverBeaconVersion: state.gui.lastDiscoverBeaconVersion,
    pathname: ownProps.location.pathname,
  }
}

export default connect(mapStateToProps)(Discover)

