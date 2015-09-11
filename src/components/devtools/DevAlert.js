import React, { Component, PropTypes } from 'react'
import ErrorStackParser from 'error-stack-parser'

export default class DevAlert extends Component {

  render() {
    const { error } = this.props
    const frames = ErrorStackParser.parse(error).map((f) => {
      const href = `${f.fileName}:${f.lineNumber}:${f.columnNumber}`
      const link = href.replace('webpack:///', '')
      return (
        <li>
          <span>{ f.functionName }</span>
          <a href={ href }>{ link }</a>
        </li>
      )
    })

    return (
      <div className="DevAlert">
        <div className="DevAlertDialog">
          <h2>{ error.name }: { error.message }</h2>
          <ol>{ frames }</ol>
        </div>
      </div>
    )
  }

}

DevAlert.displayName = 'DevAlert'

DevAlert.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
}

