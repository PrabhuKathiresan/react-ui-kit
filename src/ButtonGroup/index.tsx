import React, { Fragment } from 'react'
import cx from 'classnames'
import Button from '../Button'
import Dropdown from '../Dropdown'
import { ButtonGroupProps, ButtonGroupActionProps } from './props'

export default function ButtonGroup(props: ButtonGroupProps) {
  const {
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

  const computedGroupClass = {}
  if (gap) {
    computedGroupClass[`ui-kit-btn-group__has-gap gap__${gap}`] = true
  }

  if (verticalSpacing) {
    computedGroupClass[`ui-kit-btn-group__space-${verticalSpacing}`] = true
  }

  const renderItem = (action: ButtonGroupActionProps) => {
    if (action.type === 'dropdown') {
      return (
        <Dropdown
          textContent={action.label}
          onClick={(item: any) => action.onClick(item)}
          options={action.options || []}
          position={action.dropdownPosition || 'right'}
          theme={theme}
          variant={variant}
          triggerSize={size}
          {...action.extraProps}
        />
      )
    }
    if (action.type === 'custom') {
      return action.component
    }

    return (
      <Button
        onClick={(e: any) => action.onClick(e)}
        theme={theme}
        variant={variant}
        size={size}
        component={action.component || 'button'}
        {...action.extraProps}
      >
        {action.label}
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
