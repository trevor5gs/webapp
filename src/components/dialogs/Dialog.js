import React, { PropTypes } from 'react'
import { XIcon } from '../assets/Icons'

const Dialog = ({ body, title, onClick }) =>
  <div className="Dialog">
    <h2>{title}</h2>
    <p>{body}</p>
    {onClick ?
      <button className="DialogClose" onClick={onClick}><XIcon /></button> :
      null
    }
  </div>

Dialog.propTypes = {
  body: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
}

Dialog.defaultProps = {
  body: '',
  onClick: null,
  title: '',
}

export default Dialog

