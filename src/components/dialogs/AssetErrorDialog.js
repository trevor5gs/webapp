/* eslint-disable max-len */
import React, { PropTypes } from 'react'

const AssetErrorDialog = ({ assetType }) => {
  const mailto = `mailto:support@ello.co?subject=${assetType} upload failed`
  return (
    <div className="Dialog">
      <h2>{assetType} Upload Error</h2>
      <p>Sorry, there was an issue uploading your {assetType}, please visit your <a href="/settings">settings</a> and try again.</p>
      <p>If you continue having problems please contact <a href={mailto}>customer service</a>.</p>
    </div>
  )
}

AssetErrorDialog.propTypes = {
  assetType: PropTypes.string,
}

export default AssetErrorDialog

