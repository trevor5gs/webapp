import React, { PropTypes } from 'react'

const Dialog = ({ body, title, onClick }) =>
  <div className="Dialog">
    <h2>{title}</h2>
    <p>{body}</p>
    { onClick ?
      <button className="DialogClose" onClick={ onClick }>x</button> :
      null
    }
  </div>

Dialog.propTypes = {
  body: PropTypes.string,
  title: PropTypes.string,
}

export default Dialog

