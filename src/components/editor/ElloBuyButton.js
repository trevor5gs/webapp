import React, { PropTypes } from 'react'
import { MoneyIcon } from '../assets/Icons'
import { dispatchTrackEvent } from '../../helpers/junk_drawer'

function onElloBuyButtonClick(e) {
  dispatchTrackEvent('buy_link_clicked', { link: e.target.href })
}

export const ElloBuyButton = ({ to }) =>
  <a
    className="ElloBuyButton"
    href={to}
    onClick={onElloBuyButtonClick}
    rel="noopener noreferrer"
    target="_blank"
  >
    <MoneyIcon />
  </a>

ElloBuyButton.propTypes = {
  to: PropTypes.string.isRequired,
}

export default ElloBuyButton

