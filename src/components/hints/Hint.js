import React from 'react'

class Hint extends React.Component {

  render() {
    return (
      <span className="Hint">{this.props.children}</span>
    )
  }
}

Hint.propTypes = {
  children: React.PropTypes.string,
}

export default Hint

