import React, { CSSProperties, useEffect, useRef } from 'react'
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

const computeDynamicInputWidth = (value: string, fakeDiv: HTMLDivElement | null) => {
  if (!fakeDiv) return `calc(56px + ${value.length}ch)`

  fakeDiv.innerHTML = value.replace(/\s/g, '&' + 'nbsp;');
  const fakeEleStyles = window.getComputedStyle(fakeDiv);
  return `calc(${fakeEleStyles.width} + 2px)`;
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
    id,
    extraProps,
    allowClear,
    open,
    textOnly,
    inputProps,
    inputSize = 'default',
    borderless
  } = props

  const isSmallInput = inputSize === 'small'
  const isLargeInput = inputSize === 'large'
  const hasLeftIcon = !isEmpty(icons.left.component)
  const hasRightIcon = !isEmpty(icons.right.component) && !disabled
  const value = getSelectedValue({ selected, multiple, key: labelKey })
  const showClearIcon = (allowClear && !disabled) && (multiple ? !isEmpty(selected) : !isEmpty(value))
  const inputEle = useRef<HTMLInputElement | null>(null)
  const fakeDiv = useRef<HTMLDivElement | null>(null)
  const isTextOnlyAndBorderLess = textOnly && borderless

  const inputClassHash = {
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

  useEffect(() => {
    if (!inputEle.current || !isTextOnlyAndBorderLess) return

    const fakeEle = document.createElement('div');
    // Hide it completely
    fakeEle.style.position = 'absolute';
    fakeEle.style.top = '0';
    fakeEle.style.left = '-9999px';
    fakeEle.style.overflow = 'hidden';
    fakeEle.style.visibility = 'hidden';
    fakeEle.style.whiteSpace = 'nowrap';
    fakeEle.style.height = '0';
    // We copy some styles from the textbox that effect the width
    // const textboxEle = document.getElementById(id);
    // Get the styles
    const styles = window.getComputedStyle(inputEle.current);
    // Copy font styles from the textbox
    fakeEle.style.fontFamily = styles.fontFamily;
    fakeEle.style.fontSize = styles.fontSize;
    fakeEle.style.fontStyle = styles.fontStyle;
    fakeEle.style.fontWeight = styles.fontWeight;
    fakeEle.style.letterSpacing = styles.letterSpacing;
    fakeEle.style.textTransform = styles.textTransform;
    fakeEle.style.borderLeftWidth = styles.borderLeftWidth;
    fakeEle.style.borderRightWidth = styles.borderRightWidth;
    fakeEle.style.paddingLeft = styles.paddingLeft;
    fakeEle.style.paddingRight = styles.paddingRight;
    // Append the fake element to `body`
    document.body.appendChild(fakeEle);
    fakeDiv.current = fakeEle

    return () => {
      fakeEle && document.body.removeChild(fakeEle)
    }
  }, [inputEle.current, isTextOnlyAndBorderLess])

  const style: CSSProperties = {}

  if (isTextOnlyAndBorderLess) {
    style.width = computeDynamicInputWidth(value || placeholder, fakeDiv.current)
  }

  if (disabled) {
    return (
      <input
        className={cx('ui-kit-select-input', inputClass, inputClassHash)}
        defaultValue={value}
        disabled
        data-testid={`${id}-input-disabled`}
        placeholder={placeholder}
        style={style}
      />
    )
  }

  return (
    <input
      {...inputProps}
      {...extraProps}
      style={style}
      className={cx('ui-kit-select-input read-only', inputClass, inputClassHash)}
      value={value}
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
    />
  );
}

const InputWrapper = (props: SelectInputProps) => {
  const {
    onFocus = noop,
    onClick = noop,
    onBlur = noop,
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

  const isSmallInput = inputSize === 'small'
  const isLargeInput = inputSize === 'large'

  const hasLeftIcon = !isEmpty(icons.left.component)
  const hasRightIcon = !isEmpty(icons.right.component) && !disabled
  let iconClass = '';

  if (isSmallInput) {
    iconClass = 'ui-kit-select-input-icon-sm';
  } else if (isLargeInput) {
    iconClass = 'ui-kit-select-input-icon-lg';
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

  const renderTags = () => selected.map((_selected, i) => (
    <Tag id={`${id}-selected-input-${i}`} closeable={!disabled} disabled={disabled} onClose={() => onRemove(_selected)} key={i}>
      {_selected.__label}
    </Tag>
  ))

  const renderMultipleInput = () => {
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
        onClick={e => onClick(e)}
        onBlur={e => onBlur(e)}
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

  const renderInput = () => multiple ? (
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
