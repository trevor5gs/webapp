import React from 'react'

export function channels(json) {
  return(
    <ol>
      {json.map(function(user) {
        return <li>@{user.username}</li>
        })}
    </ol>
  )
}

export function simpleUserGrid(json) {
  return(
    <ul>
      {json.map(function(user) {
        return <li>@{user.username}</li>
        })}
    </ul>
  )
}

