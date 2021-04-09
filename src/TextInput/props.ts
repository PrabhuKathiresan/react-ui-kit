interface IconProps {
  left: any,
  right: any
}

interface InputActionItem {
  show: boolean,
  label: string,
  onClick: Function
}

interface InputProps {
  icon?: IconProps,
  label?: any,
  labelClass?: string,
  size?: 'small' | 'default' | 'large',
  containerClass?: string,
  message?: string,
  hint?: string,
  hintPosition?: 'top' | 'left' | 'bottom' | 'right',
  id?: string,
  actionItem?: InputActionItem,
  error?: boolean | string,
  charLeft?: any,
  component?: 'input' | 'textarea';
  maxLength?: any
}

export default InputProps;
