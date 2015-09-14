import React from 'react'
import RelationshipButton from '../buttons/RelationshipButton'
import Avatar from './Avatar'

class PersonGrid extends React.Component {
  setRelationshipPriority(state) {
    this.refs.relationshipButton.setState(state)
  }

  render() {
    const user = this.props.user
    const avatar = user.avatar.regular.url
    const coverSrc = user.coverImage.hdpi.url
    const coverStyle = { backgroundImage: `url(${coverSrc})` }
    return (
      <div className="PersonGrid" >
        <div className="CoverImage" style={coverStyle} />
        <Avatar imgSrc={avatar} />
        <RelationshipButton ref="relationshipButton" priority={user.relationshipPriority} data-user-id={user.id} />

        <div className="stats">
          <dl>
            <dt>{user.postsCount}</dt>
            <dd>Posts</dd>
          </dl>
          <dl>
            <dt>{user.followingCount}</dt>
            <dd>Following</dd>
          </dl>
          <dl>
            <dt>{user.followersCount}</dt>
            <dd>Followers</dd>
          </dl>
          <dl>
            <dt>{user.lovesCount}</dt>
            <dd>Loves</dd>
          </dl>
        </div>

        <div className="vitals">
          <h2>@{user.username}</h2>
          <h3>{user.name}</h3>
          <div className="short-bio" dangerouslySetInnerHTML={{ __html: user.formattedShortBio }} />
          <p className="external-links">
            {user.externalLinksList.map((link, i) => {
              return (
                <a href={link.url} target="_blank" key={i} >{link.text}</a>
              )
            })}
          </p>
        </div>
      </div>
    )
  }
}

PersonGrid.propTypes = {
  user: React.PropTypes.shape({
  }).isRequired,
}

export default PersonGrid

