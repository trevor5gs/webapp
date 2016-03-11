import React, { PropTypes } from 'react'
import RelationsGroup from '../relationships/RelationsGroup'
import Emoji from '../assets/Emoji'
import Editor from '../editor/Editor'

export const ZeroStream = ({ children, emoji, onDismiss }) =>
  <div className="ZeroStream">
    { emoji ? <Emoji name={ emoji } size={ 32 } /> : null }
    <h2 className="ZeroStreamHeading">
      { children }
    </h2>
    { onDismiss ?
      <button className="ZeroStreamButton" onClick={ onDismiss }>
        <span>Close</span>
      </button> :
      null
     }
  </div>

ZeroStream.propTypes = {
  children: PropTypes.node.isRequired,
  emoji: PropTypes.string,
  onDismiss: PropTypes.func,
}


export const ZeroFollowingStream = () =>
  <ZeroStream emoji="lollipop">
    Follow people and things that inspire you.
  </ZeroStream>


export const ZeroStarredStream = () =>
  <ZeroStream emoji="star">
    When you Star someone their posts appear here. Star people to create a second stream.
  </ZeroStream>

// -------------------------------------

export const ZeroState = ({ children = 'Sorry, no results found.' }) =>
  <div className="ZeroState">
    { children }
  </div>

ZeroState.propTypes = {
  children: PropTypes.node,
}


export const ZeroStateCreateRelationship = ({ user }) =>
  <ZeroState>
    <h2 className="ZeroStateTitle">
      <span className="ZeroStateUsername">{`@${user.username}`}</span>
      <span> doesn't have any followers yet, why don't you be their first?</span>
    </h2>
    <RelationsGroup user={user} />
  </ZeroState>

ZeroStateCreateRelationship.propTypes = {
  user: PropTypes.object.isRequired,
}


export const ZeroStateSayHello = ({ hasPosted = false, onSubmit, user }) =>
  <ZeroState>
    <h2 className="ZeroStateTitle">
      <span>It doesn't look like </span>
      <span className="ZeroStateUsername">{`@${user.username}`}</span>
      <span> has posted yet, why don't you say hi?</span>
    </h2>
    { hasPosted ?
      <p>{`Notification to @${user.username} has been sent.`}</p> :
      <Editor autoPopulate={`Hi @${user.username} :wave:`} onSubmit={ onSubmit } />
    }
  </ZeroState>

ZeroStateSayHello.propTypes = {
  hasPosted: PropTypes.bool,
  onSubmit: PropTypes.func,
  user: PropTypes.object.isRequired,
}


export const ZeroStateFirstPost = ({ hasPosted = false, onSubmit }) => {
  if (hasPosted) {
    return (
      <ZeroState>
        <h2 className="ZeroStateTitle">
          Posted! Don't forget, you can always use the Omnibar above to create a post.
        </h2>
      </ZeroState>
    )
  }
  return (
    <ZeroState>
      <h2 className="ZeroStateTitle">
        It doesn’t look like you’ve posted yet, why don’t you give it a shot.
      </h2>
      <Editor autoPopulate="Ello World!, My first post on :ello:!" onSubmit={ onSubmit } />
    </ZeroState>
  )
}

ZeroStateFirstPost.propTypes = {
  hasPosted: PropTypes.bool,
  onSubmit: PropTypes.func,
}

