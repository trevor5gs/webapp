import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { EMOJI, POST } from '../constants/action_types'
import {
  setIsCompleterActive,
  setIsTextToolsActive,
  setTextToolsCoordinates,
} from '../actions/modals'
import { autoCompleteUsers, loadEmojis } from '../actions/posts'
import Completer from '../components/completers/Completer'
import TextTools from '../components/editor/TextTools'
import { addInputObject, removeInputObject } from '../components/editor/InputComponent'
import { replaceWordFromSelection } from '../components/editor/SelectionUtil'

class EditorToolsContainer extends Component {

  static propTypes = {
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
    this.onHideCompleter()
    this.onHideTextTools()
  }

  onCancelAutoCompleter = () => {
    this.onHideCompleter()
    this.onHideTextTools()
    // TODO: maybe clear out the completions from the editor store?
  }

  onCompletion = ({ value }) => {
    replaceWordFromSelection(value)
    this.onCancelAutoCompleter()
  }

  onHideCompleter() {
    const { completions, dispatch, isCompleterActive } = this.props
    if (isCompleterActive) {
      dispatch(setIsCompleterActive({ isActive: false }))
    }
    if (completions) {
      dispatch({ type: POST.AUTO_COMPLETE_CLEAR })
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
        type: EMOJI.LOAD_SUCCESS,
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
    const { completions, isCompleterActive } = this.props
    const { isTextToolsActive, textToolsStates, textToolsCoordinates } = this.props
    return (
      <div className="EditorTools">
        { isCompleterActive && completions ?
          <Completer
            completions={ completions }
            onCancel={ this.onCancelAutoCompleter }
            onCompletion={ this.onCompletion }
          /> :
          null
        }
        { isTextToolsActive ?
          <TextTools
            activeTools={ textToolsStates }
            isHidden={ !isTextToolsActive }
            coordinates={ textToolsCoordinates }
            key={ JSON.stringify(textToolsStates) }
          /> :
          null
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { editor, emoji, modal } = state
  return {
    completions: editor.completions,
    emojis: emoji.emojis,
    isCompleterActive: modal.isCompleterActive,
    isTextToolsActive: modal.isTextToolsActive,
    textToolsStates: modal.textToolsStates,
    textToolsCoordinates: modal.textToolsCoordinates,
  }
}

export default connect(mapStateToProps)(EditorToolsContainer)

