import React, { Component, PropTypes } from 'react'

class AssetErrorDialog extends Component {
  static propTypes = {
    assetType: PropTypes.string,
  }

  render() {
    const assetType = this.props.assetType
    const mailto = `mailto:support@ello.co?subject=${assetType} upload failed`
    return (
      <div className="Dialog">
        <h2>{assetType} Upload Error</h2>
        <p>Sorry, there was an issue uploading your {assetType}, please visit your <a href="/settings">settings</a> and try again.</p>
        <p>If you continue having problems please contact <a href={mailto}>customer service</a>.</p>
      </div>
    )
  }
}

export default AssetErrorDialog

