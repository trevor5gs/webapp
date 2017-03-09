// @flow
import React from 'react'
import { css } from 'glamor'
import { MainView } from '../views/MainView'
import StyleGuideIcons from './StyleGuideIcons'
import { flex, minBreak2, wrapperPaddingX } from '../../styles/cso'

const headerStyle = {
  ...wrapperPaddingX,
  ...css({
    paddingTop: 20,
    [minBreak2]: {
      paddingTop: 40,
    },
  }),
}
const h1Style = css({ fontSize: 24 })
const navStyle = {
  ...flex,
  ...css({
    paddingTop: 20,
    paddingBottom: 20,
  }),
}
const buttonStyle = {
  ...css({
    fontSize: 18,
    marginRight: 10,
  }),
}

export default() =>
  <MainView className="StyleGuide">
    <header {...headerStyle}>
      <h1 {...h1Style}>Ello style guide</h1>
      <nav {...navStyle} >
        <button {...buttonStyle}>Icons</button>
      </nav>
    </header>
    <StyleGuideIcons />
  </MainView>

