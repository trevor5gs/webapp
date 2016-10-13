import React, { PropTypes } from 'react'

export const TextMarkupDialog = ({ html }) =>
  <div
    className="Dialog TextDialog TextMarkupDialog"
    dangerouslySetInnerHTML={{ __html: html }}
  />


TextMarkupDialog.propTypes = {
  html: PropTypes.string,
}

export const FeaturedInDialog = ({ children }) =>
  <div className="Dialog FeaturedInDialog">
    {children}
  </div>

FeaturedInDialog.propTypes = {
  children: PropTypes.node,
}

