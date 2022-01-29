import React, { CSSProperties, useRef } from 'react'
import cx from 'classnames'
import isEmpty from 'is-empty'
import Tag from './Tag'
import Close from '../icons/close'
import { SelectedValueProps, SelectInputProps } from './props'
import { noop } from '../utils'
import Loader from '../Loader'

const getSelectedValue = (input: SelectedValueProps) => {
  const { selected = [], multiple, key } = input
  if (multiple || isEmpty(selected)) return ''
  return selected[0][key] || ''
}

const Input = (props: SelectInputProps) => {
  const {
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

  const isSmallInput = inputSize === 'small'
  const isLargeInput = inputSize === 'large'
  const hasLeftIcon = !isEmpty(icons.left.component)
  const hasRightIcon = !isEmpty(icons.right.component) && !disabled
  const value = getSelectedValue({ selected, multiple, key: labelKey })
  const showClearIcon = (allowClear && !disabled) && (multiple ? !isEmpty(selected) : !isEmpty(value))
  const inputEle = useRef<HTMLInputElement | null>(null)
  const isTextOnlyAndBorderLess = textOnly && borderless

  const inputClassHash = {
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

  const renderValue = () => multiple ? renderTags() : <span className='text--ellipsis'>{value}</span>

  const renderTags = () => selected.map((_selected, i) => (
    <Tag id={`${id}-selected-input-${i}`} closeable={!disabled} disabled={disabled} onClose={() => onRemove(_selected)} key={i}>
      {_selected.__label}
    </Tag>
  ))

  const style: CSSProperties = {}

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
  const {
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

  const isSmallInput = inputSize === 'small'
  const isLargeInput = inputSize === 'large'

  const hasLeftIcon = !isEmpty(icons.left.component)
  const hasRightIcon = !isEmpty(icons.right.component) && !disabled
  let iconClass = ''

  if (isSmallInput || (borderless && textOnly)) {
    iconClass = 'ui-kit-select-input-icon-sm'
  } else if (isLargeInput) {
    iconClass = 'ui-kit-select-input-icon-lg'
  }

  const value = isEmpty(selected) ? '' : getSelectedValue({ selected, multiple, key: labelKey })

  const onRightIconClick = (disabled || !hasRightIcon) ? noop : () => icons.right.onClick()

  const showClearIcon = (allowClear && !disabled) && (multiple ? !isEmpty(selected) : !isEmpty(value))

  const renderRightIcon = () => {
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
