import React from 'react'
import { Link } from 'react-router'

class Avatar extends React.Component {

  render() {
    const { imgSrc, path } = this.props
    const style = imgSrc
      ? { backgroundImage: `url(${imgSrc})` }
      : null
    if (path) {
      return (
        <Link to={path}>
          <figure className="Avatar" style={style}></figure>
        </Link>
      )
    }
    return <figure className="Avatar" style={style}></figure>
  }
}

Avatar.propTypes = {
  imgSrc: React.PropTypes.string,
  path: React.PropTypes.string,
}

export default Avatar

