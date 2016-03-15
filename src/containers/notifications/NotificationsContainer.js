import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { debounce } from 'lodash'
import { GUI, MODAL } from '../../constants/action_types'
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
    activeTabType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    activeTabType: 'all',
  }

  componentWillMount() {
    this.body = ReactDOM.findDOMNode(document.body)
    this.body.classList.add('notificationsAreActive')
    this.onScrolled = debounce(this.onScrolled, 300)
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickDocument)

    this.refs.streamComponent.refs.wrappedInstance.scrollContainer = this.refs.scrollable
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTabType !== this.props.activeTabType && this.refs.scrollable) {
      this.refs.streamComponent.refs.wrappedInstance.scrollContainer = this.refs.scrollable
      this.refs.scrollable.scrollTop = 0
    }
  }

  componentWillUnmount() {
    this.body.classList.remove('notificationsAreActive')
    document.removeEventListener('click', this.onClickDocument)
  }

  onClickTab = ({ type }) => {
    const { dispatch } = this.props
    dispatch({
      type: GUI.NOTIFICATIONS_TAB,
      payload: { activeTabType: type },
    })
    if (this.refs.streamComponent) {
      this.refs.streamComponent.refs.wrappedInstance.setAction(
        loadNotifications({ category: type })
      )
    }
    this.setState({ activeTabType: type })
  }

  onClickDocument = (e) => {
    const classList = e.target.classList
    if (classList.contains('TabButton') ||
        classList.contains('RelationshipButton') ||
        classList.contains('StarshipButton')
       ) { return }
    const { dispatch } = this.props
    dispatch({
      type: MODAL.TOGGLE_NOTIFICATIONS,
      payload: { isNotificationsActive: false },
    })
  }

  onScrolled = () => {
    const { scrollable } = this.refs
    if (!scrollable) { return }

    this.refs.streamComponent.refs.wrappedInstance.onScroll()

    const scrollY = Math.ceil(scrollable.scrollTop)
    const scrollHeight = Math.max(scrollable.scrollHeight, scrollable.offsetHeight)
    const scrollBottom = Math.round(scrollHeight - scrollable.offsetHeight)
    if (Math.abs(scrollY - scrollBottom) < 5) {
      this.refs.streamComponent.refs.wrappedInstance.onLoadNextPage()
    }
  }

  onScrollElement = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        this.onScrolled()
        ticking = false
      })
      ticking = true
    }
  }

  render() {
    const { activeTabType } = this.props
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
          onTabClick={ this.onClickTab }
          tabClasses="IconTab"
          tabs={ tabs }
        />
        <div className="Scrollable" ref="scrollable" onScroll={ this.onScrollElement }>
          <StreamComponent
            action={ loadNotifications({ category: activeTabType }) }
            className="asFullWidth"
            key={ `notificationPanel_${activeTabType}` }
            ref="streamComponent"
            historyLocationOverride={ `notifications_${activeTabType}` }
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeTabType: state.gui.activeNotificationsTabType,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(NotificationsContainer)

