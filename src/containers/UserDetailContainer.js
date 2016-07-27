import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import { isEqual, omit } from 'lodash'
import { PROFILE } from '../constants/action_types'
import {
  selectActiveUserFollowingType,
  selectHasSaidHelloTo,
  selectParamsType,
  selectParamsUsername,
  selectUser,
} from '../selectors'
import { setActiveUserFollowingType } from '../actions/gui'
import { sayHello } from '../actions/zeros'
import {
  loadUserDetail, loadUserLoves, loadUserPosts, loadUserUsers, loadUserFollowing,
} from '../actions/user'
import { ErrorState4xx } from '../components/errors/Errors'
import { UserDetail, UserDetailError } from '../components/views/UserDetail'


const followingTabs = [
  { type: 'friend', children: 'Following' },
  { type: 'noise', children: 'Starred' },
]

export function getStreamAction({ activeUserFollowingType = 'friend', type = 'posts', username }) {
  switch (type) {
    case 'following':
      return loadUserFollowing(`~${username}`, activeUserFollowingType)
    case 'followers':
      return loadUserUsers(`~${username}`, type)
    case 'loves':
      return loadUserLoves(`~${username}`, type)
    case 'posts':
    default:
      return loadUserPosts(`~${username}`, type)
  }
}

const selectUserDetailStreamAction = createSelector(
  [selectActiveUserFollowingType, selectParamsType, selectParamsUsername],
  (activeUserFollowingType, type, username) =>
    getStreamAction({ activeUserFollowingType, type, username })
)

export function shouldContainerUpdate(thisProps, nextProps) {
  if (!nextProps.user) { return false }
  const omitProps = ['children', 'dispatch', 'history', 'route', 'routes']
  const thisCompare = omit(thisProps, omitProps)
  const nextCompare = omit(nextProps, omitProps)
  return !isEqual(thisCompare, nextCompare)
}

export function mapStateToProps(state, props) {
  const { authentication, gui, stream } = state
  const type = selectParamsType(state, props) || 'posts'
  const username = selectParamsUsername(state, props)
  const user = selectUser(state, props)
  const activeUserFollowingType = gui.activeUserFollowingType
  const isLoggedIn = authentication.isLoggedIn
  const isSelf = isLoggedIn && user ? user.relationshipPriority === 'self' : false
  const hasSaidHelloTo = user ? !isSelf && selectHasSaidHelloTo(state, props) : false
  const keyPostfix = isSelf && activeUserFollowingType ? `/${activeUserFollowingType}` : ''
  const streamAction = selectUserDetailStreamAction(state, props)

  return {
    activeUserFollowingType,
    coverDPI: gui.coverDPI,
    coverImage: user && user.coverImage ? user.coverImage : null,
    coverOffset: gui.coverOffset,
    isCoverActive: !gui.isOmnibarActive,
    isCoverHidden: gui.isCoverHidden,
    isLoggedIn,
    isSelf,
    isStreamFailing: stream.type === PROFILE.DETAIL_FAILURE && stream.error && !user,
    hasZeroFollowers: user ? user.followersCount < 1 : false,
    hasZeroPosts: user ? user.postsCount < 1 : false,
    hasSaidHelloTo,
    paramsType: type,
    paramsUsername: username,
    streamAction,
    tabs: isSelf && type === 'following' ? followingTabs : null,
    user,
    viewKey: `userDetail/${username}/${type}${keyPostfix}`,
  }
}

export class UserDetailContainer extends Component {
  static propTypes = {
    activeUserFollowingType: PropTypes.string,
    coverDPI: PropTypes.string,
    coverImage: PropTypes.shape({}),
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    isCoverActive: PropTypes.bool.isRequired,
    isCoverHidden: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isStreamFailing: PropTypes.bool.isRequired,
    hasSaidHelloTo: PropTypes.bool.isRequired,
    hasZeroFollowers: PropTypes.bool.isRequired,
    hasZeroPosts: PropTypes.bool.isRequired,
    paramsType: PropTypes.string,
    paramsUsername: PropTypes.string.isRequired,
    streamAction: PropTypes.object,
    tabs: PropTypes.array,
    user: PropTypes.object,
    viewKey: PropTypes.string,
  }

  static preRender = (store, routerState) => {
    const { type = 'posts', username } = routerState.params
    const profileAction = loadUserDetail(`~${username}`)
    const streamAction = getStreamAction({ type, username })
    return Promise.all([
      store.dispatch(profileAction),
      store.dispatch(streamAction),
    ])
  }

  componentWillMount() {
    const { dispatch, paramsUsername } = this.props
    dispatch(loadUserDetail(`~${paramsUsername}`))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, paramsUsername } = this.props
    if (paramsUsername !== nextProps.paramsUsername) {
      dispatch(loadUserDetail(`~${nextProps.paramsUsername}`))
    }
  }

  shouldComponentUpdate(nextProps) {
    return shouldContainerUpdate(this.props, nextProps)
  }

  render() {
    const { activeUserFollowingType, dispatch, streamAction, tabs, user, viewKey } = this.props
    const { isLoggedIn, isSelf, isStreamFailing } = this.props
    const { hasSaidHelloTo, hasZeroFollowers, hasZeroPosts } = this.props
    const { coverDPI, coverImage, coverOffset, isCoverActive, isCoverHidden } = this.props
    const shouldBindHello = hasZeroPosts && !hasSaidHelloTo

    if (isStreamFailing) {
      return (
        <UserDetailError>
          <ErrorState4xx />
        </UserDetailError>
      )
    }
    if (!user) { return null }
    const props = {
      activeType: activeUserFollowingType,
      coverDPI,
      coverImage,
      coverOffset,
      isCoverActive,
      isCoverHidden,
      isLoggedIn,
      isSelf,
      hasSaidHelloTo,
      hasZeroFollowers,
      hasZeroPosts,
      onSubmitHello: shouldBindHello ? bindActionCreators(sayHello, dispatch) : null,
      onTabClick: isSelf && tabs ? bindActionCreators(setActiveUserFollowingType, dispatch) : null,
      streamAction,
      tabs,
      user,
    }
    return <UserDetail {...props} key={viewKey} />
  }
}

export default connect(mapStateToProps)(UserDetailContainer)

