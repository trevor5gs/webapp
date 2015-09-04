import React from 'react'
import { connect } from 'react-redux'

class Cover extends React.Component {

  render() {
    const { payload } = this.props.profile
    const { coverImage } = payload
    const headerStyle = coverImage && coverImage.tmp
      ? { backgroundImage: `url(${coverImage.tmp})`, color: 'white' }
      : null

    return (
      <div className="Cover" style={headerStyle} />
    )
  }
}

Cover.propTypes = {
  profile: React.PropTypes.shape({
    payload: React.PropTypes.shape,
  }),
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(Cover)


