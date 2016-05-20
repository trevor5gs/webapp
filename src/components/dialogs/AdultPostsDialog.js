import React, { PropTypes } from 'react'
import Avatar from '../assets/Avatar'

const AdultPostsDialog = ({ user, onConfirm }) =>
  <div className="Dialog AdultPostsDialog">
    <p>If you post adult content, you must mark your account Not Safe for Work (NSFW).</p>
    <p>
      When you set "Post Adult Content" to yes, users who do not wish to view
      adult content will not see your posts.
    </p>
    <button className="AdultPostsDialogButton" onClick={onConfirm}>Okay</button>
  </div>

AdultPostsDialog.propTypes = {
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
  user: PropTypes.shape({}),
}

export default AdultPostsDialog

