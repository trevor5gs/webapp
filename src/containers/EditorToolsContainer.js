import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { EDITOR } from '../constants/action_types'
import {
  autoCompleteUsers,
  loadEmojis,
  replaceText,
  setIsCompleterActive,
  setIsTextToolsActive,
  setTextToolsCoordinates,
} from '../actions/editor'
import Completer from '../components/completers/Completer'
import TextTools from '../components/editor/TextTools'
import { addInputObject, removeInputObject } from '../components/editor/InputComponent'
import { replaceWordFromSelection } from '../components/editor/SelectionUtil'

class EditorToolsContainer extends Component {

  static propTypes = {
    deviceSize: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    completions: PropTypes.shape({
      data: PropTypes.array,
      type: PropTypes.string,
    }),
    emojis: PropTypes.array,
    isCompleterActive: PropTypes.bool.isRequired,
    isTextToolsActive: PropTypes.bool.isRequired,
    textToolsCoordinates: PropTypes.shape({
      left: PropTypes.number,
      top: PropTypes.number,
    }),
    textToolsStates: PropTypes.shape({
      isBoldActive: PropTypes.bool,
      isItalicActive: PropTypes.bool,
      isLinkActive: PropTypes.bool,
    }),
  }

  componentWillMount() {
    this.onUserCompleter = debounce(this.onUserCompleter, 300)
  }

  componentDidMount() {
    addInputObject(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount() {
    removeInputObject(this)
    this.onCancelAutoCompleter()
  }

  onSubmitPost() {
    this.onCancelAutoCompleter()
  }

  onCancelAutoCompleter = () => {
    const { dispatch } = this.props
    dispatch({ type: EDITOR.CLEAR_AUTO_COMPLETERS })
    this.onHideCompleter()
    this.onHideTextTools()
  }

  onCompletion = ({ value }) => {
    const { dispatch } = this.props
    requestAnimationFrame(() => {
      const { collectionId, editorId } = document.activeElement.parentNode.dataset
      if (collectionId && editorId) {
        replaceWordFromSelection(value)
        dispatch(replaceText(collectionId, editorId))
      }
    })
    this.onCancelAutoCompleter()
  }

  onHideCompleter() {
    const { completions, dispatch, isCompleterActive } = this.props
    if (isCompleterActive) {
      dispatch(setIsCompleterActive({ isActive: false }))
    }
    if (completions) {
      dispatch({ type: EDITOR.CLEAR_AUTO_COMPLETERS })
    }
  }

  onUserCompleter({ word }) {
    const { dispatch, isCompleterActive } = this.props
    if (!isCompleterActive) {
      dispatch(setIsCompleterActive({ isActive: true }))
    }
    dispatch(autoCompleteUsers('user', word))
  }

  onEmojiCompleter({ word }) {
    const { dispatch, emojis, isCompleterActive } = this.props
    if (!isCompleterActive) {
      dispatch(setIsCompleterActive({ isActive: true }))
    }
    if (emojis && emojis.length) {
      dispatch({
        type: EDITOR.EMOJI_COMPLETER_SUCCESS,
        payload: {
          response: { emojis },
          type: 'emoji',
          word,
        },
      })
    } else {
      dispatch(loadEmojis('emoji', word))
    }
  }

  onPositionChange({ coordinates }) {
    const { dispatch } = this.props
    dispatch(setTextToolsCoordinates({ textToolsCoordinates: coordinates }))
  }

  onHideTextTools() {
    const { dispatch, isTextToolsActive } = this.props
    if (isTextToolsActive) {
      dispatch(setIsTextToolsActive({ isActive: false }))
    }
  }

  onShowTextTools({ activeTools }) {
    const { dispatch, isTextToolsActive, textToolsStates } = this.props
    if (!isTextToolsActive && activeTools !== textToolsStates) {
      dispatch(setIsTextToolsActive({ isActive: true, textToolsStates: activeTools }))
    }
  }

  render() {
    const { completions, deviceSize, isCompleterActive } = this.props
    const { isTextToolsActive, textToolsStates, textToolsCoordinates } = this.props
    return (
      <div className="EditorTools">
        {isCompleterActive && completions ?
          <Completer
            completions={completions}
            deviceSize={deviceSize}
            onCancel={this.onCancelAutoCompleter}
            onCompletion={this.onCompletion}
          /> :
          null
        }
        {isTextToolsActive ?
          <TextTools
            activeTools={textToolsStates}
            isHidden={!isTextToolsActive}
            coordinates={textToolsCoordinates}
            key={JSON.stringify(textToolsStates)}
          /> :
          null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editor, emoji, gui, modal } = state
  return {
    completions: editor.completions,
    emojis: emoji.emojis,
    isCompleterActive: modal.isCompleterActive,
    isTextToolsActive: modal.isTextToolsActive,
    textToolsStates: modal.textToolsStates,
    textToolsCoordinates: modal.textToolsCoordinates,
    deviceSize: gui.deviceSize,
  }
}

export default connect(mapStateToProps)(EditorToolsContainer)

