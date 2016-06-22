import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { LOGGED_IN_PROMOTIONS } from '../constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../constants/promotions/logged_out'
import {
  bindDiscoverKey,
  loadCategoryPosts,
  loadCommunities,
  loadDiscoverPosts,
  loadDiscoverUsers,
  loadFeaturedUsers,
} from '../actions/discover'
import { setLastDiscoverBeaconVersion } from '../actions/gui'
import { trackEvent } from '../actions/tracking'
import { Discover } from '../components/views/Discover'

const BEACON_VERSION = '1'

export function getDiscoverAction(type) {
  switch (type) {
    // case 'communities':
    //   return loadCommunities()
    // case 'featured-users':
    //   return loadFeaturedUsers()
    case 'featured':
    case 'recommended':
      return loadCategoryPosts()
    case 'recent':
      return loadDiscoverPosts(type)
    case 'trending':
      return loadDiscoverUsers(type)
    default:
      return loadCategoryPosts(type)
  }
}

export function generateTabs(primary) {
  const tabs = []
  // add featured by default
  tabs.push({
    to: '/discover',
    children: 'Featured',
    activePattern: /^\/(?:discover(\/featured|\/recommended)?)?$/,
  })
  for (const category of primary) {
    tabs.push({
      to: `/discover/${category.slug}`,
      children: category.name,
    })
  }
  return tabs
}

export class DiscoverContainer extends Component {

  static propTypes = {
    coverDPI: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isBeaconActive: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    paramsType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    primary: PropTypes.array,
    secondary: PropTypes.array,
    tertiary: PropTypes.array,
  }

  static defaultProps = {
    paramsType: 'featured',
  }

  static preRender = (store, routerState) =>
    store.dispatch(getDiscoverAction(routerState.params.type || 'recommended'))

  componentWillMount() {
    const { dispatch, paramsType } = this.props
    dispatch(bindDiscoverKey(paramsType))
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props)
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
    const { coverDPI, isBeaconActive, isLoggedIn, paramsType, pathname, primary } = this.props
    const props = {
      coverDPI,
      isBeaconActive,
      isLoggedIn,
      onClickTrackCredits: this.onClickTrackCredits,
      onDismissZeroStream: this.onDismissZeroStream,
      pathname,
      promotions: isLoggedIn ? LOGGED_IN_PROMOTIONS : LOGGED_OUT_PROMOTIONS,
      streamAction: getDiscoverAction(paramsType),
      tabs: generateTabs(primary),
    }
    return <Discover key={`discover_${paramsType}`} {...props} />
  }
}

function sortCategories(a, b) {
  if (a.order < b.order) {
    return -1
  } else if (a.order > b.order) {
    return 1
  }
  return 0
}

function mapStateToProps(state, ownProps) {
  const { authentication, gui } = state
  let primary = []
  let secondary = []
  let tertiary = []
  if (gui.categories.length) {
    for (const category of gui.categories) {
      switch (category.level) {
        case 'primary':
          primary.push(category)
          break
        case 'secondary':
          secondary.push(category)
          break
        case 'tertiary':
          tertiary.push(category)
          break
        default:
          break
      }
    }
    primary = primary.sort(sortCategories)
    secondary = secondary.sort(sortCategories)
    tertiary = tertiary.sort(sortCategories)
  }
  return {
    coverDPI: gui.coverDPI,
    isBeaconActive: authentication.isLoggedIn && gui.lastDiscoverBeaconVersion !== BEACON_VERSION,
    isLoggedIn: authentication.isLoggedIn,
    paramsType: ownProps.params.type,
    pathname: ownProps.location.pathname,
    primary,
    secondary,
    tertiary,
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

