import React from 'react'
import { connect } from 'react-redux'

// Heads Up: This isn't currently in use but we expect it to be. Once in use it
// should get moved to the `components/statics/` package.
class StaticComponent extends React.Component {

  render() {
    const { meta } = this.props.staticPage
    if (!meta) {
      return <div/>
    }
    const { renderStream } = meta
    return (
      <section className="StaticComponent">
        { renderStream() }
      </section>
    )
  }
}

// This should be a selector
// @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    staticPage: state.staticPage,
  }
}

StaticComponent.propTypes = {
  staticPage: React.PropTypes.shape({
    meta: React.PropTypes.string.isRequired,
  }),
}

export default connect(mapStateToProps)(StaticComponent)

