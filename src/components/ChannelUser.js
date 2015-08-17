import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class ChannelUser extends Component {
  render() {
    return (
      <div style={{...channelUserContainerStyles, backgroundImage: `url(${this.props.user.avatar.regular.url})`}}>
        <Link to='#' style={followButtonStyles}>+ Follow</Link>
      </div>
    )
  }
}

let channelUserContainerStyles = {
  width: 320,
  height: 320,
  float: 'left',
  position: 'relative',
  backgroundColor: 'magenta',
  margin: 15
}

let followButtonStyles = {
  fontFamily: 'sans-serif',
  position: 'absolute',
  height: 50,
  left: 10,
  bottom: 10,
  right: 10,
  backgroundColor: 'white',
  textAlign: 'center'
}

