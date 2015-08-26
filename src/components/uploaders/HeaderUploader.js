import React from 'react'
import { Button } from '../buttons/Button'

class HeaderUploader extends React.Component {
  render() {
    return (
      <div className="HeaderUploader">
        <Button>Upload a header image</Button>
        <p>Or drag & drop</p>
        <p>Recommended image size: 2560 x 1440</p>
      </div>
    )
  }
}

export default HeaderUploader

