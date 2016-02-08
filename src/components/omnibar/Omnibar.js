import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { closeOmnibar } from '../../actions/omnibar'
import Mousetrap from '../../vendor/mousetrap'
import Avatar from '../assets/Avatar'

class Omnibar extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    avatar: PropTypes.shape({}),
    omnibar: PropTypes.shape({
      component: PropTypes.object,
      isActive: PropTypes.bool,
      classList: PropTypes.string,
    }).isRequired,
  };

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.close() })
  }

  componentDidUpdate() {
    const { omnibar } = this.props
    const { isActive } = omnibar
    const body = ReactDOM.findDOMNode(document.body)
    if (isActive) {
      body.classList.add('omnibarIsActive')
    } else if (!isActive) {
      body.classList.remove('omnibarIsActive')
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.ESC)
  }

  close() {
    const { omnibar, dispatch } = this.props
    const { isActive } = omnibar
    if (isActive) {
      dispatch(closeOmnibar())
    }
  }

  handleOmnibarTrigger = (e) => {
    const classList = e.target.classList
    if (classList.contains('Omnibar') || classList.contains('CloseOmnibar')) {
      return this.close()
    }
  };

  render() {
    const { avatar, omnibar } = this.props
    const { isActive, classList, component } = omnibar
    return (
      <div
        className={classNames('Omnibar', { isActive }, classList)}
        onClick={ isActive ? this.handleOmnibarTrigger : null }
      >
        <Avatar sources={avatar} />
        { component }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    omnibar: state.omnibar,
    avatar: state.profile.avatar,
  }
}

export default connect(mapStateToProps)(Omnibar)

