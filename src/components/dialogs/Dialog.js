import React, { PropTypes } from 'react'
import { SVGIcon } from '../svg/SVGComponents'

const DismissIcon = () =>
  <SVGIcon className="DialogDismissIcon">
    <g>
      <line x1="6" x2="14" y1="6" y2="14" />
      <line x1="14" x2="6" y1="6" y2="14" />
    </g>
  </SVGIcon>

const Dialog = ({ body, title, onClick }) =>
  <div className="Dialog">
    <h2>{title}</h2>
    <p>{body}</p>
    {onClick ?
      <button className="DialogClose" onClick={onClick}><DismissIcon /></button> :
      null
    }
  </div>

Dialog.propTypes = {
  body: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
}

export default Dialog

