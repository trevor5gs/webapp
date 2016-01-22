import React, { Component, PropTypes } from 'react'
import FormControl from './FormControl'

class LinksControl extends Component {

  getLinks() {
    const { text } = this.props
    const links = text || ''
    if (typeof links === 'string') {
      return links
    }
    return links.map((link) => {
      return link.text
    }).join(', ')
  }

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        maxLength="50"
        text={ this.getLinks() }
        type="text"
      />
    )
  }
}

LinksControl.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
}

LinksControl.defaultProps = {
  className: 'LinksControl',
  id: 'external_links',
  label: 'Links',
  name: 'user[links]',
  placeholder: 'Links (optional)',
}

export default LinksControl

