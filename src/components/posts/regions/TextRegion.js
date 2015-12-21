import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import classNames from 'classnames'

class TextRegion extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    isGridLayout: PropTypes.bool.isRequired,
    postDetailPath: PropTypes.string,
  }

  handleGridRegionClick(e) {
    const { MoreButton } = this.refs
    if (e.target.classList.contains('hashtag-link')) {
      e.preventDefault()
      const href = e.target.getAttribute('data-href').replace(/^\/search/, '/find')
      const link = document.createElement('a')
      link.href = href
      return link.click()
    }
    if (e.target.nodeName !== 'A') {
      e.preventDefault()
      return ReactDOM.findDOMNode(MoreButton).click()
    }
  }

  render() {
    const { content, isGridLayout, postDetailPath } = this.props
    const isHotRegion = isGridLayout && postDetailPath
    return (
      <div className="TextRegion">
        <div
          className={classNames('RegionContent', { asHotRegion: isHotRegion })}
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={isHotRegion ? (::this.handleGridRegionClick) : null}
          />
          <Link
            className="invisible"
            ref="MoreButton"
            to={postDetailPath}>
            More
          </Link>
      </div>
    )
  }
}

export default TextRegion

