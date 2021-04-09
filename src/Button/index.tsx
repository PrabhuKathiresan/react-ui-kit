import React, { ButtonHTMLAttributes } from 'react'
import cx from 'classnames'
import { noop } from '../utils'
import { ButtonProps } from './props'

function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) {
  let {
    children,
    icon = { left: null, right: null },
    loading = false,
    loadingText = '',
    disabled = false,
    className = '',
    ref= noop,
    block = false,
    large = false,
    small = false,
    tiny = false,
    bold = false,
    plain = false,
    link = false,
    theme = 'default',
    ...btnProps
  } = props

  let computedClassNames = {
    'ui-btn-block': block,
    'is-large': large,
    'text-bold': bold,
    'is-plain': plain,
    'as-link': link,
    'is-small': small,
    'is-very-small': tiny
  }

  return (
    <button ref={ref} className={cx('ui-btn', `ui-btn-${theme}`, className, computedClassNames)} disabled={disabled} {...btnProps}>
      <div className='ui-btn-text'>
        {
          loading ?
          <span className='ui-btn-loader' /> :
          icon.left ? <span className={cx('d-flex align-center ui-btn-icon-left', { 'mr-0': !children })}>{icon.left}</span> : null
        }
        <span className={cx('d-flex align-center ui-btn-content')}>
          {
            loading && loadingText ? loadingText : children
          }
        </span>
        {
          icon.right ? <span className={cx('d-flex align-center ui-btn-icon-right', { 'ml-0': !children })}>{icon.right}</span> : null
        }
      </div>
    </button>
  )
}

export default Button
