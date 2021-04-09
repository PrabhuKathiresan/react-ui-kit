import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import MenuItem from './MenuItem'
import { MenuProps, OptionProps } from './props'

function getTranslate(placement: string) {
  const translateMap = {
    bottom: 'translate3d(0, 120%, 0)',
    top: 'translate3d(0, -120%, 0)',
  };

  return translateMap[placement];
}

const transformStyle = (placement: string) => ({
  entering: { transform: getTranslate(placement) },
  entered: { transform: 'translate3d(0,0,0)' },
  exiting: { transform: getTranslate(placement)},
  exited: { transform: getTranslate(placement) },
})

const overflowSyle = {
  entering: 'hidden',
  entered: 'visible',
  exiting: 'hidden',
  exited: 'hidden'
}

const Menu = (props: MenuProps) => {
  let displayName = 'menu-item'
  let searchInput = useRef<HTMLInputElement | null>(null)

  let [menu, setMenu] = useState<null | HTMLDivElement>(null)

  let {
    maxHeight, options, selected, activeIndex, loading, labelKey,
    isDirty, style, menuRef, onMenuClick, autoScroll, disableAutoScroll,
    searchInputProps, searchable, scrollableAreaRef, id, transitionState, transitionDuration
  } = props

  let { dropup, ...menuPositionStyle } = style

  useEffect(() => {
    if (transitionState === 'entered') {
      let input = searchInput.current
      setTimeout(() => {
        input?.focus()
      }, dropup ? transitionDuration : 0);
    }
  }, [transitionState])

  let isSelected = (option: OptionProps) => {
    let _selected = [...selected].shift()
    return _selected && option[labelKey] === _selected[labelKey]
  }

  let handleMenuScroll = () => {
    disableAutoScroll()
  }

  return (
    <div
      className={cx('ui-kit-select--dropdown')}
      style={{
        width: menuPositionStyle.width,
        margin: dropup ? '16px 16px 2px' : '2px 16px 16px',
        overflow: overflowSyle[transitionState]
      }}
      ref={menuRef}
      data-testid={`${id}-dropdown`}
    >
      <div
        className={cx('ui-kit-select--transition')}
        style={{
          transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
          ...transformStyle(dropup ? 'bottom' : 'top')[transitionState]
        }}
      >
        <div className={cx('ui-kit-select--popup', { 'pt-4': !searchable || dropup, 'pb-4': !searchable || !dropup, 'column-reverse': dropup })}>
          {
            searchable && (
              <div className={cx('ui-kit-select--search-input-wrapper', { 'mb-8': !dropup, 'mt-8': dropup })}>
                <input
                  type='search'
                  autoComplete='off'
                  onFocus={(e) => e.target.select()}
                  className={cx('ui-kit-select--search-input', { dropup })}
                  placeholder='Search...'
                  tabIndex={-1}
                  {...searchInputProps}
                  data-testid={`${id}-search-input`}
                  ref={searchInput}
                />
              </div>
            )
          }
          <div
            className='scroll-y'
            ref={(m) => {
              setMenu(m)
              scrollableAreaRef(m)
            }}
            onScroll={handleMenuScroll}
            style={{ maxHeight }}
          >
            {
              loading ?
                <div className='ui-kit-select--dropdown_item item-disabled'>Searching...</div>
                :
                options.length === 0 ? (
                  <div className='ui-kit-select--dropdown_item item-disabled' data-testid={`${id}-options-empty`}>
                    {
                      (isDirty || !searchable) ? 'No result found' : 'Type to search...'
                    }
                  </div>
                )
                  :
                  options.map((option, i) => (
                    <MenuItem
                      key={`${displayName}-${i}`}
                      label={option.__label}
                      activeIndex={activeIndex}
                      position={i}
                      selected={isSelected(option) || false}
                      menuContainer={menu}
                      onClick={() => onMenuClick(option, i)}
                      autoScroll={autoScroll}
                      id={`${id}-options-${i}`}
                    />
                  ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
