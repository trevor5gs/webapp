import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import { openModal } from '../../actions/modals'
import { trackEvent } from '../../actions/tracking'
import ShareProfileButton from './ShareProfileButton'
import ShareDialog from '../dialogs/ShareDialog'
import { UserNames, UserStats, UserInfo } from '../users/UserVitals'
import RelationshipContainer from '../../containers/RelationshipContainer'

class UserList extends Component {

  static propTypes = {
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    followingCount: PropTypes.number.isRequired,
    followersCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    isLoggedIn: PropTypes.bool,
    lovesCount: PropTypes.number.isRequired,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    showBlockMuteButton: PropTypes.bool,
    uploader: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    useGif: PropTypes.bool,
    user: PropTypes.shape({
    }).isRequired,
    username: PropTypes.string.isRequired,
  }

  static defaultProps = {
    classList: '',
    showBlockMuteButton: false,
    useGif: false,
  }

  shouldComponentUpdate(nextProps) {
    if (_.isEqual(nextProps, this.props)) {
      return false
    }
    return true
  }

  onClickShareProfile = () => {
    const { dispatch, user } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog user={user} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  render() {
    const { classList, followingCount, followersCount, lovesCount, relationshipPriority,
      postsCount, showBlockMuteButton, uploader, useGif, user, username } = this.props
    const userPath = `/${user.username}`
    const isModifiable = uploader ? true : undefined
    return (
      <div className={classNames(classList, 'UserList')}>
        {uploader}
        <Avatar
          className="isLarge"
          isModifiable={isModifiable}
          priority={!isModifiable && relationshipPriority ? relationshipPriority : null}
          size="large"
          sources={user.avatar}
          to={isModifiable ? null : userPath}
          useGif={useGif && (user.viewsAdultContent || !user.postsAdultContent)}
          userId={!isModifiable ? `${user.id}` : null}
          username={!isModifiable ? user.username : null}
        />
        <RelationshipContainer
          hasBlockMuteButton={showBlockMuteButton}
          relationshipPriority={relationshipPriority}
          user={user}
        />
        <UserNames user={user} />
        <UserStats
          followingCount={followingCount}
          followersCount={followersCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        <UserInfo user={user} />
        <ShareProfileButton onClick={this.onClickShareProfile} >
          Share Profile
        </ShareProfileButton>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const user = state.json.users[ownProps.user.id]
  return {
    followingCount: user.followingCount,
    followersCount: user.followersCount,
    isLoggedIn: state.authentication.isLoggedIn,
    lovesCount: user.lovesCount,
    relationshipPriority: user.relationshipPriority,
    postsCount: user.postsCount,
    user,
    username: user.username,
  }
}

export default connect(mapStateToProps)(UserList)

