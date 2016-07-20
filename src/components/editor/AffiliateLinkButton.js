import React, { PropTypes } from 'react'
import { MoneyIcon } from './EditorIcons'
import { dispatchTrackEvent } from '../../helpers/junk_drawer'

function onAffiliateLinkButtonClick(e) {
  dispatchTrackEvent('affililate_link_clicked', { link: e.target.href })
}

export const AffiliateLinkButton = ({ to }) =>
  <a
    className="AffiliateLinkButton"
    href={to}
    onClick={onAffiliateLinkButtonClick}
    target="_blank"
  >
    <MoneyIcon />
  </a>

AffiliateLinkButton.propTypes = {
  to: PropTypes.string.isRequired,
}

