import React from 'react'
import cx from 'classnames'
import isEmpty from 'is-empty'
import Tag from './Tag'
import Close from '../icons/close'
import { SelectedValueProps, SelectInputProps } from './props'
import { noop } from '../utils'
import Loader from '../Loader'

const getSelectedValue = (input: SelectedValueProps) => {
  let { selected = [], multiple, key } = input
  if (multiple || isEmpty(selected)) return ''
  return selected[0][key] || ''
}

const Input = (props: SelectInputProps) => {
  let {
    disabled,
    inputClass,
    icons = {},
    selected = [],
    multiple,
    labelKey,
    inputRef,
    placeholder,
    onFocus = noop,
    onInputChange = noop,
    id,
    extraProps,
    allowClear,
    open,
    textOnly,
    inputProps,
    inputSize = 'default',
    borderless
  } = props

  let isSmallInput = inputSize === 'small'
  let isLargeInput = inputSize === 'large'
  let hasLeftIcon = !isEmpty(icons.left.component)
  let hasRightIcon = !isEmpty(icons.right.component) && !disabled
  let value = getSelectedValue({ selected, multiple, key: labelKey })
  let showClearIcon = (allowClear && !disabled) && (multiple ? !isEmpty(selected) : !isEmpty(value))

  let inputClassHash = {
    'has-left-icon': hasLeftIcon,
    'has-right-icon': hasRightIcon,
    'has-clear-icon': showClearIcon,
    'text-only': textOnly,
    'has-less-padding': isSmallInput,
    'ui-kit-select-has-focus': open,
    'ui-kit-select-input__borderless': borderless,
    'ui-kit-select-input_sm': isSmallInput,
    'ui-kit-select-input_lg': isLargeInput
  }

  if (disabled) {
    return (
      <input
        className={cx('ui-kit-select-input', inputClass, inputClassHash)}
        defaultValue={value}
        disabled
        data-testid={`${id}-input-disabled`}
        placeholder={placeholder}
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
      placeholder={placeholder}
      onFocus={(e) => onFocus(e)}
      readOnly
      id={id}
      data-testid={`${id}-input`}
      onChange={e => onInputChange(e)}
    />
  );
}

const InputWrapper = (props: SelectInputProps) => {
  let {
    onFocus = noop,
    inputClass = '',
    icons = {},
    inputRef,
    placeholder,
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
    inputSize = 'default',
    inputProps,
    borderless
  } = props

  let isSmallInput = inputSize === 'small'
  let isLargeInput = inputSize === 'large'

  let hasLeftIcon = !isEmpty(icons.left.component)
  let hasRightIcon = !isEmpty(icons.right.component) && !disabled
  let iconClass = '';

  if (isSmallInput) {
    iconClass = 'ui-kit-select-input-icon-sm';
  } else if (isLargeInput) {
    iconClass = 'ui-kit-select-input-icon-lg';
  }

  let value = isEmpty(selected) ? '' : getSelectedValue({ selected, multiple, key: labelKey })

  let onRightIconClick = (disabled || !hasRightIcon) ? noop : () => icons.right.onClick()

  let showClearIcon = (allowClear && !disabled) && (multiple ? !isEmpty(selected) : !isEmpty(value))

  let renderRightIcon = () => {
    if (loading) {
      return (
        <div className='ui-kit-select-loader-wrapper'>
          <Loader strokeWidth={4} size={16} />
        </div>
      )
    }

    return hasRightIcon ? (
      <span role='button' tabIndex={-1} className={cx('ui-kit-select-input-icon icon-right', iconClass, icons.right.additionalClasses)} onClick={onRightIconClick} ref={icons.right.iconRef}>
        {icons.right.component}
      </span>
    ) : null
  }

  let renderTags = () => selected.map((_selected, i) => (
    <Tag id={`${id}-selected-input-${i}`} closeable={!disabled} disabled={disabled} onClose={() => onRemove(_selected)} key={i}>
      {_selected.__label}
    </Tag>
  ))

  let renderMultipleInput = () => {
    if (disabled) {
      return (
        <input
          className='ui-kit-select-multiple-input cursor-not-allowed'
          disabled
          placeholder={placeholder}
          id={`${id}`}
          data-testid={`${id}-input-disabled`}
        />
      )
    }

    return (
      <input
        className='ui-kit-select-multiple-input cursor-pointer'
        onFocus={e => onFocus(e)}
        placeholder={placeholder}
        readOnly
        id={id}
        data-testid={`${id}-input`}
        onChange={e => onInputChange(e)}
        {...inputProps}
        {...extraProps}
      />
    )
  }

  let renderInput = () => multiple ? (
    <div
      ref={inputRef}
      className={cx('ui-kit-select-input', inputClass, {
        'ui-kit-select-has-focus': open,
        'has-left-icon': hasLeftIcon,
        'has-right-icon': hasRightIcon,
        'has-clear-icon': showClearIcon,
        'has-less-padding': isSmallInput,
        'disabled': disabled,
        'ui-kit-select-input__borderless': borderless,
        'ui-kit-select-input_sm': isSmallInput,
        'ui-kit-select-input_lg': isLargeInput
      })}
    >
      {renderTags()}
      {renderMultipleInput()}
    </div>
  ) : <Input {...props} />

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
      {renderInput()}
      <>
        {
          showClearIcon && (
            <span role='button' tabIndex={-1} className={cx('ui-kit-select-input-icon clear-icon is-clickable', iconClass, { 'has-right-icon': hasRightIcon })} onClick={() => onChange([])}>
              <Close />
            </span>
          )
        }
        {renderRightIcon()}
      </>
    </div>
  )
}

export default InputWrapper
