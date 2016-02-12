import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LOGGED_IN_PROMOTIONS } from '../../constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../../constants/promotions/logged_out'
import { loadCommunities, loadDiscoverUsers, loadFeaturedUsers } from '../../actions/discover'
import { trackEvent } from '../../actions/tracking'
import Banderole from '../../components/assets/Banderole'
import Beacon from '../../components/beacons/Beacon'
import StreamComponent from '../../components/streams/StreamComponent'
import TabListLinks from '../../components/tabs/TabListLinks'

class Discover extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      type: PropTypes.string,
    }),
    pathname: PropTypes.string.isRequired,
  };

  componentWillMount() {
    const { isLoggedIn } = this.props
    this.state = {
      isBeaconActive: isLoggedIn,
    }
  }

  onDismissBeacon = () => {
    this.setState({ isBeaconActive: false })
    // TODO: When a beacon is closed it's permanent until we update the version
    // number. We'll need to save this state to the GUI store.
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
        { to: '/explore', children: 'Trending' },
        { to: '/explore/recommended', children: 'Recommended' },
        { to: '/explore/recent', children: 'Recent' },
      ]
    // TODO: We should only render a beacon when a user is logged in and hasn't
    // dismissed the current version
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

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    pathname: state.routing.location.pathname,
  }
}

export default connect(mapStateToProps)(Discover)

