import React from 'react'
import FollowButton from '../buttons/FollowButton'

class PersonGrid extends React.Component {
  render() {
    const user = this.props.user
    const avatar = user.avatar.regular.url
    const style = { backgroundImage: `url(${avatar})` }
    return (
      <div className="PersonGrid" >
        <img className="tmp-header-image" />
        <figure className="Avatar" style={style}></figure>
        <FollowButton>Follow</FollowButton>

        <div className="stats">
          <dl>
            <dt>{user.posts_count}</dt>
            <dd>Posts</dd>
          </dl>
          <dl>
            <dt>{user.following_count}</dt>
            <dd>Following</dd>
          </dl>
          <dl>
            <dt>{user.followers_count}</dt>
            <dd>Followers</dd>
          </dl>
          <dl>
            <dt>{user.loves_count}</dt>
            <dd>Loves</dd>
          </dl>
        </div>

        <div className="vitals">
          <h2>@{user.username}</h2>
          <h3>{user.name}</h3>
          <div className="short-bio" dangerouslySetInnerHTML={{ __html: user.formatted_short_bio }} />
          <p className="external-links">
            {user.external_links_list.map((link, i) => {
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
  }),
}

export default PersonGrid

