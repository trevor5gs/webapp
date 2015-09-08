import React from 'react'

class Cover extends React.Component {

  render() {
    const { imgSrc } = this.props
    const style = imgSrc
      ? { backgroundImage: `url(${imgSrc})` }
      : null
    return <div className="Cover" style={style} />
  }
}

Cover.propTypes = {
  imgSrc: React.PropTypes.string,
}

export default Cover

