import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import StreamComponent from './StreamComponent'
import { loadComments } from '../../actions/posts';

export default class CommentStream extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
  };

  render() {
    const { post, author } = this.props
    const action = loadComments(post)
    return (
      <div>
        <StreamComponent className="narrow" action={action} />
        <Link to={`/${author.username}/post/${post.token}`}>See More</Link>
      </div>
    )
  }
}
