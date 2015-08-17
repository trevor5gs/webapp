import React from 'react'
import { connect } from 'react-redux'

class StaticView extends React.Component {

  render() {
    const { error, meta, payload } = this.props.staticPage
    if (!meta) {
      return <div/>
    }
    const { renderStream } = meta
    return (
      <section className='static-view'>
        { renderStream() }
      </section>
    )
  }
}

// This should be a selector
// @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    staticPage: state.staticPage
  }
}

export default connect(mapStateToProps)(StaticView)

