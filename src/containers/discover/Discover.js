import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { SIGNED_OUT_PROMOTIONS } from '../../constants/promotion_types'
import { loadCommunities, loadDiscoverUsers, loadFeaturedUsers } from '../../actions/discover'
import { trackEvent } from '../../actions/tracking'
import Banderole from '../../components/assets/Banderole'
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

  static preRender = (store, routerState) => {
    return store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'))
  };

  creditsTrackingEvent = () => {
    const { dispatch } = this.props
    dispatch(trackEvent(`banderole-credits-clicked`))
  };

  render() {
    const { isLoggedIn, params, pathname } = this.props
    const type = params.type || 'recommended'
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
        { to: '/explore', children: 'Recommended' },
        { to: '/explore/trending', children: 'Trending' },
        { to: '/explore/recent', children: 'Recent' },
      ]
    return (
      <section className="Discover Panel" key={`discover_${type}`}>
        <Banderole
          creditsClickAction={ this.creditsTrackingEvent }
          isLoggedIn={ isLoggedIn }
          userlist={ SIGNED_OUT_PROMOTIONS }
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

