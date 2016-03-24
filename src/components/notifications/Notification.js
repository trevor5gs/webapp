import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'

function renderHeader({ notifier }) {
  if (!notifier) { return null }
  return (
    <header className="NotificationHeader">
      <Avatar
        priority={ notifier.relationshipPriority }
        sources={ notifier.avatar }
        to={ `/${notifier.username}` }
        userId={ `${notifier.id}` }
        username={ notifier.username }
      />
    </header>
  )
}
renderHeader.propTypes = {
  notifier: PropTypes.object,
}


function renderBody({ children, summary }) {
  if (!children) { return null }
  return (
    <div className="NotificationBody">
      { children }
      { summary && summary.texts && summary.texts.length ?
        <div className="NotificationSummaryTexts">{ summary.texts }</div> : null
      }
    </div>
  )
}
renderBody.propTypes = {
  children: PropTypes.node,
  summary: PropTypes.shape({
    assets: PropTypes.arrayOf(PropTypes.node),
    texts: PropTypes.arrayOf(PropTypes.node),
  }),
}


function renderAssets({ summary }) {
  return (
    summary && summary.assets && summary.assets.length ?
      <div className="NotificationAsset">{ summary.assets[0] }</div> : null
  )
}

renderAssets.propTypes = {
  summary: PropTypes.shape({
    assets: PropTypes.arrayOf(PropTypes.node),
    texts: PropTypes.arrayOf(PropTypes.node),
  }),
}

function renderFooter({ activityPath, createdAt, retort }) {
  if (!createdAt) { return null }
  return (
    <footer className="NotificationFooter">
      <Link className="NotificationFooterTimestamp" to={ activityPath }>
        { new Date(createdAt).timeAgoInWords() }
      </Link>
      { retort }
    </footer>
  )
}

renderFooter.propTypes = {
  activityPath: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  retort: PropTypes.any,
}

export const Notification = ({
  activityPath,
  children,
  className,
  createdAt,
  notifier,
  retort,
  summary,
  }) => {
  const hasAsset = summary && summary.assets && summary.assets.length
  return (
    <div className={ classNames('Notification', className, { hasAsset }) }>
      { renderHeader({ notifier }) }
      { renderBody({ children, summary }) }
      { renderAssets({ summary }) }
      { renderFooter({ activityPath, createdAt, retort }) }
    </div>
  )
}


Notification.propTypes = {
  activityPath: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  createdAt: PropTypes.string,
  notifier: PropTypes.object,
  retort: PropTypes.any,
  summary: PropTypes.shape({
    assets: PropTypes.arrayOf(PropTypes.node),
    texts: PropTypes.arrayOf(PropTypes.node),
  }),
}

