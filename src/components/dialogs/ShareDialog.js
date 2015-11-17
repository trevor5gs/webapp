import React from 'react'
import {
  FacebookIcon,
  GooglePlusIcon,
  LinkedInIcon,
  MailIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
} from './ShareDialogIcons'

class ShareDialog extends React.Component {
  render() {
    return (
      <div className="Dialog ShareDialog">
        <input
          className="ShareControl"
          type="url"
          readOnly
          onClick={(e) => e.target.select()}
          value={this.props.postUrl} />
        <div className="ShareLinks">
          <button className="ShareLink"><MailIcon/></button>
          <button className="ShareLink"><FacebookIcon/></button>
          <button className="ShareLink"><TwitterIcon/></button>
          <button className="ShareLink"><PinterestIcon/></button>
          <button className="ShareLink"><GooglePlusIcon/></button>
          <button className="ShareLink"><TumblrIcon/></button>
          <button className="ShareLink"><RedditIcon/></button>
          <button className="ShareLink"><LinkedInIcon/></button>
        </div>
      </div>
    )
  }
}

ShareDialog.propTypes = {
  postUrl: React.PropTypes.string.isRequired,
}

export default ShareDialog

