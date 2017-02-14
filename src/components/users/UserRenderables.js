/* eslint-disable react/no-multi-comp */
import React, { PropTypes, PureComponent } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import BackgroundImage from '../assets/BackgroundImage'
import { ShareIcon } from '../assets/Icons'
import Hint from '../hints/Hint'
import { loadUserDrawer } from '../../actions/user'
import RelationshipContainer from '../../containers/RelationshipContainer'
import StreamContainer from '../../containers/StreamContainer'
import {
  UserFeaturedButton,
  UserFiguresCell,
  UserInfoCell,
  UserLinksCell,
  UserLocationCell,
  UserNamesCell,
  UserNamesCellCard,
  UserProfileButtons,
  UserStatsCell,
} from './UserParts'

// -------------------------------------

// TODO: Does this belong here? It's rendered by PostContainer and not UserContainer
export const UserDrawer = ({ endpoint, icon, postId, resultType }) =>
  <section className="UserDrawer">
    {icon}
    <StreamContainer
      action={loadUserDrawer(endpoint, postId, resultType)}
      paginatorText="+more"
      ignoresScrollPosition
    />
  </section>
UserDrawer.propTypes = {
  endpoint: PropTypes.object.isRequired,
  icon: PropTypes.element.isRequired,
  postId: PropTypes.string.isRequired,
  resultType: PropTypes.string.isRequired,
}

// -----------------

export class UserAvatar extends PureComponent {
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    relationshipPriority: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }
  render() {
    const { avatar, id, relationshipPriority, username } = this.props
    return (
      <Link className="UserAvatar" to={`/${username}`}>
        <Avatar
          priority={relationshipPriority}
          sources={avatar}
          userId={id}
          username={username}
        />
        <Hint>{`@${username}`}</Hint>
      </Link>
    )
  }
}

// -----------------

export class UserCompact extends PureComponent {
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    relationshipPriority: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }
  render() {
    const { avatar, id, relationshipPriority, username } = this.props
    return (
      <div className="UserCompact">
        <div className="UserCompactHeader">
          <Link className="UserCompactUserLink truncate" to={`/${username}`}>
            <Avatar
              priority={relationshipPriority}
              sources={avatar}
              userId={id}
              username={username}
            />
            <span className="UserCompactUsername">{`@${username}`}</span>
          </Link>
        </div>
        <RelationshipContainer relationshipPriority={relationshipPriority} userId={id} />
      </div>
    )
  }
}

// -----------------

export class UserProfileCard extends PureComponent {
  static contextTypes = {
    onClickCollab: PropTypes.func,
    onClickHireMe: PropTypes.func,
    onClickOpenFeaturedModal: PropTypes.func,
  }
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    coverImage: PropTypes.object.isRequired,
    followersCount: PropTypes.number.isRequired,
    followingCount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    lovesCount: PropTypes.number.isRequired,
    name: PropTypes.string,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string.isRequired,
    truncatedShortBio: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }
  static defaultProps = {
    name: null,
  }
  render() {
    const { onClickCollab, onClickHireMe, onClickOpenFeaturedModal } = this.context
    const {
      avatar,
      coverImage,
      followersCount,
      followingCount,
      id,
      isMobile,
      lovesCount,
      name,
      postsCount,
      relationshipPriority,
      truncatedShortBio,
      username,
    } = this.props
    return (
      <div className="UserProfileCard" >
        <Avatar
          className="inUserProfileCard"
          priority={relationshipPriority}
          size={isMobile ? 'regular' : 'large'}
          sources={avatar}
          to={`/${username}`}
          userId={id}
          username={username}
        />
        <UserProfileButtons
          className="inUserProfileCard"
          onClickCollab={onClickCollab}
          onClickHireMe={onClickHireMe}
        >
          <RelationshipContainer
            className="isPill inUserProfileCard"
            relationshipPriority={relationshipPriority}
            userId={id}
          />
        </UserProfileButtons>
        <UserNamesCellCard
          className="inUserProfileCard"
          name={name}
          username={username}
        />
        <UserStatsCell
          className="inUserProfileCard"
          followingCount={followingCount}
          followersCount={followersCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        { !isMobile &&
          <UserInfoCell
            className="inUserProfileCard"
            truncatedShortBio={truncatedShortBio}
          />
        }
        <BackgroundImage
          className="hasOverlay6 inUserProfileCard"
          dpi={'xhdpi'}
          sources={coverImage}
          to={`/${username}`}
        />
        { onClickOpenFeaturedModal &&
          <UserFeaturedButton
            className="inUserProfileCard"
            onClick={onClickOpenFeaturedModal}
          />
        }
      </div>
    )
  }
}
// -----------------

