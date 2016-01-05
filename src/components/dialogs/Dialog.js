import React, { PropTypes } from 'react'

const Dialog = ({ body, title }) =>
  <div className="Dialog">
    <h2>{title}</h2>
    <p>{body}</p>
  </div>

Dialog.propTypes = {
  body: PropTypes.string,
  title: PropTypes.string,
}

export default Dialog

