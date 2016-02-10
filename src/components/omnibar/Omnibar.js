import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { closeOmnibar } from '../../actions/omnibar'
import Avatar from '../assets/Avatar'
import Editor from '../editor/Editor'
import { SVGIcon } from '../interface/SVGComponents'

const ChevronIcon = () =>
  <SVGIcon className="ChevronIcon">
    <g>
      <polyline points="6,16 12,10 6,4"/>
    </g>
  </SVGIcon>

class Omnibar extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    avatar: PropTypes.shape({}),
    omnibar: PropTypes.shape({
      isActive: PropTypes.bool,
      classList: PropTypes.string,
    }).isRequired,
  };

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

  close = () => {
    const { omnibar, dispatch } = this.props
    const { isActive } = omnibar
    if (isActive) {
      dispatch(closeOmnibar())
    }
  };

  render() {
    const { avatar, omnibar } = this.props
    const { isActive, classList } = omnibar
    if (!isActive) {
      return <div className={classNames('Omnibar', { isActive }, classList)}/>
    }
    return (
      <div className={classNames('Omnibar', { isActive }, classList)} >
        <Avatar sources={avatar} />
        <Editor/>
        <button className="OmnibarRevealNavbar" onClick={ this.close }>
          <ChevronIcon />
        </button>
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

