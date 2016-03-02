import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { BEACONS } from '../../constants/action_types'
import { LOGGED_IN_PROMOTIONS } from '../../constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../../constants/promotions/logged_out'
import { loadCommunities, loadDiscoverUsers, loadFeaturedUsers } from '../../actions/discover'
import { trackEvent } from '../../actions/tracking'
import Banderole from '../../components/assets/Banderole'
import Beacon from '../../components/beacons/Beacon'
import StreamComponent from '../../components/streams/StreamComponent'
import { TabListLinks } from '../../components/tabs/TabList'

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
  };

  componentWillMount() {
    const { currentStream, dispatch, lastDiscoverBeaconVersion,
            isLoggedIn, pathname } = this.props

    if (pathname === '/' && isLoggedIn) {
      const replaceTarget = currentStream
      dispatch(replace(replaceTarget))
    }

    this.state = {
      isBeaconActive: isLoggedIn && lastDiscoverBeaconVersion !== BEACON_VERSION,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentStream, dispatch, isLoggedIn, pathname } = nextProps

    if (pathname === '/' && isLoggedIn) {
      const replaceTarget = currentStream
      dispatch(replace(replaceTarget))
    }
  }

  onDismissBeacon = () => {
    const { dispatch } = this.props
    this.setState({ isBeaconActive: false })
    dispatch({ type: BEACONS.LAST_DISCOVER_VERSION, payload: { version: BEACON_VERSION } })
  };

  static preRender = (store, routerState) =>
    store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'));

  creditsTrackingEvent = () => {
    const { dispatch } = this.props
    dispatch(trackEvent(`banderole-credits-clicked`))
  };

  renderBeacon() {
    return (
      <Beacon emoji="crystal_ball" onDismiss={ this.onDismissBeacon }>
        Discover inspiring people and beautiful things you won’t find anywhere else.
      </Beacon>
    )
  }

  render() {
    const { isLoggedIn, params, pathname } = this.props
    const { isBeaconActive } = this.state
    const type = params.type || (isLoggedIn ? 'recommended' : 'trending')
    let action = loadDiscoverUsers(type)
    if (type === 'communities') {
      action = loadCommunities()
    } else if (type === 'featured-users') {
      action = loadFeaturedUsers()
    }
    const tabs = isLoggedIn ?
      [
        { to: '/discover', children: 'Recommended' },
        { to: '/discover/trending', children: 'Trending' },
        { to: '/discover/recent', children: 'Recent' },
        // { to: '/discover/communities', children: 'Communities' },
        // { to: '/discover/featured-users', children: 'Featured Users' },
      ] :
      [
        { to: '/explore', children: 'Trending', activePattern: /^\/(?:explore)?$/ },
        { to: '/explore/recommended', children: 'Recommended' },
        { to: '/explore/recent', children: 'Recent' },
      ]
    return (
      <section className="Discover Panel" key={`discover_${type}`}>
        { isBeaconActive ? this.renderBeacon() : null }
        <Banderole
          creditsClickAction={ this.creditsTrackingEvent }
          isLoggedIn={ isLoggedIn }
          userlist={ isLoggedIn ? LOGGED_IN_PROMOTIONS : LOGGED_OUT_PROMOTIONS }
        />
        <TabListLinks
          activePath={ pathname }
          className="LabelTabList"
          tabClasses="LabelTab"
          tabs={ tabs }
        />
        <StreamComponent action={action} ref="streamComponent" />
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
