import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Mousetrap from 'mousetrap'
import { SHORTCUT_KEYS } from '../../constants/gui_types'

class DevTools extends Component {
  constructor(props, context) {
    super(props, context)
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

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_TOGGLE)
    Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_CYCLE)
  }

  // Toggles the full grid overlay.
  nextGridForToggle() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    if (isHorizontalGridVisible && isVerticalGridVisible) {
      return this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible: false })
    } else if (!isHorizontalGridVisible && !isVerticalGridVisible) {
      return this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible: true })
    } else if (isHorizontalGridVisible && !isVerticalGridVisible) {
      return this.setState({ isHorizontalGridVisible: isHorizontalGridVisible, isVerticalGridVisible: true })
    } else if (!isHorizontalGridVisible && isVerticalGridVisible) {
      return this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible: isVerticalGridVisible })
    }
    return this.setState({ isHorizontalGridVisible: isHorizontalGridVisible, isVerticalGridVisible: isVerticalGridVisible })
  }

  // Cycles through horizontal and vertical grid lines being on.
  nextGridForCycle() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    if (isHorizontalGridVisible && isVerticalGridVisible) {
      return this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible: isVerticalGridVisible })
    } else if (!isHorizontalGridVisible && !isVerticalGridVisible) {
      return this.setState({ isHorizontalGridVisible: isHorizontalGridVisible, isVerticalGridVisible: true })
    } else if (isHorizontalGridVisible && !isVerticalGridVisible) {
      return this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible: true })
    } else if (!isHorizontalGridVisible && isVerticalGridVisible) {
      return this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible: false })
    }
    return { isHorizontalGridVisible: isHorizontalGridVisible, isVerticalGridVisible: isVerticalGridVisible }
  }


  toggleContainerColors() {
    ReactDOM.findDOMNode(document.body).classList.toggle('highlightContainers')
  }


  renderGrid(isVisible, type) {
    return (
      isVisible ? <div className={type}></div> : <span/>
    )
  }

  render() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    return (
      <div className="DevTools">
        { this.renderGrid(isHorizontalGridVisible, 'DT-horizontal-grid') }
        { this.renderGrid(isVerticalGridVisible, 'DT-vertical-grid') }
      </div>
    )
  }
}

export default DevTools

