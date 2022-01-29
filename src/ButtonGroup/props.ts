import { ButtonTheme, ButtonSize, ButtonVariant } from '../Button/props'
import { OptionItem, FloatDDPosition, StaticDDPosition } from '../Dropdown/props'

export declare type ButtonGroupJustify = 'right' | 'left' | 'center'
export declare type ButtonGroupAlign = 'top' | 'bottom' | 'center'
export declare type ButtonGroupGap = 'small' | 'medium' | 'large'
export declare type ButtonGroupVerticalSpacing = 'top' | 'bottom' | 'both'
export declare type ButtonGroupActionType = 'button' | 'dropdown' | 'custom'

export interface ButtonGroupActionProps {
  label: any
  onClick: Function
  type?: ButtonGroupActionType
  extraProps?: {
    [k: string]: any
  },
  component?: 'button' | any
  options?: Array<OptionItem>
  dropdownPosition?: FloatDDPosition | StaticDDPosition
}

export interface ButtonGroupProps {
  justify?: ButtonGroupJustify
  align?: ButtonGroupAlign
  gap?: ButtonGroupGap
  verticalSpacing?: ButtonGroupVerticalSpacing
  theme?: ButtonTheme
  size?: ButtonSize
  variant?: ButtonVariant
  actions?: Array<ButtonGroupActionProps>
  containerClass?: string
}
