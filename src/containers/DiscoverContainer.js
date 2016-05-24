import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { LOGGED_IN_PROMOTIONS } from '../constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../constants/promotions/logged_out'
import {
  bindDiscoverKey, loadCommunities, loadDiscoverPosts, loadDiscoverUsers, loadFeaturedUsers,
} from '../actions/discover'
import { setLastDiscoverBeaconVersion } from '../actions/gui'
import { trackEvent } from '../actions/tracking'
import { Discover } from '../components/views/Discover'

const BEACON_VERSION = '1'
const TABS = [
  { to: '/discover', children: 'Featured', activePattern: /^\/(?:discover(\/recommended)?)?$/ },
  { to: '/discover/trending', children: 'Trending' },
  { to: '/discover/recent', children: 'Recent' },
  // { to: '/discover/communities', children: 'Communities' },
  // { to: '/discover/featured-users', children: 'Featured Users' },
]

export function getDiscoverAction(type) {
  let action = loadDiscoverPosts(type || 'recommended')
  if (type === 'communities') {
    action = loadCommunities()
  } else if (type === 'featured-users') {
    action = loadFeaturedUsers()
  } else if (type === 'trending') {
    action = loadDiscoverUsers(type)
  }
  return action
}

export class DiscoverContainer extends Component {

  static propTypes = {
    coverDPI: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isBeaconActive: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    paramsType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static defaultProps = {
    paramsType: 'recommended',
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'))

  componentWillMount() {
    const { dispatch, paramsType } = this.props
    dispatch(bindDiscoverKey(paramsType))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    const { dispatch, paramsType } = this.props
    dispatch(bindDiscoverKey(paramsType))
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('banderole-credits-clicked'))
  }

  onDismissZeroStream = () => {
    const { dispatch } = this.props
    dispatch(setLastDiscoverBeaconVersion({ version: BEACON_VERSION }))
  }

  render() {
    const { coverDPI, isBeaconActive, isLoggedIn, paramsType, pathname } = this.props
    const props = {
      coverDPI,
      isBeaconActive,
      isLoggedIn,
      onClickTrackCredits: this.onClickTrackCredits,
      onDismissZeroStream: this.onDismissZeroStream,
      pathname,
      promotions: isLoggedIn ? LOGGED_IN_PROMOTIONS : LOGGED_OUT_PROMOTIONS,
      streamAction: getDiscoverAction(paramsType),
      tabs: TABS,
    }
    return <Discover key={`discover_${paramsType}`} {...props} />
  }
}

function mapStateToProps(state, ownProps) {
  const { authentication, gui } = state
  return {
    coverDPI: gui.coverDPI,
    isBeaconActive: authentication.isLoggedIn && gui.lastDiscoverBeaconVersion !== BEACON_VERSION,
    isLoggedIn: authentication.isLoggedIn,
    paramsType: ownProps.params.type,
    pathname: ownProps.location.pathname,
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

