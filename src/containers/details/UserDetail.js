import React, { Component, PropTypes } from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { findModel } from '../../helpers/json_helper'
import {
  loadUserDetail,
  loadUserLoves,
  loadUserPosts,
  loadUserUsers,
  loadUserFollowing,
} from '../../actions/user'
import { openAlert, closeAlert } from '../../actions/modals'
import { saveAvatar, saveCover } from '../../actions/profile'
import { setFollowingTab } from '../../actions/gui'
import Cover from '../../components/assets/Cover'
import Uploader from '../../components/uploaders/Uploader'
import { UserDetailHelmet } from '../../components/helmets/UserDetailHelmet'
import { ErrorState4xx } from '../../components/errors/Errors'
import StreamComponent from '../../components/streams/StreamComponent'
import { TabListButtons } from '../../components/tabs/TabList'
import UserList from '../../components/users/UserList'
import {
  ZeroStateCreateRelationship,
  ZeroStateFirstPost,
  ZeroStateSayHello,
} from '../../components/zeros/Zeros'

class UserDetail extends Component {
  static propTypes = {
    coverImageSize: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    followingTab: PropTypes.func,
    params: PropTypes.shape({
      type: PropTypes.string,
      username: PropTypes.string.isRequired,
    }).isRequired,
    omnibar: PropTypes.shape({
      isActive: PropTypes.bool,
    }),
    stream: PropTypes.shape({
      type: PropTypes.string,
      error: PropTypes.object,
    }),
    user: PropTypes.object,
    userFollowingTab: PropTypes.string,
  };

  static preRender = (store, routerState) => {
    const type = routerState.params.type || 'posts'
    const profileAction = loadUserDetail(`~${routerState.params.username}`)
    let streamAction
    switch (type) {
      case 'following':
        streamAction = loadUserFollowing(`~${routerState.params.username}`, 'friend')
        break
      case 'followers':
        streamAction = loadUserUsers(`~${routerState.params.username}`, type)
        break
      case 'loves':
        streamAction = loadUserLoves(`~${routerState.params.username}`, type)
        break
      default:
        streamAction = loadUserPosts(`~${routerState.params.username}`, type)
        break
    }
    return Promise.all([
      store.dispatch(profileAction),
      store.dispatch(streamAction),
    ])
  }

