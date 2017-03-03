/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-danger */
import React, { PropTypes, PureComponent } from 'react'
import classNames from 'classnames'

export default class TextRegion extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    detailPath: PropTypes.string.isRequired,
    isGridMode: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    onClickRegion: PropTypes.func,
  }

  render() {
    const { content, isGridMode, detailPath } = this.props
    const isHot = isGridMode && detailPath
    return (
      <div className="TextRegion">
        <div
          className={classNames('RegionContent', { isHot })}
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={this.context.onClickRegion}
        />
      </div>
    )
  }
}

