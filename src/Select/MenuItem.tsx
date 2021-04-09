import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import scrollIntoView from 'dom-scroll-into-view'
import { MenuItemProps } from './props'

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
    this.props.onClick()
  }

  render() {
    let {
      position,
      activeIndex,
      selected,
      label,
      id
    } = this.props
    return (
      <div
        role='button'
        tabIndex={0}
        className={`ui-kit-select--dropdown_item has-hover-effect${(activeIndex === position) ? ' item-active' : ''}${selected ? ' item-selected' : ''}`}
        onClick={this.beforeItemClick}
        data-testid={id}
      >
        <span className='ui-kit-select--dropdown_item-text'>{label}</span>
      </div>
    )
  }
}

export default MenuItem
