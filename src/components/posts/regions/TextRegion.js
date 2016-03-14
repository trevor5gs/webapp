import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import classNames from 'classnames'

/* eslint-disable react/prefer-stateless-function */
class TextRegion extends Component {

  static propTypes = {
    content: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isGridLayout: PropTypes.bool.isRequired,
    postDetailPath: PropTypes.string,
  }

  onClickRegion = (e) => {
    const { dispatch, isGridLayout, postDetailPath } = this.props
    const { classList, dataset, nodeName } = e.target
    // Get the raw value instead of the property value which is always absolute
    const href = e.target.getAttribute('href')

    // Relative links get sent to push (usernames, raw links, hashtags)
    if (href && href[0] === '/') {
      e.preventDefault()
      dispatch(push(href))
      return
    // TODO: We have a special `span` based fake link at the moment we have to test
    // for. Once we change this back to an `<a> element we can rip this out.
    } else if (classList.contains('hashtag-link')) {
      e.preventDefault()
      dispatch(push(dataset.href.replace(/^\/search/, '/find')))
      return

    // Treat non links within grid layouts as a push to it's detail path
    } else if (isGridLayout && postDetailPath && nodeName !== 'A') {
      e.preventDefault()
      dispatch(push(postDetailPath))
      return
    }
    // The alternative is it's either in list and we ignore it or it's an
    // absolute link and we allow it's default behavior.
  }

  render() {
    const { content, isGridLayout, postDetailPath } = this.props
    const isHotRegion = isGridLayout && postDetailPath
    return (
      <div className="TextRegion">
        <div
          className={ classNames('RegionContent', { asHotRegion: isHotRegion }) }
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={ this.onClickRegion }
        />
      </div>
    )
  }
}

export default connect()(TextRegion)

