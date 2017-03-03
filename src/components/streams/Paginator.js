import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { ElloMark } from '../assets/Icons'

function getMessage({ hasShowMoreButton, messageText, totalPages, totalPagesRemaining }) {
  if (totalPagesRemaining === 0) {
    return ''
  } else if (hasShowMoreButton) {
    return messageText
  }
  return (totalPages > 0) ?
    `${messageText}: ${(totalPages - totalPagesRemaining) + 1} of ${totalPages}` :
    `${messageText}...`
}

const PaginatorLink = ({ message, to }) =>
  <Link
    className="PaginatorLink"
    to={{
      pathname: to,
      state: { from: 'PaginatorLink' },
    }}
  >
    <span>{message}</span>
  </Link>
PaginatorLink.propTypes = {
  message: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

const PaginatorButton = ({ loadNextPage, message }) =>
  <button className="PaginatorButton" onClick={loadNextPage}>
    <ElloMark className="isSpinner" />
    <span>{message}</span>
  </button>
PaginatorButton.propTypes = {
  loadNextPage: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
}

const PaginatorLoader = ({ message }) =>
  <span className="PaginatorLoader">
    <ElloMark className="isSpinner" />
    <span className="PaginatorMessage">{message}</span>
  </span>
PaginatorLoader.propTypes = {
  message: PropTypes.string.isRequired,
}

export const Paginator = ({
    className,
    hasShowMoreButton,
    isHidden,
    loadNextPage,
    messageText,
    to,
    totalPages,
    totalPagesRemaining,
  }) => {
  const message = getMessage({ hasShowMoreButton, messageText, totalPages, totalPagesRemaining })
  if (!message.length) { return null }
  let el
  if (to) {
    el = <PaginatorLink message={message} to={to} />
  } else if (hasShowMoreButton) {
    el = <PaginatorButton loadNextPage={loadNextPage} message={message} />
  } else {
    el = <PaginatorLoader message={message} />
  }
  return (
    <div className={classNames('Paginator', { isBusy: !isHidden }, className)}>
      {el}
    </div>
  )
}
Paginator.propTypes = {
  className: PropTypes.string,
  hasShowMoreButton: PropTypes.bool,
  isHidden: PropTypes.bool,
  loadNextPage: PropTypes.func,
  messageText: PropTypes.string,
  to: PropTypes.string,
  totalPages: PropTypes.number,
  totalPagesRemaining: PropTypes.number,
}
Paginator.defaultProps = {
  className: null,
  hasShowMoreButton: false,
  isHidden: true,
  loadNextPage: null,
  messageText: '',
  to: null,
  totalPages: 0,
  totalPagesRemaining: 0,
}

export default Paginator

