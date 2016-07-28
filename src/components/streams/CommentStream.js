import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import StreamContainer from '../../containers/StreamContainer'
import { loadComments } from '../../actions/posts'

/* eslint-disable react/prefer-stateless-function */
export default class CommentStream extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
  }

  render() {
    const { post, author } = this.props
    const action = loadComments(post)
    return (
      <div>
        <StreamContainer
          className="CommentStreamContainer asFullWidth"
          action={action}
          ignoresScrollPosition
        >
          {post.commentsCount > 10 ?
            <Link
              to={{
                pathname: `/${author.username}/post/${post.token}`,
                state: { didComeFromSeeMoreCommentsLink: true },
              }}
              className="CommentsLink"
            >
              See More
            </Link>
            : null
          }
        </StreamContainer>
      </div>
    )
  }
}

