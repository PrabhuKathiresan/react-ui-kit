import React, { CSSProperties, useRef } from 'react'
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
    searchable,
    placeholder = searchable ? 'Search...' : 'Select...',
    onFocus = noop,
    onClick = noop,
    onBlur = noop,
    onInputChange = noop,
    onRemove = noop,
    id,
    extraProps,
    allowClear,
    open,
    textOnly,
    inputProps = {},
    inputSize = 'default',
    borderless,
    height
  } = props

  let isSmallInput = inputSize === 'small'
  let isLargeInput = inputSize === 'large'
  let hasLeftIcon = !isEmpty(icons.left.component)
  let hasRightIcon = !isEmpty(icons.right.component) && !disabled
  let value = getSelectedValue({ selected, multiple, key: labelKey })
  let showClearIcon = (allowClear && !disabled) && (multiple ? !isEmpty(selected) : !isEmpty(value))
  let inputEle = useRef<HTMLInputElement | null>(null)
  let isTextOnlyAndBorderLess = textOnly && borderless

  let inputClassHash = {
    'has-left-icon': hasLeftIcon,
    'has-right-icon': hasRightIcon,
    'has-clear-icon': showClearIcon,
    'text-only': textOnly,
    'has-less-padding': isSmallInput || isTextOnlyAndBorderLess,
    'ui-kit-select-has-focus': open,
    'ui-kit-select-input__borderless': borderless,
    'ui-kit-select-input_sm': isSmallInput,
    'ui-kit-select-input_lg': isLargeInput
  }

  let renderValue = () => multiple ? renderTags() : <span className='text--ellipsis'>{value}</span>

  let renderTags = () => selected.map((_selected, i) => (
    <Tag id={`${id}-selected-input-${i}`} closeable={!disabled} disabled={disabled} onClose={() => onRemove(_selected)} key={i}>
      {_selected.__label}
    </Tag>
  ))

  let style: CSSProperties = {}

  if (isTextOnlyAndBorderLess) {
    style.width = 'auto'
  }

  if (multiple) {
    style.minHeight = height
  }

  if (disabled) {
    return (
      <div
        className={cx('ui-kit-select-input disabled', inputClass, inputClassHash)}
        defaultValue={value}
        data-testid={`${id}-input-disabled`}
        style={style}
      >
        {renderValue()}
      </div>
    )
  }

  return (
    <div
      {...inputProps}
      {...extraProps}
      style={style}
      className={cx('ui-kit-select-input text--ellipsis read-only', inputClass, inputClassHash)}
      ref={(input: HTMLInputElement) => {
        inputEle.current = input
        inputRef(input)
      }}
      placeholder={placeholder}
      onFocus={(e) => onFocus(e)}
      onClick={e => onClick(e)}
      onBlur={e => onBlur(e)}
      readOnly
      id={id}
      data-testid={`${id}-input`}
      onChange={e => onInputChange(e)}
      tabIndex={inputProps.tabIndex || 0}
    >
      {(value || !!selected.length) ?
        renderValue() :
        <span className='text--placeholder user-select-none'>{placeholder}</span>}
    </div>
  )
}

const InputWrapper = (props: SelectInputProps) => {
  let {
    icons = {},
    disabled,
    loading,
    multiple,
    selected = [],
    labelKey,
    onChange = noop,
    allowClear = false,
    inputSize = 'default',
    borderless,
    textOnly
  } = props

  let isSmallInput = inputSize === 'small'
  let isLargeInput = inputSize === 'large'

  let hasLeftIcon = !isEmpty(icons.left.component)
  let hasRightIcon = !isEmpty(icons.right.component) && !disabled
  let iconClass = ''

  if (isSmallInput || (borderless && textOnly)) {
    iconClass = 'ui-kit-select-input-icon-sm'
  } else if (isLargeInput) {
    iconClass = 'ui-kit-select-input-icon-lg'
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
      <Input {...props} />
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
