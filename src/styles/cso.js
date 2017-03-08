// @flow

// CSS Style Objects (cso)

import { css } from 'glamor'
import * as jso from './jso'

// -------------------------------------
// Configuration

export const minBreak2 = '@media(min-width: 40em)'    // 2: 640  / 16 = 40em
export const minBreak3 = '@media(min-width: 60em)'    // 3: 960  / 16 = 60em
export const minBreak4 = '@media(min-width: 85em)'    // 4: 1360 / 16 = 85em
export const minBreak5 = '@media(min-width: 107.5em)' // 5: 1720 / 16 = 107.5em
export const minBreak6 = '@media(min-width: 130em)'   // 6: 2080 / 16 = 130em
export const minBreak7 = '@media(min-width: 152.5em)' // 7: 2440 / 16 = 152.5em

export const maxBreak2 = '(max-width: 39.9375em)'     // 2: 639  / 16 = 39.9375em

// -------------------------------------
// Typography
// -------------------------------------
// Position
// -------------------------------------
// Layout
// -------------------------------------
// Alignment
// -------------------------------------
// Paddings

export const wrapperPaddingX = css({
  ...jso.wrapperPaddingX,
  [minBreak2]: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  [minBreak4]: {
    paddingRight: 40,
    paddingLeft: 40,
  },
})

// -------------------------------------
// Margins
// -------------------------------------
// Flex

export const flex = css(jso.flex)
export const inlineFlex = css(jso.inlineFlex)
export const flexColumn = css(jso.flexColumn)
export const flexRow = css(jso.flexRow)
export const flexWrap = css(jso.flexWrap)
export const flexNoWrap = css(jso.flexNoWrap)
export const justifyStart = css(jso.justifyStart)
export const justifyEnd = css(jso.justifyEnd)
export const justifyCenter = css(jso.justifyCenter)
export const justifySpaceBetween = css(jso.justifySpaceBetween)
export const justifySpaceAround = css(jso.justifySpaceAround)

// -------------------------------------
// Colors
// -------------------------------------
// Animations
// -------------------------------------

