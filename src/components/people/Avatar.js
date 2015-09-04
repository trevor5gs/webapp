import React from 'react'

class Avatar extends React.Component {

  render() {
    const { imgSrc } = this.props
    const style = imgSrc
      ? { backgroundImage: `url(${imgSrc})` }
      : null
    return <figure className="Avatar" style={style}></figure>
  }

}

Avatar.propTypes = {
  imgSrc: React.PropTypes.string,
}

export default Avatar

