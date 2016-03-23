import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { findModel } from '../../components/base/json_helper'
import { loadUserDetail, loadUserLoves, loadUserPosts, loadUserUsers } from '../../actions/user'
import { openAlert, closeAlert } from '../../actions/modals'
import { saveAvatar, saveCover } from '../../actions/profile'
import Cover from '../../components/assets/Cover'
import Uploader from '../../components/uploaders/Uploader'
import { UserDetailHelmet } from '../../components/helmets/UserDetailHelmet'
import { ErrorState4xx } from '../../components/errors/Errors'
import StreamComponent from '../../components/streams/StreamComponent'
import UserList from '../../components/users/UserList'
import {
  ZeroStateCreateRelationship,
  ZeroStateFirstPost,
  ZeroStateSayHello,
} from '../../components/zeros/Zeros'

class UserDetail extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    json: PropTypes.object.isRequired,
    params: PropTypes.shape({
      type: PropTypes.string,
      username: PropTypes.string.isRequired,
    }).isRequired,
    stream: PropTypes.shape({
      type: PropTypes.string,
      error: PropTypes.object,
    }),
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadUserDetail(`~${routerState.params.username}`))

  componentWillMount() {
    const { dispatch, params } = this.props
    this.state = {
      madeFirstPost: false,
      saidHelloTo: false,
    }
    dispatch(loadUserDetail(`~${params.username}`))
  }

  onZeroStateHello = () => {
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
        message="Or drag & drop it"
        openAlert={ bindActionCreators(openAlert, dispatch) }
        recommend="Recommended image size: 360 x 360"
        saveAction={ bindActionCreators(saveAvatar, dispatch) }
        title="Pick an Avatar"
      />
    )
  }

  render() {
    const { dispatch, isLoggedIn, json, params, stream } = this.props
    const type = params.type || 'posts'

    const user = findModel(json, {
      collection: MAPPING_TYPES.USERS,
      findObj: { username: params.username },
    })
    switch (stream.type) {
      case ACTION_TYPES.PROFILE.DETAIL_FAILURE:
        if (!user && stream.error) {
          return (
            <section className="Panel" key={ `userDetail_${type}` }>
              <section className="StreamComponent hasErrored">
                <ErrorState4xx />
              </section>
            </section>
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
      userEls.push(
        <Cover
          isModifiable={ user.relationshipPriority === 'self' }
          coverImage={ user.coverImage }
          key={ `userDetailCover_${user.id}` }
        />
      )
      userEls.push(
        <UserList
          classList="asUserDetailHeader"
          key={ `userList_${user.id}` }
          showBlockMuteButton
          uploader={ user.relationshipPriority === 'self' && this.renderAvatarUploader() }
          user={ user }
        />
      )
    }
    let streamAction = null
    switch (type) {
      case 'following':
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
    return (
      <section className="UserDetail Panel" key={ `userDetail_${type}` }>
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
                key={ params.username }
                ref="streamComponent"
                isUserDetail
              /> :
              null
          }
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    json: state.json,
    isLoggedIn: state.authentication.isLoggedIn,
    stream: state.stream,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(UserDetail)

