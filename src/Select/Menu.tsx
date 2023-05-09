import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import MenuItem from './MenuItem'
import { MenuProps, OptionProps } from './props'
import { getMenuAnimationStyle } from '../utils'

const Menu = (props: MenuProps) => {
  const displayName = 'menu-item'
  const searchInput = useRef<HTMLInputElement | null>(null)

  const [menu, setMenu] = useState<null | HTMLDivElement>(null)

  const {
    selected, activeIndex, labelKey, style, menuRef, onMenuClick, autoScroll,
    searchInputProps, searchable, id, transitionState, transitionDuration, options,
    maxHeight, loading, isDirty, disableAutoScroll, scrollableAreaRef, minDropdownWidth,
    containerMargin, allowCreate, onCreate, closeMenu
  } = props

  const { dropup = false, ...menuPositionStyle } = style

  useEffect(() => {
    if (transitionState === 'entered') {
      const input = searchInput.current
      setTimeout(() => {
        input?.focus()
      }, dropup ? transitionDuration : 0)
    }
  }, [transitionState])

  const isSelected = (option: OptionProps) => {
    const _selected = [...selected].shift()
    return _selected && option[labelKey] === _selected[labelKey]
  }

  const handleMenuScroll = () => {
    disableAutoScroll()
  }

  const handleOnCreate = () => {
    onCreate(searchInputProps.value)
    return closeMenu()
  }

  const emptyStateText = (isDirty || !searchable) ? 'No result found' : 'Type to search...'

  const renderCreateOption = () => (
    <div className='ui-kit-select--dropdown_item has-hover-effect'>
      <span className='d-block w-100' role='button' onClick={handleOnCreate}>
        + Create "{searchInputProps.value}"
      </span>
    </div>
  )

  const renderEmptyState = () => (
    allowCreate ? renderCreateOption() : (
      <div className='ui-kit-select--dropdown_item item-as-plain-text' data-testid={`${id}-options-empty`}>
        {emptyStateText}
      </div>
    )
  )

  const renderOptions = () => (options.length === 0 ?
    renderEmptyState()
    :
    (
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
          disabled={option.disabled || false}
        />
      ))
    )
  )

  return (
    <div
      className={cx('ui-kit-select--dropdown')}
      style={{
        width: menuPositionStyle.width,
        minWidth: minDropdownWidth,
        margin: containerMargin || (dropup ? '16px 16px 2px' : '2px 16px 16px'),
        overflow: 'visible'
      }}
      ref={menuRef}
      data-testid={`${id}-dropdown`}
    >
      <div
        className={cx('ui-kit-select--transition')}
        style={getMenuAnimationStyle({ transitionDuration, transitionState, dropup })}
      >
        <div className={cx('ui-kit-select--popup', { 'pt-4': !searchable || dropup, 'pb-4': !searchable || !dropup, 'column-reverse': dropup })}>
          {
            searchable && (
              <div className={cx('ui-kit-select--search-input-wrapper', { 'mb-8': !dropup, 'mt-8': dropup })}>
                <input
                  type='search'
                  autoComplete='off'
                  onFocus={(e) => e.target.select()}
                  className={cx('ui-kit-select--search-input text--ellipsis', { dropup })}
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
                <div className='ui-kit-select--dropdown_item item-as-plain-text'>Searching...</div>
                :
                renderOptions()
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
