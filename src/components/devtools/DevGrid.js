import React from 'react'
// import Mousetrap from 'mousetrap'
import { connect } from 'react-redux'
// import { SHORTCUT_KEYS } from '../../constants/action_types'
// import { toggleDevGrid, cycleDevGrid } from '../../actions/devtools'


class DevGrid extends React.Component {
  // componentDidMount() {
  //   const { dispatch } = this.props

  //   Mousetrap.bind(SHORTCUT_KEYS.DT_GRID_TOGGLE, () => {
  //     dispatch(toggleDevGrid())
  //   })

  //   Mousetrap.bind(SHORTCUT_KEYS.DT_GRID_CYCLE, () => {
  //     dispatch(cycleDevGrid())
  //   })
  // }

  // componentWillUnmount() {
  //   Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_TOGGLE)
  //   Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_CYCLE)
  // }

  renderGrid(isVisible, type) {
    return (
      isVisible ? <div className={type}></div> : <span/>
    )
  }

  render() {
    const { payload } = this.props.devtools
    const { horizontalGridIsVisible, verticalGridIsVisible } = payload
    return (
      <div className="DevGrid">
        { this.renderGrid(horizontalGridIsVisible, 'DT-horizontal-grid') }
        { this.renderGrid(verticalGridIsVisible, 'DT-vertical-grid') }
      </div>
    )
  }
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    devtools: state.devtools,
  }
}

DevGrid.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  devtools: React.PropTypes.object,
}

export default connect(mapStateToProps)(DevGrid)

