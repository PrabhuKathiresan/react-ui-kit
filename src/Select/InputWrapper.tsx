import React from 'react'
import cx from 'classnames'
import isEmpty from 'is-empty'
import Tag from './Tag'
import Close from '../icons/close'
import { noop } from './utils'
import { SelectProps, SelectedValueProps, SelectInputProps } from './props'

const getSelectedValue = (input: SelectedValueProps) => {
  let { selected, multiple, key } = input
  if (multiple) return ''
  return selected[0][key] || ''
}

const Input = (props: SelectInputProps & SelectProps) => {
  let {
    disabled,
    inputClass,
    icons = {},
    selected = [],
    multiple,
    labelKey,
    inputRef,
    placeHolder,
    onFocus = noop,
    onInputChange = noop,
    id,
    extraProps,
    allowClear,
    open,
    textOnly,
    inputProps,
    size = 'default'
  } = props

  let isSmallInput = size === 'sm'
  let hasLeftIcon = !isEmpty(icons.left.component)
  let hasRightIcon = !isEmpty(icons.right.component) && !disabled
  let value = isEmpty(selected) ? '' : getSelectedValue({ selected, multiple, key: labelKey })
  let showClearIcon = (allowClear && !disabled) && (multiple ? !isEmpty(selected) : !isEmpty(value))

  let inputClassHash = {
    'has-left-icon': hasLeftIcon,
    'has-right-icon': hasRightIcon,
    'has-clear-icon': showClearIcon,
    'text-only': textOnly,
    'has-less-padding': isSmallInput,
    'ui-kit-select-has-focus': open
  }

  if (disabled) {
    return (
      <input
        className={cx('ui-kit-select-input', inputClass, inputClassHash)}
        defaultValue={value}
        disabled
        data-testid={`${id}-input-disabled`}
        placeholder={placeHolder}
      />
    )
  }

  return (
    <input
      {...inputProps}
      {...extraProps}
      className={cx('ui-kit-select-input read-only', inputClass, inputClassHash)}
      value={value}
      ref={(input) => inputRef(input)}
      placeholder={placeHolder}
      onFocus={(e) => onFocus(e)}
      readOnly
      id={id}
      data-testid={`${id}-input`}
      onChange={e => onInputChange(e)}
    />
  );
}

const InputWrapper = (props: SelectProps & SelectInputProps) => {
  let {
    onFocus = noop,
    inputClass = '',
    icons = {},
    inputRef,
    placeHolder,
    disabled,
    loading,
    multiple,
    selected = [],
    labelKey,
    onRemove = noop,
    open,
    extraProps,
    id,
    onInputChange = noop,
    onChange = noop,
    allowClear = false,
    size = 'default',
    inputProps
  } = props

  let isSmallInput = size === 'sm'

  let hasLeftIcon = !isEmpty(icons.left.component)
  let hasRightIcon = !isEmpty(icons.right.component) && !disabled
  let iconClass = isSmallInput ? 'ui-kit-select-input-icon-sm' : '';

  let value = isEmpty(selected) ? '' : getSelectedValue({ selected, multiple, key: labelKey })

  let onRightIconClick = (disabled || !hasRightIcon) ? noop : () => icons.right.onClick()

  let showClearIcon = (allowClear && !disabled) && (multiple ? !isEmpty(selected) : !isEmpty(value))

  return (
    <div className='ui-kit-select-input-wrapper'>
      {
        hasLeftIcon ? (
          <span role='button' tabIndex={-1} className={cx('ui-kit-select-input-icon icon-left', iconClass, icons.left.additionalClasses)} onClick={() => icons.left.onClick()}>
            {icons.left.component}
          </span>
        )
          :
          null
      }
      {
        !multiple ? (
          <Input {...props} />
        )
          : (
            <div
              ref={inputRef}
              className={cx('ui-kit-select-input', inputClass, {
                'ui-kit-select-has-focus': open,
                'has-left-icon': hasLeftIcon,
                'has-right-icon': hasRightIcon,
                'has-clear-icon': showClearIcon,
                'has-less-padding': isSmallInput,
                'disabled': disabled
              })}
            >
              {
                selected.map((_selected, i) => (
                  <Tag id={`${id}-selected-input-${i}`} closeable={!disabled} disabled={disabled} onClose={() => onRemove(_selected)} key={i}>
                    {_selected.__label}
                  </Tag>
                ))
              }
              {
                disabled ?
                (
                  <input
                    className='ui-kit-select-multiple-input cursor-not-allowed'
                    disabled
                    placeholder={placeHolder}
                    id={`${id}`}
                    data-testid={`${id}-input-disabled`}
                  />
                )
                :
                (
                  <input
                    className='ui-kit-select-multiple-input cursor-pointer'
                    onFocus={e => onFocus(e)}
                    placeholder={placeHolder}
                    readOnly
                    id={id}
                    data-testid={`${id}-input`}
                    onChange={e => onInputChange(e)}
                    {...inputProps}
                    {...extraProps}
                  />
                )
              }
            </div>
          )
      }
      <>
        {
          showClearIcon && (
            <span role='button' tabIndex={-1} className={cx('ui-kit-select-input-icon clear-icon is-clickable', iconClass, { 'has-right-icon': hasRightIcon })} onClick={() => onChange([])}>
              <Close />
            </span>
          )
        }
        {
          loading ?
            (
              <div className='ui-kit-select-loader-wrapper'>
                <div className='ui-kit-select-loader'>
                  <svg viewBox='22 22 44 44'>
                    <circle className='path' cx='44' cy='44' r='19.5' fill='none' strokeWidth='4' />
                  </svg>
                </div>
              </div>
            )
            :
            hasRightIcon ?
              (
                <span role='button' tabIndex={-1} className={cx('ui-kit-select-input-icon icon-right', iconClass, icons.right.additionalClasses)} onClick={onRightIconClick} ref={icons.right.iconRef}>
                  {icons.right.component}
                </span>
              )
              :
              null
        }
      </>
    </div>
  )
}

export default InputWrapper
