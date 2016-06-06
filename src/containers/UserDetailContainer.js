import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEqual } from 'lodash'
import { findModel } from '../helpers/json_helper'
import { PROFILE } from '../constants/action_types'
import { USERS } from '../constants/mapping_types'
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
    const { type = 'posts', username } = routerState
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
    if (!nextProps.user) { return false }
    return !isEqual(this.props, nextProps)
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

export function mapStateToProps(state, ownProps) {
  const { authentication, gui, json, modal, stream } = state
  const { params } = ownProps
  const { type = 'posts', username } = params

  const activeUserFollowingType = gui.activeUserFollowingType
  const isLoggedIn = authentication.isLoggedIn
  const user = findModel(json, { collection: USERS, findObj: { username } })
  const isSelf = isLoggedIn && user ? user.relationshipPriority === 'self' : false
  const keyPostfix = isSelf && activeUserFollowingType ? `/${activeUserFollowingType}` : ''

  return {
    activeUserFollowingType,
    coverDPI: gui.coverDPI,
    coverImage: user && user.coverImage ? user.coverImage : null,
    coverOffset: gui.coverOffset,
    isCoverActive: !modal.isOmnibarActive,
    isCoverHidden: gui.isCoverHidden,
    isLoggedIn,
    isSelf,
    isStreamFailing: stream.type === PROFILE.DETAIL_FAILURE && stream.error && !user,
    hasZeroFollowers: user ? user.followersCount < 1 : false,
    hasZeroPosts: user ? user.postsCount < 1 : false,
    hasSaidHelloTo: user ? modal.saidHelloTo.indexOf(user.username) !== -1 && !isSelf : false,
    paramsType: type,
    paramsUsername: username,
    streamAction: getStreamAction({ activeUserFollowingType, type, username }),
    tabs: isSelf && type === 'following' ? followingTabs : null,
    user,
    viewKey: `userDetail/${username}/${type}${keyPostfix}`,
  }
}

export default connect(mapStateToProps)(UserDetailContainer)

