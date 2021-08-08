import React, { InputHTMLAttributes, MouseEvent, useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import cx from 'classnames'
import Tooltip from '../Tooltip'
import { TextInputProps } from './props'
import InfoCircle from '../icons/info-circle'
import Error from '../icons/error'
import { noop, isEqual, generateID } from '../utils'
import Check from '../icons/check'
import { isFunction } from '../utils/type-check'

const INPUT_SIZE_MAP = {
  small: 'is-small',
  large: 'is-large',
  default: ''
}

const LeftIcon = forwardRef((props: TextInputProps, ref: any) => {
  let { icon, id } = props
  let leftIcon = icon?.left

  useImperativeHandle(ref, () => ({
    hasIcon: Boolean(leftIcon)
  }), [leftIcon])

  if (!leftIcon) return null;

  return (
    <span className='ui-kit-input-icon left' data-testid={`${id}-input-left-icon`}>
      {leftIcon}
    </span>
  )
})

const RightIcon = forwardRef((props: TextInputProps, ref: any) => {
  let { icon, error, warning, success, id, disabled, onRightIconClick } = props
  let rightIcon = icon?.right

  let iconProps = {}

  if (!disabled && onRightIconClick && isFunction(onRightIconClick)) {
    let onClick = onRightIconClick
    iconProps = {
      role: 'button',
      tabIndex: -1,
      onClick: (e: MouseEvent) => onClick(e)
    }
  }

  useImperativeHandle(ref, () => ({
    hasIcon: Boolean(rightIcon)
  }), [rightIcon])

  if (success) {
    rightIcon = <Check width={12} height={12} className='text--success' />
  } else if (error || warning) {
    rightIcon = <Error className={`text--${error ? 'danger' : 'warning'}`} />
  }

  if (!rightIcon) return null;

  return (
    <span className='ui-kit-input-icon right' data-testid={`${id}-input-right-icons`} {...iconProps}>
      {rightIcon}
    </span>
  )
})

export const InputLabel = (props: TextInputProps) => {
  if (!props.label) return null

  let {
    label,
    labelRef,
    labelClass,
    required,
    disabled,
    hint,
    hintPosition = 'right',
    hintContainer,
    hintZIndex,
    maxLength,
    id,
    charLeft,
    component
  } = props
  let isTextArea = component === 'textarea'

  return (
    <label ref={labelRef} className={cx('ui-kit-input-label', labelClass, { 'is-required required': required })} htmlFor={disabled ? '' : id} data-testid={disabled ? `disabled-text-input-label-${id}` : `text-input-label-${id}`}>
      <span>{label}</span>
      {
        hint &&
        <span className='ml-8 ui-kit-input-hint-icon'>
          <Tooltip direction={hintPosition} content={hint} wrapperClass='d-flex' container={hintContainer} zIndex={hintZIndex}>
            <InfoCircle width={14} height={14} />
          </Tooltip>
        </span>
      }
      {
        isTextArea && maxLength && (
          <span className='ml-8 text--info' data-testid={`${id}-input-maxlength-indicator`}>
            ({isEqual(maxLength, charLeft) ? `Maximum ${maxLength} characters` : `${charLeft} characters left`})
          </span>
        )
      }
    </label>
  )
}

const TextInput = (props: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & TextInputProps, ref: any = noop) => {
  let {
    icon = {
      left: null,
      right: null
    },
    label,
    inputSize = 'default',
    containerClass = '',
    labelClass = '',
    message,
    hint,
    hintPosition,
    hintZIndex,
    hintContainer,
    id = generateID(Math.random()).toString(),
    actionItem = {
      show: false,
      label: '',
      onClick: noop
    },
    error = false,
    required = false,
    disabled = false,
    autoFocus = false,
    placeholder = '',
    style = {},
    component = 'input',
    maxLength,
    charLeft,
    min,
    max,
    containerRef = useRef(null),
    labelRef = useRef(null),
    className,
    onRightIconClick,
    success = false,
    warning = false,
    value,
    ...inputProps
  } = props
  let leftIconRef = useRef<any>(null)
  let [hasLeftIcon, setLeftIcon] = useState<boolean>(false)
  let rightIconRef = useRef<any>(null)
  let [hasRightIcon, setRightIcon] = useState<boolean>(false)

  let Input = component

  let sizeClass = INPUT_SIZE_MAP[inputSize]

  useEffect(() => {
    setRightIcon(rightIconRef.current?.hasIcon)
  }, [rightIconRef.current, value])

  useEffect(() => {
    setLeftIcon(leftIconRef.current?.hasIcon)
  }, [leftIconRef.current])

  let inputStateClasses = {
    'has-error': error,
    'has-warning': warning
  }

  return (
    <div className={cx('ui-kit-input-block', containerClass, inputStateClasses)} id={`${id}-input-block`} ref={containerRef}>
      <InputLabel
        id={id}
        label={label}
        labelClass={labelClass}
        labelRef={labelRef}
        required={required}
        disabled={disabled}
        hint={hint}
        hintPosition={hintPosition}
        hintContainer={hintContainer}
        hintZIndex={hintZIndex}
        maxLength={maxLength}
        charLeft={charLeft}
        component={component}
      />
      <div className='ui-kit-input-wrapper'>
        <LeftIcon icon={icon} id={id} ref={leftIconRef} />
        {
          disabled
            ?
            <Input ref={ref} disabled data-testid={`${id}-input-disabled`} placeholder={placeholder} className={cx('ui-kit-input disabled', className, sizeClass, { 'ui-kit-input-with-left-icon': hasLeftIcon, 'ui-kit-input-with-right-icon': hasRightIcon })} value={value} style={style} />
            :
            <Input maxLength={maxLength} ref={ref} autoFocus={autoFocus} data-testid={`${id}-input`} id={id} placeholder={placeholder} autoComplete='off' className={cx('ui-kit-input', className, sizeClass, { 'ui-kit-input-with-left-icon': hasLeftIcon, 'ui-kit-input-with-right-icon': hasRightIcon })} style={style} value={value} {...inputProps} />
        }
        <RightIcon
          id={id}
          success={success}
          error={error}
          warning={warning}
          disabled={disabled}
          onRightIconClick={onRightIconClick}
          icon={icon}
          ref={rightIconRef}
        />
      </div>
      {message && <span className='pt-4 element-flex' data-testid={`${id}-input-message`}>{message}</span>}
      {error && <span className='text--danger pt-4 element-flex' data-testid={`${id}-input-error`}>{error}</span>}
      {actionItem.show && <span data-testid={`${id}-input-action-item`} className='ui-kit-input-action-item pt-4 element-flex' onClick={() => actionItem.onClick()}>{actionItem.label}</span>}
    </div>
  )
}

export default React.forwardRef(TextInput)
