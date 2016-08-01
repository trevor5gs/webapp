import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { getElloPlatform } from '../../vendor/jello'
import Avatar from '../assets/Avatar'
import { openModal, closeModal } from '../../actions/modals'
import { trackEvent } from '../../actions/tracking'
import { MiniPillButton } from '../buttons/Buttons'
import MessageDialog from '../dialogs/MessageDialog'
import ShareDialog from '../dialogs/ShareDialog'
import { ShareIcon } from '../users/UserIcons'
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
    isHirable: PropTypes.bool,
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

  onClickHireMe = () => {
    const { dispatch, user } = this.props
    dispatch(openModal(
      <MessageDialog
        name={`${user.name ? user.name : user.username}`}
        onConfirm={this.onConfirmHireMe}
        onDismiss={this.onDismissModal}
      />
    ))
    dispatch(trackEvent('open-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  // TODO: Wire this up to an action / api etc.
  onConfirmHireMe = ({ subject, message }) => {
    const { dispatch } = this.props
    // dispatch(sendMessage(subject, message))
    // console.log('subject:', subject, 'message:', message)
    dispatch(trackEvent('send-hire-dialog-profile', { platform: getElloPlatform() }))
    // just appeasing the linter
    const stuff = { subject, message }
    return stuff
  }

  onDismissModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  render() {
    const { classList, followingCount, followersCount, isHirable, lovesCount, relationshipPriority,
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
        {isHirable ?
          <div className="ProfileButtons">
            <MiniPillButton onClick={this.onClickHireMe} >
              Hire Me
            </MiniPillButton>
            <button className="ProfileButtonsShareButton" onClick={this.onClickShareProfile} >
              <ShareIcon />
            </button>
          </div>
          :
          <div className="ProfileButtons">
            <MiniPillButton onClick={this.onClickShareProfile} >
              Share Profile
            </MiniPillButton>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const user = state.json.users[ownProps.user.id]
  return {
    followingCount: user.followingCount,
    followersCount: user.followersCount,
    isHirable: true,
    isLoggedIn: state.authentication.isLoggedIn,
    lovesCount: user.lovesCount,
    relationshipPriority: user.relationshipPriority,
    postsCount: user.postsCount,
    user,
    username: user.username,
  }
}

export default connect(mapStateToProps)(UserList)

