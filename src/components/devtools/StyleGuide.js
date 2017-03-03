// @flow
import React from 'react'
import { css } from 'glamor'
import { MainView } from '../views/MainView'
import {
  flex,
  minBreak2,
  wrapperPaddingX,
} from '../../styles/cso'

const h1Style = css({ fontSize: 24 })
const h2Style = css({ fontSize: 18 })

const headerStyle = {
  ...wrapperPaddingX,
  ...css({
    paddingTop: 20,
    [minBreak2]: {
      paddingTop: 40,
    },
  }),
}

const sectionStyle = {
  ...flex,
  ...wrapperPaddingX,
}

export default() =>
  <MainView className="StyleGuide">
    <header {...headerStyle}>
      <h1 {...h1Style}>Ello style guide</h1>
    </header>
    <section {...sectionStyle}>
      <h2 {...h2Style}>Icons</h2>
    </section>
  </MainView>

