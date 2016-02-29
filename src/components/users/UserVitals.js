import React, { PropTypes } from 'react'
import { Link } from 'react-router'

export const UserNames = ({ user }) =>
  <div className="UserNames">
    <h2 className="UserUsername">
      <Link to={ `/${user.username}` } >@{user.username}</Link>
    </h2>
    <h3 className="UserName">{user.name}</h3>
  </div>

UserNames.propTypes = {
  user: PropTypes.shape({}).isRequired,
}


const UserStatsLink = ({ asDisabled = false, children, to }) => {
  if (asDisabled) {
    return (
      <span activeClassName="active" className="UserStatsLink asDisabled">
        { children }
      </span>
    )
  }
  return (
    <Link activeClassName="active" className="UserStatsLink" to={ to }>
      { children }
    </Link>
  )
}

export const UserStats = ({ user }) =>
  <div className="UserStats">
    <dl>
      <UserStatsLink to={`/${user.username}`}>
        <dt>{user.postsCount}</dt>
        <dd>Posts</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={ !user.followingCount } to={`/${user.username}/following`}>
        <dt>{user.followingCount}</dt>
        <dd>Following</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={ !user.followersCount } to={`/${user.username}/followers`}>
        <dt>{user.followersCount}</dt>
        <dd>Followers</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={ !user.lovesCount } to={`/${user.username}/loves`} >
        <dt>{user.lovesCount}</dt>
        <dd>Loves</dd>
      </UserStatsLink>
    </dl>
  </div>

UserStats.propTypes = {
  user: PropTypes.shape({}).isRequired,
}

export const LoggedOutUserStats = ({ user }) =>
  <div className="UserStats">
    <dl>
      <UserStatsLink asDisabled >
        <dt>{user.postsCount}</dt>
        <dd>Posts</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled >
        <dt>{user.followingCount}</dt>
        <dd>Following</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled >
        <dt>{user.followersCount}</dt>
        <dd>Followers</dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled >
        <dt>{user.lovesCount}</dt>
        <dd>Loves</dd>
      </UserStatsLink>
    </dl>
  </div>

LoggedOutUserStats.propTypes = {
  user: PropTypes.shape({}).isRequired,
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
  user: PropTypes.shape({}).isRequired,
}