export class UserProfile extends PureComponent {
  static contextTypes = {
    onClickCollab: PropTypes.func,
    onClickHireMe: PropTypes.func,
    onClickOpenBio: PropTypes.func,
    onClickOpenFeaturedModal: PropTypes.func,
    onClickShareProfile: PropTypes.func.isRequired,
  }
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    externalLinksList: PropTypes.object,
    followersCount: PropTypes.number.isRequired,
    followingCount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isCollaborateable: PropTypes.bool.isRequired,
    isHireable: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    location: PropTypes.string,
    lovesCount: PropTypes.number.isRequired,
    name: PropTypes.string,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string.isRequired,
    totalPostViewsCount: PropTypes.string,
    truncatedShortBio: PropTypes.string.isRequired,
    useGif: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
  }

  static defaultProps = {
    externalLinksList: null,
    location: null,
    name: null,
    totalPostViewsCount: null,
  }

  render() {
    const {
      onClickCollab,
      onClickHireMe,
      onClickOpenBio,
      onClickOpenFeaturedModal,
      onClickShareProfile,
    } = this.context
    const {
      avatar,
      externalLinksList,
      followersCount,
      followingCount,
      id,
      isCollaborateable,
      isHireable,
      isLoggedIn,
      isMobile,
      isSelf,
      location,
      lovesCount,
      name,
      postsCount,
      relationshipPriority,
      totalPostViewsCount,
      truncatedShortBio,
      useGif,
      username,
    } = this.props
    return (
      <div className="UserProfile">
        <Avatar
          alt={name || username}
          className="inUserProfile"
          priority={relationshipPriority}
          size="large"
          sources={avatar}
          useGif={useGif}
          userId={id}
          username={username}
        />
        <UserNamesCell
          className="inUserProfile"
          name={name}
          username={username}
        >
          {onClickOpenFeaturedModal && !totalPostViewsCount &&
            <UserFeaturedButton
              className="inUserProfile withoutTotalViewCount"
              onClick={onClickOpenFeaturedModal}
            />
          }
          {isLoggedIn && !isSelf ?
            <RelationshipContainer
              hasBlockMuteButton
              className="inUserProfile"
              relationshipPriority={relationshipPriority}
              userId={id}
            /> : null
          }
        </UserNamesCell>
        {totalPostViewsCount ?
          <UserFiguresCell
            className="inUserProfile"
            onClickOpenFeaturedModal={onClickOpenFeaturedModal}
            onClickShareProfile={onClickShareProfile}
            totalPostViewsCount={totalPostViewsCount}
          /> :
          <button className="UserFiguresShareButton withoutTotalViewCount" onClick={onClickShareProfile} >
            <ShareIcon />
          </button>
        }
        <UserStatsCell
          className="inUserProfile"
          followersCount={followersCount}
          followingCount={followingCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        <UserLocationCell
          className="inUserProfile"
          location={location}
        />
        <UserInfoCell
          className="inUserProfile"
          onClickOpenBio={onClickOpenBio}
          truncatedShortBio={truncatedShortBio}
        />
        <UserLinksCell
          className="inUserProfile"
          externalLinksList={externalLinksList}
          isMobile={isMobile}
        />
        <UserProfileButtons
          className="inUserProfile"
          onClickCollab={isCollaborateable ? onClickCollab : null}
          onClickHireMe={isHireable ? onClickHireMe : null}
        >
          <RelationshipContainer
            className="isPill inUserProfile"
            relationshipPriority={relationshipPriority}
            userId={id}
          />
        </UserProfileButtons>
      </div>
    )
  }
}

