import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { TOGGLE_NOTIFICATIONS } from '../../constants/action_types'
import { connect } from 'react-redux'
import { loadNotifications } from '../../actions/notifications'
import StreamComponent from '../../components/streams/StreamComponent'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../../components/notifications/NotificationIcons'
import { TabListButtons } from '../../components/tabs/TabList'

let ticking = false

class NotificationsContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.body = ReactDOM.findDOMNode(document.body)
    this.body.classList.add('notificationsAreActive')
    this.state = { activeTabType: 'all' }
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick)
  }

  componentWillUnmount() {
    this.body.classList.remove('notificationsAreActive')
    document.removeEventListener('click', this.onDocumentClick)
  }

  onTabClick = ({ type }) => {
    this.setState({ activeTabType: type })
  };

  onDocumentClick = () => {
    const { dispatch } = this.props
    dispatch({
      type: TOGGLE_NOTIFICATIONS,
      payload: { isNotificationsActive: false },
    })
  };

  onScrolled = () => {
    const { scrollable } = this.refs
    if (!scrollable) { return }
    const scrollY = Math.ceil(scrollable.scrollTop)
    const scrollHeight = Math.max(scrollable.scrollHeight, scrollable.offsetHeight)
    const scrollBottom = Math.round(scrollHeight - scrollable.offsetHeight)
    if (Math.abs(scrollY - scrollBottom) < 5) {
      // console.log('onScrollBottom!')
    }
  };

  elementWasScrolled = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        this.onScrolled()
        ticking = false
      })
      ticking = true
    }
  };

  render() {
    const { activeTabType } = this.state
    const tabs = [
      { type: 'all', children: 'All' },
      { type: 'comments', children: <BubbleIcon /> },
      { type: 'loves', children: <HeartIcon /> },
      { type: 'mentions', children: '@' },
      { type: 'reposts', children: <RepostIcon /> },
      { type: 'relationships', children: <RelationshipIcon /> },
    ]
    return (
      <div className="NotificationsContainer">
        <TabListButtons
          activeType={ activeTabType }
          className="IconTabList NotificationsContainerTabs"
          onTabClick={ this.onTabClick }
          tabClasses="IconTab"
          tabs={tabs}
        />
        <div className="Scrollable" ref="scrollable" onScroll={ this.elementWasScrolled }>
          <StreamComponent action={loadNotifications({ category: activeTabType })} />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isNotificationsActive: state.gui.isNotificationsActive,
  }
}

export default connect(mapStateToProps)(NotificationsContainer)