  componentWillMount() {
    const { dispatch, params } = this.props
    this.state = {
      madeFirstPost: false,
      saidHelloTo: false,
    }
    dispatch(loadUserDetail(`~${params.username}`))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params } = this.props
    if (params.username !== nextProps.params.username) {
      dispatch(loadUserDetail(`~${nextProps.params.username}`))
    }
  }

  onZeroStateHello() {
    this.setState({ saidHelloTo: true })
  }

  renderZeroStates(user) {
    const { isLoggedIn } = this.props
    const { saidHelloTo } = this.state
    if (!user) { return null }
    const cells = []
    if (!user.followersCount) {
      cells.push(<ZeroStateCreateRelationship key="zero1" user={ user } />)
    }
    if (isLoggedIn && !user.postsCount) {
      cells.push(
        <ZeroStateSayHello
          hasPosted={ saidHelloTo }
          key="zero2"
          onSubmit={ this.onZeroStateHello }
          user={ user }
        />
      )
    }
    return cells.length ? <div className="ZeroStates">{ cells }</div> : cells
  }

  renderZeroStatesForCurrentUser(user) {
    const cells = []
    if (!user.postsCount) {
      cells.push(
        <ZeroStateFirstPost
          key="zero3"
        />
      )
    }
    return cells.length ? <div className="ZeroStates">{ cells }</div> : cells
  }

  renderAvatarUploader() {
    const { dispatch } = this.props
    return (
      <Uploader
        className="UserDetailAvatarUploader"
        closeAlert={ bindActionCreators(closeAlert, dispatch) }
        message="Or drag & drop"
        openAlert={ bindActionCreators(openAlert, dispatch) }
        recommend="Recommended image size: 360 x 360"
        saveAction={ bindActionCreators(saveAvatar, dispatch) }
        title="Pick an Avatar"
      />
    )
  }

  render() {
    const {
      coverImageSize,
      coverOffset,
      dispatch,
      isLoggedIn,
      omnibar,
      params,
      stream,
      userFollowingTab,
      user,
    } = this.props

    const { followingTab } = this.props
    const type = params.type || 'posts'

    switch (stream.type) {
      case ACTION_TYPES.PROFILE.DETAIL_FAILURE:
        if (!user && stream.error) {
          return (
            <main className="UserDetail View" key={ `userDetail_${type}` } role="main">
              <section className="StreamComponent hasErrored">
                <ErrorState4xx />
              </section>
            </main>
          )
        }
        break
      default:
        break
    }
    const userEls = []
    if (user) {
      if (isLoggedIn && user.relationshipPriority === 'self') {
        userEls.push(
          <Uploader
            className="UserDetailCoverUploader"
            closeAlert={ bindActionCreators(closeAlert, dispatch) }
            key={ `userDetailUploader_${user.id}` }
            message="Or drag & drop"
            openAlert={ bindActionCreators(openAlert, dispatch) }
            recommend="Recommended image size: 2560 x 1440"
            saveAction={ bindActionCreators(saveCover, dispatch) }
            title="Upload a header image"
          />
        )
      }
      if (!omnibar.isActive) {
        userEls.push(
          <Cover
            isModifiable={ user.relationshipPriority === 'self' }
            coverImage={ user.coverImage }
            coverImageSize={ coverImageSize }
            coverOffset={ coverOffset }
            key={ `userDetailCover_${user.id}` }
            useGif
          />
        )
      }
      userEls.push(
        <UserList
          classList="asUserDetailHeader"
          key={ `userList_${user.id}` }
          showBlockMuteButton
          uploader={ user.relationshipPriority === 'self' && this.renderAvatarUploader() }
          useGif
          user={ user }
        />
      )
    }
    if (type === 'following') {
      if (isLoggedIn && get(user, 'relationshipPriority') === 'self') {
        const tabs = [
          { type: 'friend', children: 'Following' },
          { type: 'noise', children: 'Starred' },
        ]
        userEls.push(
          <TabListButtons
            className="LabelTabList"
            tabClasses="LabelTab"
            key={ `tabList_${user.id}` }
            activeType={ userFollowingTab }
            tabs={ tabs }
            onTabClick={ ({ type: tab }) => followingTab(tab) }
          />
        )
      }
    }
    let streamAction = null
    switch (type) {
      case 'following':
        streamAction = loadUserFollowing(`~${params.username}`, userFollowingTab)
        break
      case 'followers':
        streamAction = loadUserUsers(`~${params.username}`, type)
        break
      case 'loves':
        streamAction = loadUserLoves(`~${params.username}`, type)
        break
      default:
        streamAction = loadUserPosts(`~${params.username}`, type)
        break
    }
    const streamKey = `${params.username}${type === 'following' ? userFollowingTab : ''}`
    return (
      <main
        className={ classNames('UserDetail', 'View', omnibar.isActive ? 'OmnibarActive' : null) }
        key={ `userDetail_${type}` }
        role="main"
      >
        { user ? <UserDetailHelmet user={ user } /> : null }
        <div className="UserDetails">
          { userEls }
          { user && user.relationshipPriority === 'self' ?
            this.renderZeroStatesForCurrentUser(user) :
            this.renderZeroStates(user)
          }
          {
            user ?
              <StreamComponent
                action={ streamAction }
                key={ streamKey }
                ref="streamComponent"
                isUserDetail
              /> :
              null
          }
        </div>
      </main>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { gui, json } = state
  const { params } = ownProps
  const user = findModel(json, {
    collection: MAPPING_TYPES.USERS,
    findObj: { username: params.username },
  })
  return {
    coverImageSize: gui.coverImageSize,
    coverOffset: gui.coverOffset,
    omnibar: state.omnibar,
    isLoggedIn: state.authentication.isLoggedIn,
    userFollowingTab: get(state, 'gui.userFollowingTab'),
    params,
    user,
    stream: state.stream,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    followingTab: bindActionCreators(setFollowingTab, dispatch),
    dispatch,
  }
}
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(UserDetail)

