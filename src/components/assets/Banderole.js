import React from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
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
      featuredUser: null,
    }
  }

  componentWillMount() {
    const { userlist } = this.props
    const index = random(0, userlist.length - 1)
    this.setState({ featuredUser: userlist[index] })
  }

  componentDidMount() {
    addResizeObject(this)
  }

  componentWillUnmount() {
    removeResizeObject(this)
  }

  onResize(resizeProperties) {
    const { coverImageSize } = resizeProperties
    this.setState({ imageSize: coverImageSize })
  }

  render() {
    const { featuredUser, imageSize } = this.state
    if (!featuredUser) { return null }
    const { username, avatar, coverImage, caption } = featuredUser
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

