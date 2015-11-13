import React from 'react'
// import Mousetrap from 'mousetrap'
import classNames from 'classnames'
import { connect } from 'react-redux'
// import { SHORTCUT_KEYS } from '../../constants/action_types'
import { closeModal, closeAlert } from '../../actions/modals'

function getComponentKind(modals) {
  return (modals.meta && modals.meta.kind) ? modals.meta.kind : 'Modal'
}

class Modal extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.isActive = this.props.isActive || false
  }

  // componentDidMount() {
  //   Mousetrap.bind(SHORTCUT_KEYS.ESC, () => {
  //     this.close()
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    const { modals } = this.props
    const payload = modals.payload
    const nextPayload = nextProps.modals.payload
    if (payload !== nextPayload) {
      if (getComponentKind(modals) === 'Modal') {
        document.body.classList.remove('modalIsActive')
      }
      this.isActive = false
    }
  }

  componentDidUpdate() {
    const { modals } = this.props
    const payload = modals.payload
    if (!this.isActive && payload) {
      if (getComponentKind(modals) === 'Modal') {
        document.body.classList.add('modalIsActive')
      }
      this.isActive = true
    }
  }

  // componentWillUnmount() {
  //   Mousetrap.unbind(SHORTCUT_KEYS.ESC)
  // }

  // Don't set state here or the delay, the action needs to do it
  close() {
    const { modals, dispatch } = this.props
    if (this.isActive) {
      dispatch(getComponentKind(modals) === 'Modal' ? closeModal() : closeAlert())
    }
  }

  handleModalTrigger(e) {
    if (e.target.classList.contains('Modal') || e.target.classList.contains('Alert')) {
      return this.close()
    }
  }

  render() {
    const { modals } = this.props
    const groupClassNames = classNames(
      getComponentKind(modals),
      (modals.meta && modals.meta.wrapperClasses) ? modals.meta.wrapperClasses : '',
      { isActive: this.isActive },
    )

    if (modals.payload) {
      return (
        <div
          className={groupClassNames}
          onClick={(e) => this.handleModalTrigger(e)}>
          { modals.payload }
        </div>
      )
    }
    return <div className={groupClassNames}/>
  }
}


// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    modals: state.modals,
  }
}

Modal.propTypes = {
  wrapperClasses: React.PropTypes.string,
  isActive: React.PropTypes.func,
  dispatch: React.PropTypes.func.isRequired,
  modals: React.PropTypes.object,
}

export default connect(mapStateToProps)(Modal)

