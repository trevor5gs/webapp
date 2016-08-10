import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import Emoji from '../assets/Emoji'
import Completion from './Completion'
import { getPositionFromSelection } from '../editor/SelectionUtil'
import { addKeyObject, removeKeyObject } from '../viewport/KeyComponent'
import { addScrollObject, removeScrollObject } from '../viewport/ScrollComponent'

export const emojiRegex = /\s?:{1}(\w+|\+|-):{0}$/
export const userRegex = /(\s|^)@{1}\w+/

export default class Completer extends Component {

  static propTypes = {
    className: PropTypes.string,
    completions: PropTypes.object.isRequired,
    deviceSize: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onCompletion: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = {
      selectedIndex: 0,
      scrollY: 0,
    }
  }

  componentDidMount() {
    addKeyObject(this)
    addScrollObject(this)
  }

  componentWillUnmount() {
    removeKeyObject(this)
    removeScrollObject(this)
  }

  onKeyDown(e) {
    if ((!e.shiftKey && e.which === 9) || e.which === 40) {
      e.preventDefault()
      this.nextSelection()
    } else if ((e.shiftKey && e.which === 9) || e.which === 38) {
      e.preventDefault()
      this.prevSelection()
    } else if (e.which === 13) {
      e.preventDefault()
      this.submit()
    } else if (e.which === 27) {
      e.preventDefault()
      this.props.onCancel()
    }
  }

  onScroll({ scrollY }) {
    this.setState({ scrollY })
  }

  nextSelection() {
    const { completions } = this.props
    let { selectedIndex } = this.state
    selectedIndex++
    if (selectedIndex > completions.data.length - 1) selectedIndex = 0
    this.setState({ selectedIndex })
  }

  prevSelection() {
    const { completions } = this.props
    let { selectedIndex } = this.state
    selectedIndex--
    if (selectedIndex < 0) selectedIndex = completions.data.length - 1
    this.setState({ selectedIndex })
  }

  submit() {
    const { onCompletion } = this.props
    const { selectedIndex } = this.state
    onCompletion({ value: this[`completion_${selectedIndex}`].getValue() })
  }

  renderUsers() {
    const { completions, onCompletion } = this.props
    const { selectedIndex } = this.state
    return (
      completions.data.map((completion, i) =>
        <Completion
          className={i === selectedIndex ? 'isActive' : null}
          key={`completion_${i}`}
          asset={<Avatar className="isTiny" sources={{ tmp: { url: completion.imageUrl } }} />}
          label={`@${completion.name}`}
          ref={(comp) => { this[`completion_${i}`] = comp }}
          onClick={onCompletion}
        />
      )
    )
  }

  renderEmoji() {
    const { completions, onCompletion } = this.props
    const { selectedIndex } = this.state
    return (
      completions.data.map((completion, i) =>
        <Completion
          className={i === selectedIndex ? 'isActive' : null}
          key={`completion_${i}`}
          asset={<Emoji key={completion.name} src={completion.imageUrl} />}
          label={`:${completion.name}:`}
          ref={(comp) => { this[`completion_${i}`] = comp }}
          onClick={onCompletion}
        />
      )
    )
  }

  render() {
    const { className, completions, deviceSize } = this.props
    if (!completions || !completions.data || !completions.data.length) {
      return null
    }

    let style = null
    const pos = getPositionFromSelection()
    if (!pos) {
      style = { top: -200, left: -666 }
    } else if (deviceSize === 'mobile') {
      style = { top: pos.top + 20 }
    } else if (pos) {
      style = { top: pos.top + 20, left: pos.left }
    }
    return (
      <div style={style} className={classNames(className, 'Completer')}>
        {completions.type === 'user' ? this.renderUsers() : this.renderEmoji()}
      </div>
    )
  }
}

