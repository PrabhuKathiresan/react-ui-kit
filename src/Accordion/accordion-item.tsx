import React, { useRef } from 'react'
import cx from 'classnames'
import { Transition } from 'react-transition-group'
import { AccordionItemProps as Props } from './props'
import ChevronUp from '../icons/chevron-up'
import { getHeightTransition } from '../utils'

export default function AccordionItem(props: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<HTMLDivElement>(null)
  let {
    index,
    activeIndex,
    onClick,
    name,
    content,
    total,
    type = 'default',
    variant = 'bordered',
    iconPlacement,
    icon = <ChevronUp className='ui-kit-accordion-trigger-icon rotate-180' width={14} />,
    activeIcon = <ChevronUp className='ui-kit-accordion-trigger-icon rotate-0' width={14} />,
    transitionDuration
  } = props
  let isActive = activeIndex.includes(index)
  let spacious = type === 'spacious'
  let itemClass = {
    'border-radius mb-8 overflow-hidden': spacious,
    'border': variant === 'bordered' && spacious,
    'has-shadow-sm': spacious && isActive
  }
  let triggerClass = {
    'is-active': isActive,
    'border-top': !spacious && (isActive && index > 0)
  }
  let Icon = () => (
    <span className={cx('element-flex', iconPlacement === 'end' ? 'mx-8' : 'mr-12')}>
      {isActive ? activeIcon : icon}
    </span>
  )

  return (
    <div className={cx('ui-kit-accordion-item', { 'accordion-item--open': isActive }, itemClass)}>
      <div
        className={cx('ui-kit-accordion-trigger element-flex-align-center', triggerClass)}
        onClick={() => onClick(index)}
        role='button'
      >
        {iconPlacement === 'start' && <Icon />}
        <span className='mr-auto'>{name}</span>
        {iconPlacement === 'end' && <Icon />}
      </div>
      <Transition
        in={isActive}
        mountOnEnter
        unmountOnExit
        onExit={() => {
          if (transitionRef.current && contentRef.current) {
            transitionRef.current.style.height = `${contentRef.current.clientHeight}px`
          }
        }}
        timeout={{ enter: transitionDuration, exit: transitionDuration, appear: 0 }}
      >
        {(state) => (
          <div ref={transitionRef} style={{
            ...getHeightTransition(contentRef.current ? contentRef.current.clientHeight : 'auto')[state],
            transition: `all ${transitionDuration}ms ease-out`
          }}>
            <div ref={contentRef} className={cx('ui-kit-accordion-content', { 'border-bottom': (!spacious && !(total === (index + 1))) })}>
              {content}
            </div>
          </div>
        )}
      </Transition>
    </div>
  )
}
