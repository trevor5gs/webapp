import React, { Component, PropTypes } from 'react'
import { ElloMark } from '../interface/ElloIcons'

export function emptyPagination() {
  return {
    totalPages: 0,
    totalPagesRemaining: 0,
  }
}

class Paginator extends Component {

  static propTypes = {
    hasShowMoreButton: PropTypes.bool,
    loadNextPage: PropTypes.func.isRequired,
    messageText: PropTypes.string,
    totalPages: PropTypes.number.isRequired,
    totalPagesRemaining: PropTypes.number.isRequired,
  };

  static defaultProps = {
    messageText: '+more..',
  };

  componentWillMount() {
    this.state = { isPaginationLoading: false, message: this.getMessage() }
  }

  getMessage() {
    const { hasShowMoreButton, messageText, totalPages, totalPagesRemaining } = this.props
    if (totalPagesRemaining === 0) {
      return ''
    } else if (hasShowMoreButton) {
      return messageText
    }
    return (totalPages > 0) ?
      `Loading: ${totalPages - totalPagesRemaining + 1} of ${totalPages}` :
      'Loading...'
  }

  setLoading(isPaginationLoading) {
    this.state = { isPaginationLoading, message: this.getMessage() }
  }

  loadMore = () => {
    const { loadNextPage } = this.props
    loadNextPage()
  };

  render() {
    const { isPaginationLoading, message } = this.state
    const { hasShowMoreButton } = this.props
    const classes = isPaginationLoading ? 'Paginator isBusy' : 'Paginator'
    const messageArea = hasShowMoreButton ?
      <button onClick={ this.loadMore }>{ message }</button> :
      <span>{ message }</span>
    return (
      <div className={ classes }>
        <ElloMark />
        { messageArea }
      </div>
    )
  }
}

export default Paginator

