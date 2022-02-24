export interface InputProps {
  id?: any
  name?: any
  value?: any
  checked?: boolean
  className?: any
  disabled?: boolean
}

export interface RadioProps extends InputProps {
  label: any
  onChange: Function 
}

export interface Radio {
  label: any
  value: any
  disabled?: boolean
}

export interface RadioGroupProps {
  id?: any
  label?: any
  required?: boolean
  onChange: Function
  value: any
  options: Array<Radio>
  variant: 'row' | 'column',
  error?: any
  disabled?: boolean
  containerClass?: string
}
