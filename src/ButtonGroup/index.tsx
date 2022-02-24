import React, { Fragment } from 'react'
import cx from 'classnames'
import Button from '../Button'
import Dropdown from '../Dropdown'
import { ButtonGroupProps, ButtonGroupActionProps } from './props'
import { noop } from '../utils'

export default function ButtonGroup(props: ButtonGroupProps) {
  let {
    align = 'center',
    justify = 'left',
    gap = '',
    verticalSpacing = '',
    actions = [],
    theme = 'default',
    size = 'default',
    variant = 'filled',
    containerClass = ''
  } = props

  let computedGroupClass = {}
  if (gap) {
    computedGroupClass[`ui-kit-btn-group__has-gap gap__${gap}`] = true
  }

  if (verticalSpacing) {
    computedGroupClass[`ui-kit-btn-group__space-${verticalSpacing}`] = true
  }

  let renderItem = (action: ButtonGroupActionProps) => {
    let {
      type,
      onClick = noop,
      label,
      extraProps = {},
      component
    } = action;
    if (type === 'dropdown') {
      return (
        <Dropdown
          textContent={label}
          onClick={(item: any) => onClick(item)}
          options={action.options || []}
          position={action.dropdownPosition || 'right'}
          theme={theme}
          variant={variant}
          triggerSize={size}
          {...extraProps}
        />
      )
    }
    if (action.type === 'custom') {
      return component
    }

    return (
      <Button
        onClick={(e: any) => onClick(e)}
        theme={theme}
        variant={variant}
        size={size}
        component={component || 'button'}
        {...extraProps}
      >
        {label}
      </Button>
    )
  }

  return (
    <div
      className={cx('ui-kit-btn-group', `ui-kit-btn-group__align-${align}`, `ui-kit-btn-group__justify-${justify}`, computedGroupClass, containerClass)}
    >
      <div className={cx('element-flex-align-center', { 'element-flex--wrap': Boolean(gap) })}>
        {
          actions.map((action: ButtonGroupActionProps, index: number) => (
            <Fragment key={index}>
              {renderItem(action)}
            </Fragment>
          ))
        }
      </div>
    </div >
  )
}
