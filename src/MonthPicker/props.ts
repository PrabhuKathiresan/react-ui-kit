import { InputProps } from '../constants'

export interface MonthPickerProps extends InputProps {
  id?: string
  min?: Date
  max?: Date
  yearMenuRef?: Function
  monthMenuRef?: Function
  onChange: Function
  onOpen?: Function
  onClose?: Function
  width?: number | string
  height?: number | string
  value?: Date
  defaultValue?: Date
  yearWidth?: number | string
  container?: string
  className?: string
  borderless?: boolean
  animate?: boolean
  inputClass?: string
}
