import React, { InputHTMLAttributes } from 'react'
import cx from 'classnames'
import isEmpty from 'is-empty'
import Tooltip from '../Tooltip'
import InputProps from './props'
import InfoCircle from '../icons/info-circle'
import { noop, isEqual } from '../utils'

const TextInput = (props: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & InputProps) => {
  let {
    icon = {
      left: null,
      right: null
    },
    label,
    size,
    containerClass = '',
    labelClass = '',
    message,
    hint,
    hintPosition = 'left',
    id,
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
    ...inputProps
  } = props

  let Input = component;
  let isTextArea = component === 'textarea'

  let sizeClass = isEqual(size, 'small') ? 'is-small' : isEqual(size, 'large') ? 'is-large' : ''

  return (
    <div className={cx('ui-kit-input-block', containerClass, { 'has-error': error })}>
      {
        label &&
        <label className={cx('ui-kit-input-label', labelClass, { 'is-required required': required })} htmlFor={disabled ? '' : id} data-testid={disabled ? `disabled-text-input-label-${id}` : `text-input-label-${id}`}>
          {label}
          {
            hint &&
            <span className='ml-8 ui-kit-input-hint-icon'>
              <Tooltip direction={hintPosition} content={hint} wrapperClass='d-flex'>
                <InfoCircle width={14} height={14} />
              </Tooltip>
            </span>
          }
          {
            isTextArea && maxLength && (
              <span className='ml-8 text-info' data-testid={`${id}-input-maxlength-indicator`}>
                ({isEqual(maxLength, charLeft) ? `Maximum ${maxLength} characters` : `${charLeft} characters left`})
              </span>
            )
          }
        </label>
      }
      <div className='ui-kit-input-wrapper'>
        {
          icon.left &&
          <span className='ui-kit-input-icon left' data-testid={`${id}-input-left-icon`}>
            {icon.left}
          </span>
        }
        {
          disabled
            ?
            <Input disabled data-testid={`${id}-input-disabled`} placeholder={placeholder} className={cx('ui-kit-input disabled', sizeClass, { 'ui-kit-input-with-left-icon': !isEmpty(icon.left), 'ui-kit-input-with-right-icon': !isEmpty(icon.right) })} value={inputProps.value} style={style} />
            :
            <Input maxLength={maxLength} autoFocus={autoFocus} data-testid={`${id}-input`} id={id} placeholder={placeholder} autoComplete='off' className={cx('ui-kit-input', sizeClass, { 'ui-kit-input-with-left-icon': !isEmpty(icon.left), 'ui-kit-input-with-right-icon': !isEmpty(icon.right) })} style={style} {...inputProps} />
        }
        {
          icon.right &&
          <span className='ui-kit-input-icon right' data-testid={`${id}-input-right-icons`}>
            {icon.right}
          </span>
        }
      </div>
      {message && <span className='pt-2' data-testid={`${id}-input-message`}>{message}</span>}
      {error && <span className='text-danger pt-2' data-testid={`${id}-input-error`}>{error}</span>}
      {actionItem.show && <span data-testid={`${id}-input-action-item`} className='ui-kit-input-action-item pt-2' onClick={() => actionItem.onClick()}>{actionItem.label}</span>}
    </div>
  )
}

export default TextInput
