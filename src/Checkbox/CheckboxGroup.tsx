import React from 'react'
import cx from 'classnames'
import Checkbox from './Checkbox'
import { CheckboxGroupProps } from './props'

export default function (props: CheckboxGroupProps) {
  let {
    options,
    value,
    variant = 'row',
    onChange,
    label,
    required = false
  } = props

  let handleChange = (e: React.ChangeEvent) => {
    onChange(e)
  }

  return (
    <div className='ui-kit-input-block'>
      {
        label && <label className={cx('ui-kit-input-label', { 'is-required': required })}>{label}</label>
      }
      <div className='d-block'>
        <div className={cx('ui-kit-checkbox-group', { 'group-column': variant === 'column' })}>
          {
            options.map((option, index) => (
              <Checkbox
                key={index}
                onChange={handleChange}
                value={option.value}
                checked={value.includes(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </Checkbox>
            ))
          }
        </div>
      </div>
    </div>
  )
}