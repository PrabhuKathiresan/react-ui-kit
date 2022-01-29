import React, { useState } from 'react'
import cx from 'classnames'
import AccordionItem from './accordion-item'
import { AccordionItem as ItemProp, AccordionProps } from './props'

export default function Accordion(props: AccordionProps) {
  let {
    items = [],
    defaultFirstItemOpen = false,
    wrapperClass = '',
    multiple = false,
    keepOpen = false,
    type = 'default',
    variant = 'bordered',
    icon,
    activeIcon,
    iconPlacement = 'end',
    transitionDuration = 250
  } = props
  let [activeIndex, setActiveIndex] = useState<Array<number>>(defaultFirstItemOpen ? [0] : [])

  let changeIndex = (index: number) => {
    let _activeIndex = [...activeIndex]
    if (multiple) {
      let i = _activeIndex.indexOf(index)
      if (i > -1) {
        _activeIndex.splice(i, 1)
      } else {
        _activeIndex.push(index)
      }
    } else {
      if (keepOpen) {
        _activeIndex = [index]
      } else {
        if (_activeIndex.includes(index)) {
          _activeIndex = []
        } else {
          _activeIndex = [index]
        }
      }
    }
    return setActiveIndex(_activeIndex)
  }

  let accordionClass = {
    'border-radius': type === 'default',
    'pa-12': type === 'spacious',
    'border': (variant === 'bordered' && type !== 'spacious')
  }

  return (
    <div className={cx('ui-kit-accordion', wrapperClass, accordionClass)}>
      {
        items.map((item: ItemProp, index: number) => (
          <AccordionItem
            activeIndex={activeIndex}
            onClick={changeIndex}
            index={index}
            content={item.content}
            name={item.name}
            key={item.id || index}
            total={items.length}
            type={type}
            variant={variant}
            icon={icon}
            iconPlacement={iconPlacement}
            activeIcon={activeIcon}
            transitionDuration={transitionDuration}
          />
        ))
      }
    </div>
  )
}
