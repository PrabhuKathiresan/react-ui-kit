import React, { ButtonHTMLAttributes, MouseEvent } from 'react'
import cx from 'classnames'
import Loader from '../Loader'
import { generateUEID, noop } from '../utils'
import { ButtonProps } from './props'

const LoaderIconSize = {
  tiny: 14,
  small: 16,
  default: 18,
  medium: 20,
  large: 24
}

function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps, ref: any = noop) {
  let {
    children,
    icon = { left: null, right: null },
    loading = false,
    loadingText = '',
    disabled = false,
    className = '',
    block = false,
    bold = false,
    link = false,
    theme = 'default',
    variant = theme !== 'default' ? 'filled' : '',
    size = 'default',
    iconOnly = false,
    iconTheme = '',
    raised = false,
    onClick = noop,
    id = generateUEID(),
    component: Tag = 'button',
    ...btnProps
  } = props

  let computedClassNames = {
    'ui-kit-btn-block': block,
    'ui-kit-btn-raised': raised,
    'text-bold': bold,
    'as-link': link,
    'icon-only': iconOnly
  }

  let isFilledBtn = variant === 'filled'

  if (variant) computedClassNames[`ui-kit-btn__${variant}`] = true

  let iconComputerClass = {
    [`ui-kit-btn-icon-${iconTheme}`]: Boolean(iconTheme)
  }

  let loader = (loaderIconClass: string) => <span className={loaderIconClass}><Loader theme='currentColor' size={LoaderIconSize[size]} /></span>

  let renderIcon = (placement: string) => {
    let iconClass = cx('element-flex-center', `ui-kit-btn-icon-${placement}`, { 'mr-0': !children }, iconComputerClass)
    if (placement === 'left' && loading && !iconOnly) return loader(iconClass)

    if (!icon[placement]) return null

    return <span className={iconClass}>{icon[placement]}</span>
  }

  let content = () => {
    if (loading && iconOnly) {
      let iconClass = cx('element-flex-center', `ui-kit-btn-icon-center`, { 'mr-0': !children }, iconComputerClass)
      return loader(iconClass)
    }
    return (loading && loadingText) ? loadingText : children
  }

  let handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.persist()
    isFilledBtn && createRipple(e)
    onClick(e)
  }

  let createRipple = ({ clientX, clientY }: any) => {
    let ele = document.getElementById(id)

    if (ele) {
      let circle = document.createElement('span')
      let diameter = Math.max(ele.clientWidth, ele.clientHeight)
      let radius = diameter / 2
      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${clientX - (ele.offsetLeft + radius)}px`
      circle.style.top = `${clientY - (ele.offsetTop + radius)}px`
      circle.classList.add('ripple')

      let ripple = ele.getElementsByClassName('ripple')[0]

      if (ripple) ripple.remove()

      ele.appendChild(circle)
    }
  }

  return (
    <Tag ref={ref} id={id} onClick={handleClick} className={cx('ui-kit-btn', `ui-kit-btn-${theme}`, `ui-kit-btn-size-${size}`, className, computedClassNames)} disabled={loading || disabled} {...btnProps}>
      {renderIcon('left')}
      <span className={cx('element-flex-center ui-kit-btn-content')}>
        {content()}
      </span>
      {renderIcon('right')}
    </Tag>
  )
}

export default React.forwardRef(Button)
