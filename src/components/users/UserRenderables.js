import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import BackgroundImage from '../assets/BackgroundImage'
import Hint from '../hints/Hint'
import { loadUserDrawer } from '../../actions/user'
import RelationshipContainer from '../../containers/RelationshipContainer'
import StreamContainer from '../../containers/StreamContainer'
import {
  UserFeaturedButton,
  UserFiguresCell,
  UserInfoCell,
  UserLinksCell,
  UserNamesCell,
  UserNamesCellCard,
  UserProfileButtons,
  UserStatsCell,
} from './UserParts'

// -------------------------------------

export const UserAvatar = ({ user }) =>
  <Link className="UserAvatar" to={`/${user.username}`}>
    <Avatar
      priority={user.relationshipPriority}
      sources={user.avatar}
      userId={`${user.id}`}
      username={user.username}
    />
    <Hint>{`@${user.username}`}</Hint>
  </Link>

UserAvatar.propTypes = {
  user: PropTypes.object,
}

// -----------------

export const UserCompact = ({ user }) =>
  <div className="UserCompact">
    <div className="UserCompactHeader">
      <Link className="UserCompactUserLink truncate" to={`/${user.username}`}>
        <Avatar
          priority={user.relationshipPriority}
          sources={user.avatar}
          userId={`${user.id}`}
          username={user.username}
        />
        <span className="UserCompactUsername">{`@${user.username}`}</span>
      </Link>
    </div>
    <RelationshipContainer
      relationshipPriority={user.relationshipPriority}
      user={user}
    />
  </div>

UserCompact.propTypes = {
  user: PropTypes.object,
}

// -----------------

export const UserDrawer = ({ endpoint, icon, post, resultType }) =>
  <section className="UserDrawer">
    {icon}
    <StreamContainer
      action={loadUserDrawer(endpoint, post, resultType)}
      paginatorText="+more"
      ignoresScrollPosition
    />
  </section>

UserDrawer.propTypes = {
  endpoint: PropTypes.object.isRequired,
  icon: PropTypes.element.isRequired,
  post: PropTypes.object.isRequired,
  resultType: PropTypes.string.isRequired,
}

// -----------------

export const UserProfileCard = ({
  isMobile,
  onClickCollab,
  onClickHireMe,
  onClickOpenFeaturedModal,
  truncatedShortBio,
  user,
}) =>
  <div className="UserProfileCard" >
    <Avatar
      className="inUserProfileCard"
      priority={user.relationshipPriority}
      size={isMobile ? 'regular' : 'large'}
      sources={user.avatar}
      to={`/${user.username}`}
      userId={`${user.id}`}
      username={user.username}
    />
    <UserProfileButtons
      className="inUserProfileCard"
      onClickCollab={user.isCollaborateable ? onClickCollab : null}
      onClickHireMe={user.isHireable ? onClickHireMe : null}
    >
      <RelationshipContainer
        className="isPill inUserProfileCard"
        relationshipPriority={user.relationshipPriority}
        user={user}
      />
    </UserProfileButtons>
    <UserNamesCellCard
      className="inUserProfileCard"
      name={user.name}
      username={user.username}
    />
    <UserStatsCell
      className="inUserProfileCard"
      followingCount={user.followingCount}
      followersCount={user.followersCount}
      lovesCount={user.lovesCount}
      postsCount={user.postsCount}
      username={user.username}
    />
    { !isMobile ?
      <UserInfoCell
        className="inUserProfileCard"
        truncatedShortBio={truncatedShortBio}
      /> : null
    }
    <BackgroundImage
      className="hasOverlay6 inUserProfileCard"
      sources={user.coverImage}
      to={`/${user.username}`}
    />
    { onClickOpenFeaturedModal ?
      <UserFeaturedButton className="inUserProfileCard" onClick={onClickOpenFeaturedModal} />
      : null
    }
  </div>

UserProfileCard.propTypes = {
  isMobile: PropTypes.bool,
  onClickCollab: PropTypes.func,
  onClickHireMe: PropTypes.func,
  onClickOpenFeaturedModal: PropTypes.func,
  truncatedShortBio: PropTypes.string,
  user: PropTypes.object,
}

// -----------------

export const UserProfile = ({
  isLoggedIn,
  isMobile,
  onClickCollab,
  onClickHireMe,
  onClickOpenBio,
  onClickOpenFeaturedModal,
  onClickShareProfile,
  truncatedShortBio,
  user,
}) =>
  <div className="UserProfile">
    <Avatar
      alt={user.name ? user.name : user.username}
      className="inUserProfile"
      priority={user.relationshipPriority}
      size="large"
      sources={user.avatar}
      useGif={(user.viewsAdultContent || !user.postsAdultContent)}
      userId={`${user.id}`}
      username={user.username}
    />
    <UserNamesCell
      className="inUserProfile"
      name={user.name}
      username={user.username}
    >
      {isLoggedIn && user.relationshipPriority !== 'self' ?
        <RelationshipContainer
          hasBlockMuteButton
          className="inUserProfile"
          relationshipPriority={user.relationshipPriority}
          user={user}
        /> : null
      }
    </UserNamesCell>
    {user.totalPostViewsCount && parseInt(user.totalPostViewsCount, 10) > 0 ?
      <UserFiguresCell
        className="inUserProfile"
        onClickOpenFeaturedModal={onClickOpenFeaturedModal}
        onClickShareProfile={onClickShareProfile}
        totalPostViewsCount={user.totalPostViewsCount}
      /> : null
    }
    <UserStatsCell
      className="inUserProfile"
      followersCount={user.followersCount}
      followingCount={user.followingCount}
      lovesCount={user.lovesCount}
      postsCount={user.postsCount}
      username={user.username}
    />
    <UserInfoCell
      className="inUserProfile"
      location={user.location}
      onClickOpenBio={onClickOpenBio}
      truncatedShortBio={truncatedShortBio}
    />
    <UserLinksCell
      className="inUserProfile"
      externalLinksList={user.externalLinksList}
      isMobile={isMobile}
    />
    <UserProfileButtons
      className="inUserProfile"
      onClickCollab={user.isCollaborateable ? onClickCollab : null}
      onClickHireMe={user.isHireable ? onClickHireMe : null}
    >
      <RelationshipContainer
        className="isPill inUserProfile"
        relationshipPriority={user.relationshipPriority}
        user={user}
      />
    </UserProfileButtons>
  </div>

UserProfile.propTypes = {
  isLoggedIn: PropTypes.bool,
  isMobile: PropTypes.bool,
  onClickCollab: PropTypes.func,
  onClickHireMe: PropTypes.func,
  onClickOpenBio: PropTypes.func,
  onClickOpenFeaturedModal: PropTypes.func,
  onClickShareProfile: PropTypes.func,
  truncatedShortBio: PropTypes.string,
  user: PropTypes.object,
}

