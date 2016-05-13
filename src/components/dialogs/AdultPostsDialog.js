import React, { PropTypes } from 'react'
import Avatar from '../assets/Avatar'

const AdultPostsDialog = ({ user, onConfirm }) =>
  <div className="Dialog AdultPostsDialog">
    <p>If you post adult content, you must mark your account Not Safe for Work (NSFW).</p>
    <p>
      When you set "Post Adult Content" to yes, users who do not wish to view
      adult content will need to click a link that looks like the one below to
      view your posts.
    </p>
    <div className="AdultPostsFakeToggle">
      <Avatar sources={user.avatar} />
      <p>NSFW. <span className="AdultPostsFakeToggleLink">Click to view.</span></p>
    </div>
    <button className="AdultPostsDialogButton" onClick={onConfirm}>Okay</button>
  </div>

AdultPostsDialog.propTypes = {
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
  user: PropTypes.shape({}),
}

export default AdultPostsDialog

