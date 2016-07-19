import React, { PropTypes } from 'react'
import { MoneyIcon } from './EditorIcons'

export const AffiliateLinkButton = ({ to }) =>
  <a
    className="AffiliateLinkButton"
    href={to}
    target="_blank"
  >
    <MoneyIcon />
  </a>

AffiliateLinkButton.propTypes = {
  to: PropTypes.string.isRequired,
}

