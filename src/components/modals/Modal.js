import React from 'react'
import ReactDOM from 'react-dom'
import Mousetrap from 'mousetrap'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { MODAL, ALERT } from '../../constants/action_types'
import { closeModal, closeAlert } from '../../actions/modals'

function getComponentKind(modal) {
  return (modal.meta && modal.meta.kind) ? modal.meta.kind : 'Modal'
}

class Modal extends React.Component {
  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.ESC, () => {
      this.close()
    })
  }

  componentDidUpdate() {
    const { modal } = this.props
    const { type } = modal
    const body = ReactDOM.findDOMNode(document.body)
    if (type === MODAL.OPEN) {
      body.classList.add('modalIsActive')
    } else if (type === MODAL.CLOSE) {
      body.classList.remove('modalIsActive')
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.ESC)
  }

  // Don't set state here or the delay, the action needs to do it
  close() {
    const { modal, dispatch } = this.props
    dispatch(getComponentKind(modal) === 'Modal' ? closeModal() : closeAlert())
  }

  handleModalTrigger(e) {
    const classList = e.target.classList
    if (classList.contains('Modal') || classList.contains('Alert') || classList.contains('CloseModal')) {
      return this.close()
    }
  }

  render() {
    const { modal } = this.props
    const { type, payload, meta } = modal
    const groupClassNames = classNames(
      getComponentKind(modal),
      (meta && meta.wrapperClasses) ? meta.wrapperClasses : '',
    )
    if (type === MODAL.OPEN || type === ALERT.OPEN) {
      return (
        <div
          className={ `${groupClassNames} isActive` }
          onClick={(e) => this.handleModalTrigger(e)}>
          { payload }
        </div>
      )
    }
    return <div className={groupClassNames}/>
  }
}


// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    modal: state.modal,
  }
}

Modal.propTypes = {
  wrapperClasses: React.PropTypes.string,
  isActive: React.PropTypes.func,
  dispatch: React.PropTypes.func.isRequired,
  modal: React.PropTypes.object,
}

export default connect(mapStateToProps)(Modal)

