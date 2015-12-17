import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { MODAL, ALERT } from '../../constants/action_types'
import { closeModal, closeAlert } from '../../actions/modals'
import Mousetrap from '../../vendor/mousetrap'

function getComponentKind(modal) {
  return (modal.meta && modal.meta.kind) ? modal.meta.kind : 'Modal'
}

class Modal extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.func,
    modal: PropTypes.object,
    wrapperClasses: PropTypes.string,
  }

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

function mapStateToProps(state) {
  return {
    modal: state.modal,
  }
}

export default connect(mapStateToProps)(Modal)

