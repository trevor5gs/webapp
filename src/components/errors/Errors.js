import React from 'react'

export const ErrorStateImage = () =>
  <img
    className="ErrorStateImage"
    src="/static/images/support/ello-spin.gif"
    alt="Ello"
    width="130"
    height="130"
  />

export const ErrorState = ({ children = 'Something went wrong.' }) =>
  <div className="ErrorState">
    { children }
  </div>

export const ErrorState400 = ({ withImage = true }) =>
  <div className="ErrorState">
    { withImage ? <ErrorStateImage/> : null }
    <p>This doesn't happen often, but it looks like something is broken. Hitting the back button and trying again might be your best bet. If that doesn't work you can <a href="http://ello.co/">head back to the homepage.</a></p>
    <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
    <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank">Store</a> or the <a href="https://ello.co/wtf/post/communitydirectory">Community Directory</a>.</p>
  </div>


export const ErrorState500 = ({ withImage = true }) =>
  <div className="ErrorState">
    { withImage ? <ErrorStateImage/> : null }
    <p>It looks like something is broken and we couldn't complete your request. Please try again in a few minutes. If that doesn't work you can <a href="http://ello.co/">head back to the homepage.</a></p>
    <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
    <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank">Store</a> or the <a href="https://ello.co/wtf/post/communitydirectory">Community Directory</a>.</p>
  </div>

