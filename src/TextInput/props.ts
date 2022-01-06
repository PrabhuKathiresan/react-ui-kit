import { Ref } from 'react'
import { InputProps } from '../constants'

export interface IconProps {
  left?: any,
  right?: any
}

export interface InputActionItem {
  show: boolean,
  label: string,
  onClick: Function
}

export interface NumberFieldProps {
  min?: any
  max?: any
  step?: any
}

export interface TextInputProps extends InputProps {
  icon?: IconProps,
  containerClass?: string,
  actionItem?: InputActionItem,
  error?: boolean | string,
  success?: boolean
  warning?: boolean
  charLeft?: any,
  component?: 'input' | 'textarea'
  maxLength?: any
  containerRef?: Ref<any>
  labelRef?: Ref<any>
  onRightIconClick?: Function
}
