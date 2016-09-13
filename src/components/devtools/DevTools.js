import React, { Component } from 'react'
import Mousetrap from 'mousetrap'
import shallowCompare from 'react-addons-shallow-compare'
import { SHORTCUT_KEYS } from '../../constants/application_types'

class DevTools extends Component {

  componentWillMount() {
    this.state = {
      isHorizontalGridVisible: false,
      isVerticalGridVisible: false,
    }
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.DT_GRID_TOGGLE, () => {
      this.nextGridForToggle()
    })

    Mousetrap.bind(SHORTCUT_KEYS.DT_GRID_CYCLE, () => {
      this.nextGridForCycle()
    })

    Mousetrap.bind(SHORTCUT_KEYS.DT_CONTAINER_TOGGLE, () => {
      this.toggleContainerColors()
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_TOGGLE)
    Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_CYCLE)
  }

  // Toggles the full grid overlay.
  nextGridForToggle() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    if (isHorizontalGridVisible && isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible: false })
    } else if (!isHorizontalGridVisible && !isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible: true })
    } else if (isHorizontalGridVisible && !isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible, isVerticalGridVisible: true })
    } else if (!isHorizontalGridVisible && isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible })
    }
  }

  // Cycles through horizontal and vertical grid lines being on.
  nextGridForCycle() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    if (isHorizontalGridVisible && isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible })
    } else if (!isHorizontalGridVisible && !isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible, isVerticalGridVisible: true })
    } else if (isHorizontalGridVisible && !isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible: true })
    } else if (!isHorizontalGridVisible && isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible: false })
    }
  }


  toggleContainerColors() {
    document.body.classList.toggle('highlightContainers')
  }


  renderGrid(isVisible, type) {
    return (
      isVisible ? <div className={type} /> : <span />
    )
  }

  render() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    return (
      <div className="DevTools">
        {this.renderGrid(isHorizontalGridVisible, 'DT-horizontal-grid')}
        {this.renderGrid(isVerticalGridVisible, 'DT-vertical-grid')}
      </div>
    )
  }
}

export default DevTools

