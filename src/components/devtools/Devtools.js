import React from 'react'
import Mousetrap from 'mousetrap'
import { connect } from 'react-redux'
import { SHORTCUT_KEYS } from '../../constants/action_types'
import { toggleDevtoolsGrid, cycleDevtoolsGrid } from '../../actions/devtools'


class Devtools extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props

    Mousetrap.bind(SHORTCUT_KEYS.DT_GRID_TOGGLE, () => {
      dispatch(toggleDevtoolsGrid())
    })

    Mousetrap.bind(SHORTCUT_KEYS.DT_GRID_CYCLE, () => {
      dispatch(cycleDevtoolsGrid())
    })
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_TOGGLE)
    Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_CYCLE)
  }

  render() {
    const { payload } = this.props.devtools
    const { horizontalGridIsVisible, verticalGridIsVisible } = payload

    return (
      <div className="Devtools">
        { this.renderGrid(horizontalGridIsVisible, 'DT-horizontal-grid') }
        { this.renderGrid(verticalGridIsVisible, 'DT-vertical-grid') }
      </div>
    )
  }

  renderGrid(isVisible, type) {
    return (
      isVisible ? <div className={type}></div> : ''
    )
  }

}


// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    devtools: state.devtools,
  }
}

export default connect(mapStateToProps)(Devtools)

