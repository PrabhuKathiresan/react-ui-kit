import { InputHTMLAttributes, MutableRefObject, RefObject } from 'react'
import { TransitionState, InputProps } from '../constants'

interface IconProps {
  left?: any
  right?: any
}

export interface OptionProps {
  hidden?: boolean
  disabled?: boolean
  itemClass?: string
  [key: string]: any
}

export interface SelectProps extends InputProps {
  options?: Array<OptionProps | string>
  selected?: Array<OptionProps | string>
  multiple?: boolean
  searchable?: boolean
  maxDropdownHeight?: number
  minDropdownWidth?: number
  inputProps?: any
  filterBy?: Array<string> | Function
  labelKey: string
  closeOnOutsideClick?: boolean
  icons?: IconProps
  animate?: boolean
  transitionDuration?: number
  onMenuItemRender?: Function
  customMenuItemRender?: Function
  dropup?: boolean
  flip?: boolean
  containerClass?: string
  loading?: boolean
  onInputClick?: Function
  caseSensitive?: boolean
  defaultFirstItemSelected?: boolean
  defaultOpen?: boolean
  autoFocus?: boolean
  async?: boolean
  cacheResults?: boolean
  onSearch?: Function
  onClose?: Function
  onInputChange?: Function
  onInputFocus?: Function
  onInputBlur?: Function
  allowClear?: boolean
  showRightIcon?: boolean
  inputClass?: string
  container?: any
  textOnly?: boolean
  borderless?: boolean
  setMenuRef?: Function
  onOpen?: Function
  onChange?: Function
}

export interface SelectState {
  value: string
  options?: Array<OptionProps>
  results?: Array<OptionProps>
  selected?: Array<OptionProps>
  activeIndex: number
  isDirty?: boolean
  autoScroll?: boolean
  dropdownState?: string
  activeItem?: OptionProps | null
  focus?: boolean
  open?: boolean
  searchable?: boolean
  menuPosition?: object
  id: string
}

export interface SelectedValueProps {
  selected: Array<OptionProps>
  multiple?: boolean
  key: string
}

export interface SelectInputProps extends SelectProps {
  onFocus?: Function
  onClick?: Function
  onBlur?: Function
  inputClass?: string
  inputRef?: any
  onRemove?: Function
  open?: boolean
  extraProps: {
    [k: string]: any
  }
  onClear?: Function
  selected?: Array<OptionProps>
}

export interface MenuItemProps {
  activeIndex: number
  position: number
  menuContainer: any
  autoScroll: boolean
  selected: boolean
  label: string
  id: string
  onClick: Function
  disabled: boolean
}

export interface MenuProps {
  maxHeight: number | string
  options: Array<OptionProps>
  selected: Array<OptionProps>
  activeIndex: number
  open: boolean
  loading: boolean
  labelKey: string
  isDirty: boolean
  style: React.CSSProperties & {
    dropup?: boolean
    flip?: boolean
  }
  searchInputProps: InputHTMLAttributes<HTMLInputElement>
  menuRef: any
  scrollableAreaRef: any
  onMenuClick: Function
  autoScroll: boolean
  disableAutoScroll: Function
  animate: boolean
  searchable: boolean
  dropdownState: string
  id: string
  transitionState: TransitionState
  transitionDuration: number
  minDropdownWidth?: number
  closeMenu: Function
  careOutsideClick?: boolean
  inputContainerRef?: MutableRefObject<HTMLDivElement> | RefObject<HTMLDivElement>
  focus?: boolean
  containerMargin?: string
}

export interface ExtraInputProps {
  onKeyDown?: Function
  onClick?: Function
  ref?: Function
}
