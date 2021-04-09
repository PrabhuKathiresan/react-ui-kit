import React from 'react'
import cx from 'classnames'
import { Radio } from './Radio'
import { RadioGroupProps } from './props'

export function RadioGroup(props: RadioGroupProps) {
  let {
    options,
    value,
    onChange,
    label,
    required = false,
    variant = 'row',
  } = props

  return (
    <div className='ui-kit-input-block'>
      {
        label && <label className={cx('ui-kit-input-label', { 'is-required': required })}>{label}</label>
      }
      <div className='d-block'>
        <div className={cx('ui-kit-radio-group', { 'group-column': variant === 'column' })}>
          {
            options.map((option, i) => (
              <Radio
                key={i}
                label={option.label}
                checked={option.value === value}
                value={option.value}
                onChange={(e: Event) => onChange(e)}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}
