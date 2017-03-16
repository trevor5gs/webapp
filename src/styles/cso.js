// @flow
// CSS Style Objects (cso)

import { css } from 'glamor'
import * as jso from './jso'

// -------------------------------------
// Helpers (Web specific)

export const combine = (...styles: Array<string>) => styles.join(' ')

// -------------------------------------
// Configuration (Web specific)

export const minBreak2 = '@media(min-width: 40em)'    // 2: 640  / 16 = 40em
export const minBreak3 = '@media(min-width: 60em)'    // 3: 960  / 16 = 60em
export const minBreak4 = '@media(min-width: 85em)'    // 4: 1360 / 16 = 85em
export const minBreak5 = '@media(min-width: 107.5em)' // 5: 1720 / 16 = 107.5em
export const minBreak6 = '@media(min-width: 130em)'   // 6: 2080 / 16 = 130em
export const minBreak7 = '@media(min-width: 152.5em)' // 7: 2440 / 16 = 152.5em

export const maxBreak2 = '(max-width: 39.9375em)'     // 2: 639  / 16 = 39.9375em

// -------------------------------------
// Typography

export const sansRegular = css(jso.sansRegular)
export const sansItalic = css(jso.sansItalic)
export const sansBold = css(jso.sansBold)
export const sansBoldItalic = css(jso.sansBoldItalic)
export const monoRegular = css(jso.monoRegular)
export const leftAlign = css(jso.leftAlign)
export const center = css(jso.center)
export const rightAlign = css(jso.rightAlign)
export const nowrap = css(jso.nowrap)
export const breakWord = css(jso.breakWord)

// -------------------------------------
// Position

export const relative = css(jso.relative)
export const absolute = css(jso.absolute)
export const fixed = css(jso.fixed)

// -------------------------------------
// Layout

export const block = css(jso.block)
export const inline = css(jso.inline)
export const inlineBlock = css(jso.inlineBlock)
export const displayNone = css(jso.displayNone)
export const visible = css(jso.visible)
export const hidden = css(jso.hidden)
export const fit = css(jso.fit)
export const overflowXHidden = css(jso.overflowVisible)
export const overflowHidden = css(jso.overflowHidden)
export const overflowScroll = css({
  '-webkit-overflow-scrolling': 'touch',
  'overflow-y': 'auto',
})

// -------------------------------------
// Alignment

export const alignBaseline = css(jso.alignBaseline)
export const alignTop = css(jso.alignTop)
export const alignMiddle = css(jso.alignMiddle)
export const alignBottom = css(jso.alignBottom)

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
export const itemsStart = css(jso.itemsStart)
export const itemsEnd = css(jso.itemsEnd)
export const itemsCenter = css(jso.itemsCenter)
export const itemsBaseline = css(jso.itemsBaseline)
export const itemsStretch = css(jso.itemsStretch)
export const contentStart = css(jso.contentStart)
export const contentEnd = css(jso.contentEnd)
export const contentCenter = css(jso.contentCenter)
export const contentBetween = css(jso.contentBetween)
export const contentAround = css(jso.contentAround)
export const contentStretch = css(jso.contentStretch)
export const selfStart = css(jso.selfStart)
export const selfEnd = css(jso.selfEnd)
export const selfCenter = css(jso.selfCenter)
export const selfBaseline = css(jso.selfBaseline)
export const selfStretch = css(jso.selfStretch)

// -------------------------------------
// Colors
// -------------------------------------
// Animations
// -------------------------------------

