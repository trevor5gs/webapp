import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { numberToHuman } from '../../vendor/number_to_human'

export const UserNames = ({ user }) =>
  <div className="UserNames">
    <h2 className="UserUsername">
      <Link to={ `/${user.username}` } >@{user.username}</Link>
    </h2>
    <h3 className="UserName">{user.name}</h3>
  </div>

UserNames.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
}

const UserStatsLink = ({ asDisabled = false, children, to }) =>
  asDisabled ?
    <span activeClassName="active" className="UserStatsLink asDisabled">
      { children }
    </span> :
    <Link activeClassName="active" className="UserStatsLink" to={ to }>
      { children }
    </Link>

export const UserStats = ({ user }) =>
  <div className="UserStats">
    <dl>
      <UserStatsLink to={`/${user.username}`}>
        <dt>{ numberToHuman(user.postsCount) }</dt>
        <dd>Posts</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={ !user.followingCount } to={`/${user.username}/following`}>
        <dt>{ numberToHuman(user.followingCount) }</dt>
        <dd>Following</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink
        asDisabled={ typeof user.followersCount === 'string' || !user.followersCount }
        to={`/${user.username}/followers`}
      >
        <dt>
          {
            typeof user.followersCount === 'string' ?
              user.followersCount :
              numberToHuman(user.followersCount)
          }
        </dt>
        <dd>Followers</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={ !user.lovesCount } to={`/${user.username}/loves`} >
        <dt>{ numberToHuman(user.lovesCount) }</dt>
        <dd>Loves</dd>
      </UserStatsLink>
    </dl>
  </div>

UserStats.propTypes = {
  user: PropTypes.shape({
    followingCount: PropTypes.number.isRequired,
    followersCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    followersCountRounded: PropTypes.string.isRequired,
    lovesCount: PropTypes.number.isRequired,
    postsCount: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
}

export const LoggedOutUserStats = ({ user }) =>
  <div className="UserStats">
    <dl>
      <UserStatsLink asDisabled >
        <dt>{ numberToHuman(user.postsCount) }</dt>
        <dd>Posts</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled >
        <dt>{ numberToHuman(user.followingCount) }</dt>
        <dd>Following</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled >
        <dt>
          {
            typeof user.followersCount === 'string' ?
              user.followersCount :
              numberToHuman(user.followersCount)
          }
        </dt>
        <dd>Followers</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled >
        <dt>{ numberToHuman(user.lovesCount) }</dt>
        <dd>Loves</dd>
      </UserStatsLink>
    </dl>
  </div>

LoggedOutUserStats.propTypes = {
  user: PropTypes.shape({
    followersCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    lovesCountRounded: PropTypes.string.isRequired,
  }).isRequired,
}

export const UserInfo = ({ user }) => {
  let externalLinks = []
  if (user.externalLinksList) {
    externalLinks = user.externalLinksList.map((link, i) =>
      <a href={link.url} target="_blank" key={i} >{link.text}</a>
    )
  }
  return (
    <div className="UserInfo">
      <div className="UserShortBio" dangerouslySetInnerHTML={{ __html: user.formattedShortBio }} />
      <p className="UserExternalLinks">
        {externalLinks}
      </p>
    </div>
  )
}

UserInfo.propTypes = {
  user: PropTypes.shape({
    externalLinksList: PropTypes.array,
    formattedShortBio: PropTypes.string,
  }).isRequired,
}

