import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'

function renderHeader({ notifier }) {
  if (!notifier) { return null }
  return (
    <header className="NotificationHeader">
      <Avatar to={`/${notifier.username}`} sources={notifier.avatar}/>
    </header>
  )
}

function renderBody({ children }) {
  if (!children) { return null }
  return (
    <div className="NotificationBody">
      { children }
    </div>
  )
}

function renderSummary({ summary }) {
  if (!summary) { return null }
  return (
    <div className="NotificationSummary">
      { summary }
    </div>
  )
}

function renderFooter({ createdAt, activityPath }) {
  if (!createdAt) { return null }
  return (
    <footer className="NotificationFooter">
      <Link to={ activityPath }>
        { new Date(createdAt).timeAgoInWords() }
      </Link>
    </footer>
  )
}

export const Notification = ({ activityPath, children, className, createdAt, summary, notifier }) =>
  <div className={ classNames('Notification', className) }>
    { renderHeader({ notifier }) }
    { renderBody({ children }) }
    { renderSummary({ summary }) }
    { renderFooter({ createdAt, activityPath }) }
  </div>


Notification.propTypes = {
  activityPath: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  createdAt: PropTypes.string,
  notifier: PropTypes.object,
  summary: PropTypes.node,
}

