import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { findBy } from '../../components/base/json_helper'
import { loadUserDetail, loadUserLoves, loadUserPosts, loadUserUsers } from '../../actions/user'
import Cover from '../../components/assets/Cover'
import { UserDetailHelmet } from '../../components/helmets/UserDetailHelmet'
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
  };

  componentWillMount() {
    const { dispatch, params } = this.props
    this.state = {
      madeFirstPost: false,
      saidHelloTo: false,
    }
    dispatch(loadUserDetail(`~${params.username}`))
  }

  componentDidMount() {
    // Calculate the cover height (ResizeComponent isn't initialized yet)
    const offset = Math.round((window.innerWidth * 0.5625)) - 200
    window.scrollTo(0, offset)
  }

  onZeroStateHello = () => {
    this.setState({ saidHelloTo: true })
  };

  onZeroStateFirstPost = () => {
    this.setState({ madeFirstPost: true })
  };

  static preRender = (store, routerState) =>
    store.dispatch(loadUserDetail(`~${routerState.params.username}`));

  findModel(json, initModel) {
    if (!initModel || !initModel.findObj || !initModel.collection) {
      return null
    }
    return findBy(initModel.findObj, initModel.collection, json)
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
    const { madeFirstPost } = this.state
    const cells = []
    if (!user.postsCount) {
      cells.push(
        <ZeroStateFirstPost
          hasPosted={ madeFirstPost }
          key="zero3"
          onSubmit={ this.onZeroStateFirstPost }
        />
      )
    }
    return cells.length ? <div className="ZeroStates">{ cells }</div> : cells
  }

  render() {
    const { json, params } = this.props
    const type = params.type || 'posts'
    const user = this.findModel(json, {
      collection: MAPPING_TYPES.USERS,
      findObj: { username: params.username },
    })
    const userEls = []
    if (user) {
      userEls.push(<Cover coverImage={ user.coverImage } key={ `userDetailCover_${user.id}` } />)
      userEls.push(<UserList
        classList="asUserDetailHeader"
        key={ `userList_${user.id}` }
        user={ user }
        showBlockMuteButton
      />)
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
        { user ? <UserDetailHelmet user={ user }/> : null }
        <div className="UserDetails">
          { userEls }
          { user && user.relationshipPriority === 'self' ?
            this.renderZeroStatesForCurrentUser(user) :
            this.renderZeroStates(user)
          }
          <StreamComponent
            action={ streamAction }
            key={ params.username }
            ref="streamComponent"
          />
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    json: state.json,
    isLoggedIn: state.authentication.isLoggedIn,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(UserDetail)

