import React from 'react'
import RelationsGroup from '../relationships/RelationsGroup'
import Beacon from '../beacons/Beacon'

export const ZeroResults = () =>
  <p className="ZeroStateTextField">Sorry, no results found.</p>


export const ZeroFollowingStream = () =>
  <Beacon emoji="lollipop">
    Follow people and things that inspire you.
  </Beacon>


export const ZeroStarredStream = () =>
  <Beacon emoji="star">
    When you Star someone their posts appear here. Star people to create a second stream.
  </Beacon>


export const ZeroStateCreateRelationship = ({ user }) =>
  <div className="ZeroState">
    <h2 className="ZeroStateTitle">
      <span className="ZeroStateUsername">{`@${user.username}`}</span>
      <span> doesn't have any followers yet, why don't you be their first?</span>
    </h2>
    <RelationsGroup user={user} />
  </div>


export const ZeroStateSayHello = ({ user, hasPosted = false }) => {
  if (hasPosted) {
    return (
      <div className="ZeroState">
        <h2 className="ZeroStateTitle">
          <span>Notification to </span>
          <span className="ZeroStateUsername">{`@${user.username}`}</span>
          <span> has been sent.</span>
        </h2>
      </div>
    )
  }
  return (
    <div className="ZeroState">
      <h2 className="ZeroStateTitle">
        <span>It doesn't look like </span>
        <span className="ZeroStateUsername">{`@${user.username}`}</span>
        <span> has posted yet, why don't you say hi?</span>
      </h2>
      <p>{`(Editor) Hi @${user.username} :wave:`}</p>
    </div>
  )
}


export const ZeroStateFirstPost = ({ hasPosted = false }) => {
  if (hasPosted) {
    return (
      <div className="ZeroState">
        <h2 className="ZeroStateTitle">
          Posted! Don't forget, you can always use the Omnibar above to create a post.
        </h2>
      </div>
    )
  }
  return (
    <div className="ZeroState">
      <h2 className="ZeroStateTitle">
        It doesn’t look like you’ve posted yet, why don’t you give it a shot.
      </h2>
      <p>(Editor) Ello World!, My first post on :ello:!</p>
    </div>
  )
}

