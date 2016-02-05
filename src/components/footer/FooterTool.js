import React from 'react'
import classNames from 'classnames'

export default function FooterTool({ className, icon, label, onClick }) {
  return (
    <button className={classNames(className, 'FooterTool')} onClick={onClick} >
      { icon }
      <span>{ label }</span>
    </button>
  )
}

