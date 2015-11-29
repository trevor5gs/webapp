import React from 'react'
import { Link } from 'react-router'
import Avatar from '../users/Avatar'
import classNames from 'classnames'
import random from 'lodash.random'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'

class Banderole extends React.Component {
  static propTypes = {
    userlist: React.PropTypes.array.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      imageSize: 'hdpi',
      currentUser: null,
    }
  }

  componentWillMount() {
    const { userlist } = this.props
    const index = random(0, userlist.length - 1)
    this.setState({ currentUser: userlist[index] })
  }

  componentDidMount() {
    addResizeObject(this)
  }

  componentWillUnmount() {
    removeResizeObject(this)
  }

  onResize(resizeProperties) {
    const { windowWidth } = resizeProperties
    const size = this.getImageSize(windowWidth)
    this.setState({ imageSize: size })
  }

  getImageSize(windowWidth) {
    if (windowWidth < 1500) {
      return 'hdpi'
    } else if (windowWidth >= 1500 && windowWidth < 1920) {
      return 'xhdpi'
    }
    return 'optimized'
  }

  render() {
    const { currentUser, imageSize } = this.state
    if (!currentUser) { return null }
    const { username, avatar, coverImage, caption } = currentUser
    const coverSrc = coverImage[imageSize].url

    const klassNames = classNames('Banderole')
    const style = coverImage ? { backgroundImage: `url(${coverSrc})` } : null

    return (
      <div className={klassNames} style={style}>
        <div className="BanderoleCaption">
          { caption }
          <Link to="https://ello.co/wtf/about/what-is-ello/" target="_blank">Learn More</Link>
        </div>
        <Link className="BanderoleCredits" to={`/${username}`}>
          <span className="BanderoleCreditsBy">Posted by</span>
          <span className="BanderoleCreditsAuthor">@{username}</span>
          <Avatar sources={avatar} />
        </Link>
      </div>
    )
  }
}

export default Banderole

