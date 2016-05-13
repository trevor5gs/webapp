import React, { PropTypes } from 'react'

const spinGif = '/static/images/support/ello-spin.gif'

export const ErrorStateImage = () =>
  <img className="ErrorStateImage" src={spinGif} alt="Ello" width="130" height="130" />

export const ErrorState = ({ children = 'Something went wrong.' }) =>
  <div className="ErrorState">
    {children}
  </div>

ErrorState.propTypes = {
  children: PropTypes.node,
}

export const ErrorState4xx = ({ withImage = true }) =>
  <ErrorState>
    {withImage ? <ErrorStateImage /> : null}
    <p>This doesn't happen often, but it looks like something is broken. Hitting the back button and trying again might be your best bet. If that doesn't work you can <a href="http://ello.co/">head back to the homepage.</a></p>
    <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
    <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank">Store</a> or the <a href={`${ENV.AUTH_DOMAIN}/wtf/post/communitydirectory`}>Community Directory</a>.</p>
  </ErrorState>

ErrorState4xx.propTypes = {
  withImage: PropTypes.bool,
}

export const ErrorState5xx = ({ withImage = true }) =>
  <ErrorState>
    {withImage ? <ErrorStateImage /> : null}
    <p>It looks like something is broken and we couldn't complete your request. Please try again in a few minutes. If that doesn't work you can <a href="http://ello.co/">head back to the homepage.</a></p>
    <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
    <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank">Store</a> or the <a href={`${ENV.AUTH_DOMAIN}/wtf/post/communitydirectory`}>Community Directory</a>.</p>
  </ErrorState>

ErrorState5xx.propTypes = {
  withImage: PropTypes.bool,
}

