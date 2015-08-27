import React from 'react'
import { Link } from 'react-router'

class PersonGrid extends React.Component {
  render() {
    const user = this.props.user
    const avatar = user.avatar.regular.url
    const style = { backgroundImage: `url(${avatar})` }
    return (
      <div className="PersonGrid" >
        <img className="tmp-header-image" />
        <figure className="Avatar" style={style}></figure>
        <div className="vitals">
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


          <h2>{user.name}</h2>
          <Link to="#">Follow</Link>
      </div>
    )
  }
}

PersonGrid.propTypes = {
  user: React.PropTypes.shape({
  }),
}

export default PersonGrid

