import React from 'react'
import { connect } from 'react-redux'
import { updateRelationship } from '../../actions/relationships'
import RelationshipButton from '../buttons/RelationshipButton'
import Avatar from './Avatar'


class UserGrid extends React.Component {
  setRelationshipPriority(state) {
    this.refs.relationshipButton.setState(state)
  }

  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    this.props.dispatch(updateRelationship(userId, priority, existing))
  }

  render() {
    const user = this.props.user
    const avatar = user.avatar ? user.avatar.regular.url : ''
    const coverSrc = user.coverImage ? user.coverImage.hdpi.url : ''
    const coverStyle = { backgroundImage: `url(${coverSrc})` }
    let externalLinks = []
    if (user.externalLinksList) {
      externalLinks = user.externalLinksList.map((link, i) => {
        return (
          <a href={link.url} target="_blank" key={i} >{link.text}</a>
        )
      })
    }
    return (
      <div className="UserGrid" >
        <div className="CoverImage" style={coverStyle} />
        <Avatar imgSrc={avatar} />
        <RelationshipButton
          ref="relationshipButton"
          userId={user.id}
          priority={user.relationshipPriority}
          buttonWasClicked={this.handleRelationshipUpdate.bind(this)} />

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
            {externalLinks}
          </p>
        </div>
      </div>
    )
  }
}

UserGrid.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  user: React.PropTypes.shape({
  }).isRequired,
}

export default connect(null, null, null, { withRef: true })(UserGrid)

