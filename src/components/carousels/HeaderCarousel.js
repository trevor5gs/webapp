import React from 'react'
import { PaddleButton } from '../buttons/PaddleButton'

class HeaderCarousel extends React.Component {
  render() {
    return (
      <div className="HeaderCarousel">
        <div className="Paddles">
          <PaddleButton />
          <PaddleButton />
        </div>
      </div>
    )
  }
}

export default HeaderCarousel

