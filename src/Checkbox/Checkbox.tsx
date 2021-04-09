import React, { useRef } from 'react'
import cx from 'classnames'
import { noop } from '../utils'
import { CheckboxProps } from './props'

export default function (props: CheckboxProps) {
  let {
    type = 'checkbox',
    tabIndex,
    checked,
    defaultChecked,
    value,
    indeterminate = false,
    onChange = noop,
    name,
    id,
    className,
    subTitle,
    children,
    disabled,
    variant = 'default',
    ...others
  } = props

  let globalProps = Object.keys(others).reduce((prev, key) => {
    if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
      prev[key] = others[key];
    }
    return prev;
  }, {});

  let checkbox = useRef<HTMLInputElement | null>(null)

  let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  }

  let checkboxStyle = variant === 'bordered' ? 'ui-kit-checkbox-wrapper-bordered' : ''

  return (
    <label className={cx('ui-kit-checkbox-wrapper', checkboxStyle, className, { 'ui-kit-checkbox-wrapper-disabled': disabled })}>
      <span className={cx('ui-kit-checkbox', { 'ui-kit-checkbox-disabled': disabled, 'ui-kit-checkbox-indeterminate': indeterminate && !checked, 'ui-kit-checkbox-checked': checked })}>
        <input
          name={name}
          id={id}
          type={type}
          tabIndex={tabIndex}
          value={value}
          ref={checkbox}
          checked={checked}
          disabled={disabled}
          defaultChecked={defaultChecked}
          onChange={(e) => handleChange(e)}
          className={cx('ui-kit-checkbox-input')}
          {...globalProps}
        />
        <span className='ui-kit-checkbox-inner' />
      </span>
      {
        children &&
        (
          <span>
            <span className={cx('ui-kit-checkbox-label')}>{children}</span>
            {
              subTitle &&
              (
                <span className='ui-kit-checkbox-subtitle'>{subTitle}</span>
              )
            }
          </span>
        )
      }
    </label>
  )
}
