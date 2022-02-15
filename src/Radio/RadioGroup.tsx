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
    error,
    id
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
                disabled={option.disabled}
                onChange={(e: Event) => onChange(e)}
              />
            ))
          }
        </div>
      </div>
      {error && <span className='text--danger pt-4 element-flex' data-testid={`${id}-input-error`}>{error}</span>}
    </div>
  )
}
