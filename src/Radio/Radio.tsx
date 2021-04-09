import React from 'react'
import cx from 'classnames'
import { RadioProps } from './props'
import { generateUEID } from '../utils'

export function Radio(props: RadioProps) {
  let {
    disabled = false,
    id = generateUEID(),
    name,
    value,
    checked = false,
    className,
    onChange,
    label
  } = props

  let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  }

  return (
    <label
      className={cx('ui-kit-radio-wrapper', className, { 'ui-kit-radio-wrapper-disabled': disabled })}
    >
      <span
        className={cx('ui-kit-radio', { 'ui-kit-radio-disabled': disabled, 'ui-kit-radio-checked': checked })}
      >
        <input type='radio' id={id} name={name} onChange={(e) => handleChange(e)} className='ui-kit-radio-input' value={value} checked={checked} />
        <span className='ui-kit-radio-inner' />
      </span>
      {label && <span className='ui-kit-radio-label'>{label}</span>}
    </label>
  )
}
