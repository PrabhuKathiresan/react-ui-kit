import React from 'react'
import cx from 'classnames'
import { ButtonGroupProps } from './props'

export default function ButtonGroup(props: ButtonGroupProps) {
  let {
    children,
    align = 'center',
    justify = 'left',
    gap = ''
  } = props

  let computedGroupClass = {}
  if (gap) {
    computedGroupClass[`ui-kit-btn-group__has-gap gap__${gap}`] = true
  }

  return (
    <div
      className={cx('ui-kit-btn-group', `ui-kit-btn-group__align-${align}`, `ui-kit-btn-group__justify-${justify}`, computedGroupClass)}
    >
      <div className={cx('element-flex-align-center', { 'element-flex--wrap': Boolean(gap) })}>
        {children}
      </div>
    </div>
  )
}
