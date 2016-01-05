import React, { PropTypes } from 'react'

const ConfirmDialog = ({ title, onConfirm, onRejected }) =>
  <div className="Dialog ConfirmDialog">
    { title ? <h2>{ title }</h2> : null }
    <button className="ConfirmDialogButton" onClick={ onConfirm }>Yes</button>
    <button className="ConfirmDialogButton" onClick={ onRejected }>No</button>
  </div>

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  onConfirm: PropTypes.func,
  onRejected: PropTypes.func,
}

export default ConfirmDialog

