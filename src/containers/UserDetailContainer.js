import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import { USER } from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectActiveUserFollowingType, selectHasSaidHelloTo } from '../selectors/gui'
import { selectParamsType, selectParamsUsername } from '../selectors/params'
import { selectStreamType } from '../selectors/stream'
import {
  selectUserFollowersCount,
  selectUserId,
  selectUserIsEmpty,
  selectUserIsSelf,
  selectUserPostsCount,
} from '../selectors/user'
import { setActiveUserFollowingType } from '../actions/gui'
import { sayHello } from '../actions/zeros'
import {
  loadUserDetail, loadUserLoves, loadUserPosts, loadUserUsers, loadUserFollowing,
} from '../actions/user'
import { ErrorState4xx } from '../components/errors/Errors'
import { UserDetail, UserDetailError } from '../components/views/UserDetail'


const emptyTabs = []
const followingTabs = [
  { type: 'friend', children: 'Following' },
  { type: 'noise', children: 'Starred' },
]

export function getStreamAction({ activeUserFollowingType, type = 'posts', username }) {
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
    getStreamAction({ activeUserFollowingType, type, username }),
)

export function mapStateToProps(state, props) {
  const activeUserFollowingType = selectActiveUserFollowingType(state)
  const type = selectParamsType(state, props) || 'posts'
  const isSelf = selectUserIsSelf(state, props)
  const isUserEmpty = selectUserIsEmpty(state, props)
  const username = selectParamsUsername(state, props)
  const hasSaidHelloTo = !isUserEmpty ? !isSelf && selectHasSaidHelloTo(state, props) : false
  const keyPostfix = isSelf && activeUserFollowingType ? `/${activeUserFollowingType}` : ''
  return {
    activeUserFollowingType,
    hasSaidHelloTo,
    hasZeroFollowers: !(selectUserFollowersCount(state, props)),
    hasZeroPosts: !(selectUserPostsCount(state, props)),
    id: selectUserId(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    isPostHeaderHidden: type !== 'loves',
    isSelf,
    isUserEmpty,
    streamAction: selectUserDetailStreamAction(state, props),
    streamType: selectStreamType(state),
    tabs: isSelf && type === 'following' ? followingTabs : emptyTabs,
    username,
    viewKey: `userDetail/${username}/${type}${keyPostfix}`,
  }
}

class UserDetailContainer extends Component {
  static propTypes = {
    activeUserFollowingType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasSaidHelloTo: PropTypes.bool.isRequired,
    hasZeroFollowers: PropTypes.bool.isRequired,
    hasZeroPosts: PropTypes.bool.isRequired,
    id: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    isPostHeaderHidden: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isUserEmpty: PropTypes.bool.isRequired,
    streamAction: PropTypes.object.isRequired,
    streamType: PropTypes.string, // eslint-disable-line
    tabs: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    viewKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    id: null,
    streamType: null,
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
    const { dispatch, username } = this.props
    this.state = { renderType: USER.DETAIL_REQUEST }
    dispatch(loadUserDetail(`~${username}`))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, username } = this.props
    if (username !== nextProps.username) {
      dispatch(loadUserDetail(`~${nextProps.username}`))
    }
    switch (nextProps.streamType) {
      case USER.DETAIL_FAILURE:
      case USER.DETAIL_REQUEST:
      case USER.DETAIL_SUCCESS:
        this.setState({ renderType: nextProps.streamType })
        break
      default:
        break
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.renderType !== this.state.renderType) { return true }
    return [
      'activeUserFollowingType',
      'hasSaidHelloTo',
      'hasZeroFollowers',
      'hasZeroPosts',
      'id',
      'isLoggedIn',
      'isPostHeaderHidden',
      'isSelf',
      'isUserEmpty',
      'streamAction',
      'tabs',
      'username',
      'viewKey',
    ].some(prop => nextProps[prop] !== this.props[prop])
  }

  render() {
    const {
      activeUserFollowingType,
      dispatch,
      hasSaidHelloTo,
      hasZeroFollowers,
      hasZeroPosts,
      id,
      isLoggedIn,
      isPostHeaderHidden,
      isSelf,
      isUserEmpty,
      streamAction,
      tabs,
      username,
      viewKey,
    } = this.props
    const { renderType } = this.state
    const shouldBindHello = hasZeroPosts && !hasSaidHelloTo

    // render failure if we don't have an initial user
    if (isUserEmpty) {
      if (renderType === USER.DETAIL_FAILURE) {
        return (
          <UserDetailError>
            <ErrorState4xx />
          </UserDetailError>
        )
      }
      return null
    }
    // TODO: Move functions out of props and into context
    const props = {
      activeType: activeUserFollowingType,
      hasSaidHelloTo,
      hasZeroFollowers,
      hasZeroPosts,
      isLoggedIn,
      isPostHeaderHidden,
      isSelf,
      onSubmitHello: shouldBindHello ? bindActionCreators(sayHello, dispatch) : null,
      onTabClick: isSelf && tabs ? bindActionCreators(setActiveUserFollowingType, dispatch) : null,
      streamAction,
      tabs,
      userId: id,
      username,
    }
    return <UserDetail {...props} key={viewKey} />
  }
}

export default connect(mapStateToProps)(UserDetailContainer)

