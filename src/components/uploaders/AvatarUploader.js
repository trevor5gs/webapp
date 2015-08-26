import React from 'react'
import { Button } from '../buttons/Button'

class AvatarUploader extends React.Component {
  render() {
    return (
      <div className="AvatarUploader">
        <figure className="Avatar"></figure>
        <Button>Pick an Avatar</Button>
        <p>Or drag & drop</p>
        <p>Recommended image size: 360 x 360</p>
      </div>
    )
  }
}

export default AvatarUploader

