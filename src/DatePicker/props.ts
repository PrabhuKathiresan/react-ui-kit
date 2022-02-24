import { InputProps, TransitionState } from '../constants'

export interface DatePickerProps extends InputProps {
  id: string
  name?: string
  container?: string
  dropup?: boolean
  animate?: boolean
  min?: Date
  max?: Date
  closeOnSelect?: boolean
  format?: string
  inputContainerClass?: string
  transitionDuration?: number
  value?: Date
  defaultValue?: Date
  closeOnScroll?: boolean
  onChange?: Function
}

export interface DatePickerState {
  open?: boolean
  pickerPosition?: any
  year?: number
  month?: number
  selectedDay?: any
  monthDetails?: any
  startDate: Date
  endDate: Date
  monthMenuRef?: any
  yearMenuRef?: any
  focus?: boolean
  stopPropagation?: boolean
}

export interface DatePickerElementProps {
  id?: string
  transitionState: TransitionState
  transitionDuration?: number
  position?: any
  days?: any
  year: number
  month: number
  startDate: Date
  endDate: Date
  yearMenuRef: any
  monthMenuRef: any
  onChange: any
}

export interface DatePickerHeaderProps {
  id?: string
  selectedMonth: number
  selectedYear: number
  startDate: Date
  endDate: Date
  yearMenuRef: any
  monthMenuRef: any
  onChange: Function
  onMenuOpen: Function
  onMenuClose: Function
}

export interface DatePickerFooterProps {
  onChange: Function
  startDate: Date
  endDate: Date
}
