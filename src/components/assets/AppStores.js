import React, { PropTypes } from 'react'

export const AppleStore = ({ to }) =>
  <a href={to} target="_blank" className="AppStore AppleStore" />

AppleStore.propTypes = {
  to: PropTypes.string.isRequired,
}

AppleStore.defaultProps = {
  to: 'https://itunes.apple.com/app/apple-store/id953614327?pt=117139389&ct=webapp&mt=8',
}

export const GooglePlayStore = ({ to }) =>
  <a href={to} target="_blank" className="AppStore GooglePlayStore" />

GooglePlayStore.propTypes = {
  to: PropTypes.string.isRequired,
}

GooglePlayStore.defaultProps = {
  to: 'https://play.google.com/store/apps/details?id=co.ello.ElloApp',
}

