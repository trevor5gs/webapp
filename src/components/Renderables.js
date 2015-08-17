import React from 'react'

export function channels(json) {
  return(
    <ol>
      {json.map(function(user, i) {
        return <li key={i}>@{user.username}</li>
        })}
    </ol>
  )
}

export function simpleUserGrid(json) {
  return(
    <ul>
      {json.map(function(user, i) {
        return <li key={i}>@{user.username}</li>
        })}
    </ul>
  )
}
