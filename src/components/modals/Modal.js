import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { closeModal, closeAlert } from '../../actions/modals'
import Mousetrap from '../../vendor/mousetrap'

class Modal extends Component {
  constructor(props, context) {
    super(props, context)
    this.handleModalTrigger = ::this.handleModalTrigger
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.close() })
  }

  componentDidUpdate() {
    const { modal } = this.props
    const { isActive, kind } = modal
    const body = ReactDOM.findDOMNode(document.body)
    if (kind === 'Modal' && isActive) {
      body.classList.add('modalIsActive')
    } else if (kind === 'Modal' && !isActive) {
      body.classList.remove('modalIsActive')
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.ESC)
  }

  close() {
    const { modal, dispatch } = this.props
    const { kind } = modal
    dispatch(kind === 'Modal' ? closeModal() : closeAlert())
  }

  handleModalTrigger(e) {
    const classList = e.target.classList
    if (classList.contains('Modal') ||
        classList.contains('Alert') ||
        classList.contains('CloseModal')) {
      return this.close()
    }
  }

  render() {
    const { modal } = this.props
    const { isActive, classList, component, kind } = modal
    return (
      <div
        className={classNames({ isActive }, kind, classList)}
        onClick={ isActive ? this.handleModalTrigger : null }
      >
        { component }
      </div>
    )
  }
}

Modal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modal: PropTypes.shape({
    component: PropTypes.object,
    isActive: PropTypes.bool,
    kind: PropTypes.string,
    classList: PropTypes.string,
  }).isRequired,
}

function mapStateToProps(state) {
  return {
    modal: state.modal,
  }
}

export default connect(mapStateToProps)(Modal)

