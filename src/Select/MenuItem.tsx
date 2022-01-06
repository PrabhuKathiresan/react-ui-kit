import React, { Component } from 'react'
import cx from 'classnames'
import { findDOMNode } from 'react-dom'
import scrollIntoView from 'dom-scroll-into-view'
import { MenuItemProps } from './props'
import Check from '../icons/check'

class MenuItem extends Component<MenuItemProps, {}> {
  componentDidUpdate() {
    let {
      activeIndex,
      position,
      menuContainer,
      autoScroll
    } = this.props
    if (!menuContainer) return
    if (activeIndex === position && autoScroll) {
      let container = findDOMNode(this)
      setTimeout(() => {
        scrollIntoView(container, menuContainer, {
          alignWithTop: false,
          offsetBottom: 5,
          onlyScrollIfNeeded: true
        })
      }, 0)
    }
  }

  beforeItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault() 
    if (!this.props.disabled) this.props.onClick()
  }

  render() {
    let {
      position,
      activeIndex,
      selected,
      disabled,
      label,
      id
    } = this.props
    return (
      <div
        role='button'
        tabIndex={0}
        className={cx('ui-kit-select--dropdown_item has-hover-effect', {
          'item-active': activeIndex === position,
          'item-selected': selected,
          'item-disabled': disabled
        })}
        onClick={this.beforeItemClick}
        data-testid={id}
      >
        <span className={cx('ui-kit-select--dropdown_item-text', { 'text--ellipsis': selected })}>{label}</span>
        {selected && <Check className='element-flex--0-auto' width={12} height={12} />}
      </div>
    )
  }
}

export default MenuItem
