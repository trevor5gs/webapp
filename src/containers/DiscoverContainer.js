import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { sample } from 'lodash'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectCategories, selectCategoryPageTitle } from '../selectors/categories'
import { selectCoverDPI } from '../selectors/gui'
import { selectParamsType } from '../selectors/params'
import { selectPromotions } from '../selectors/promotions'
import { selectPropsPathname } from '../selectors/routing'
import {
  bindDiscoverKey,
  getCategories,
  loadCategoryPosts,
  // loadCommunities,
  loadDiscoverPosts,
  loadDiscoverUsers,
  // loadFeaturedUsers,
} from '../actions/discover'
import { setLastDiscoverBeaconVersion } from '../actions/gui'
import { trackEvent } from '../actions/analytics'
import { Discover } from '../components/views/Discover'

const BEACON_VERSION = '1'

// TODO: Move to a selector
export function getStreamAction(type) {
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
    case 'all':
      return getCategories()
    default:
      return loadCategoryPosts(type)
  }
}

// TODO: Combine with selectCategories or move to its own selector
export function generateTabs(primary, secondary, tertiary) {
  const tabs = []
  // add featured/trending/recent by default
  tabs.push({
    to: '/discover',
    children: 'Featured',
    activePattern: /^\/(?:discover(\/featured|\/recommended)?)?$/,
  })
  tabs.push({
    to: '/discover/trending',
    children: 'Trending',
  })
  tabs.push({
    to: '/discover/recent',
    children: 'Recent',
  })
  // add line to split categories
  tabs.push({ kind: 'divider' })
  for (const category of primary) {
    tabs.push({
      to: `/discover/${category.slug}`,
      children: category.name,
    })
  }
  for (const category of secondary) {
    tabs.push({
      to: `/discover/${category.slug}`,
      children: category.name,
    })
  }
  for (const category of tertiary) {
    tabs.push({
      to: `/discover/${category.slug}`,
      children: category.name,
    })
  }
  return tabs
}

function mapStateToProps(state, props) {
  const isLoggedIn = selectIsLoggedIn(state)
  const { primary, secondary, tertiary } = selectCategories(state, props)
  const pageTitle = selectCategoryPageTitle(state, props)
  const titlePrefix = pageTitle ? `${pageTitle} | ` : ''
  const title = `${titlePrefix} Ello`
  return {
    coverDPI: selectCoverDPI(state),
    isBeaconActive: isLoggedIn && state.gui.lastDiscoverBeaconVersion !== BEACON_VERSION,
    isLoggedIn,
    pageTitle,
    paramsType: selectParamsType(state, props),
    pathname: selectPropsPathname(state, props),
    promotions: selectPromotions(state),
    primary,
    secondary,
    tertiary,
    title,
  }
}

class DiscoverContainer extends Component {
  static propTypes = {
    coverDPI: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isBeaconActive: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pageTitle: PropTypes.string,
    paramsType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    promotions: PropTypes.array.isRequired,
    primary: PropTypes.array,
    secondary: PropTypes.array,
    tertiary: PropTypes.array,
    title: PropTypes.string.isRequired,
  }

  static defaultProps = {
    paramsType: 'featured',
  }

  static preRender = (store, routerState) =>
    store.dispatch(getStreamAction(routerState.params.type || 'featured'))

  componentWillMount() {
    const { dispatch, paramsType, promotions } = this.props
    dispatch(bindDiscoverKey(paramsType))
    this.state = { promotion: sample(promotions) }
  }

  componentWillReceiveProps(nextProps) {
    const { pathname, promotions } = nextProps
    if (!this.state.promotion || this.props.pathname !== pathname) {
      this.setState({ promotion: sample(promotions) })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate(prevProps) {
    const { dispatch, paramsType, pathname } = this.props
    if (prevProps.pathname !== pathname) {
      dispatch(bindDiscoverKey(paramsType))
    }
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
    const { coverDPI, isBeaconActive, isLoggedIn, pageTitle, paramsType,
            pathname, primary, secondary, tertiary, title } = this.props
    const { promotion } = this.state
    const props = {
      coverDPI,
      isBeaconActive,
      isLoggedIn,
      onClickTrackCredits: this.onClickTrackCredits,
      onDismissZeroStream: this.onDismissZeroStream,
      pageTitle,
      pathname,
      promotion,
      streamAction: getStreamAction(paramsType),
      tabs: generateTabs(primary, secondary, tertiary),
      title,
    }
    return <Discover key={`discover_${paramsType}`} {...props} />
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

