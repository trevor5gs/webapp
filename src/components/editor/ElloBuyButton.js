import React, { PropTypes } from 'react'
import { MoneyIcon } from './EditorIcons'
import { dispatchTrackEvent } from '../../helpers/junk_drawer'

function onElloBuyButtonClick(e) {
  dispatchTrackEvent('affililate_link_clicked', { link: e.target.href })
}

export const ElloBuyButton = ({ to }) =>
  <a
    className="ElloBuyButton"
    href={to}
    onClick={onElloBuyButtonClick}
    target="_blank"
  >
    <MoneyIcon />
  </a>

ElloBuyButton.propTypes = {
  to: PropTypes.string.isRequired,
}

