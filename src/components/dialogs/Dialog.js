import React from 'react'

class Dialog extends React.Component {
  render() {
    return (
      <div className="Dialog">
        <h2>{this.props.title}</h2>
        <p>{this.props.body}</p>
      </div>
    )
  }
}

Dialog.propTypes = {
  title: React.PropTypes.string,
  body: React.PropTypes.string,
}

export default Dialog

