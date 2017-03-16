// @flow
import React from 'react'
import { css } from 'glamor'
import { MainView } from '../views/MainView'
import StyleGuideIcons from './StyleGuideIcons'
import { combine, flex, minBreak2, wrapperPaddingX } from '../../styles/cso'

const headerStyle = combine(
  wrapperPaddingX,
  css({
    paddingTop: 20,
    [minBreak2]: {
      paddingTop: 40,
    },
  }),
)
const h1Style = css({ fontSize: 24 })
const navStyle = combine(
  flex,
  css({
    paddingTop: 20,
    paddingBottom: 20,
  }),
)
const buttonStyle = css({
  fontSize: 18,
  marginRight: 10,
})

export default() =>
  <MainView className="StyleGuide">
    <header className={headerStyle}>
      <h1 className={h1Style}>Ello style guide</h1>
      <nav className={navStyle} >
        <button className={buttonStyle}>Icons</button>
      </nav>
    </header>
    <StyleGuideIcons />
  </MainView>

