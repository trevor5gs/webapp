import React from 'react'
import classNames from 'classnames'

class Cover extends React.Component {

  render() {
    const { imgSrc, isModifiable } = this.props
    const klassNames = classNames(
      'Cover',
      { isModifiable: isModifiable },
    )
    const style = imgSrc
      ? { backgroundImage: `url(${imgSrc})` }
      : null
    return <div className={klassNames} style={style} />
  }
}

Cover.propTypes = {
  imgSrc: React.PropTypes.string,
  isModifiable: React.PropTypes.any,
}

export default Cover

