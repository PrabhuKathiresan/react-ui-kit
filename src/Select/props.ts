import { InputHTMLAttributes } from 'react';

export declare type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

interface IconProps {
  left?: any,
  right?: any
}

export interface OptionProps {
  hidden?: boolean,
  disabled?: boolean,
  itemClass?: string,
  [key: string]: any
}

export interface SelectProps {
  options?: Array<OptionProps>,
  selected?: Array<OptionProps>,
  multiple?: boolean,
  id: string,
  onChange: Function,
  searchable?: boolean,
  maxDropdownHeight?: number,
  minDropdownWidth?: number,
  inputProps?: {},
  filterBy?: Array<string> | Function,
  labelKey: string,
  closeOnOutsideClick?: boolean,
  width?: number,
  height?: number,
  icons?: IconProps,
  animate?: boolean,
  transitionDuration?: number,
  onMenuItemRender?: Function,
  dropup?: boolean,
  flip?: boolean,
  containerClass?: string,
  loading?: boolean,
  onInputClick?: Function,
  caseSensitive?: boolean,
  defaultFirstItemSelected?: boolean,
  defaultOpen?: boolean,
  autoFocus?: boolean,
  async?: boolean,
  cacheResults?: boolean,
  onSearch?: Function,
  onClose?: Function,
  onInputChange?: Function,
  onInputFocus?: Function,
  onInputBlur?: Function,
  placeHolder?: string,
  disabled?: boolean,
  allowClear?: boolean,
  showRightIcon?: boolean,
  label?: string,
  labelClass?: string,
  error?: string,
  inputClass?: string,
  container?: any,
  textOnly?: boolean;
  required?: boolean;
}

export interface SelectState {
  value: string,
  options?: Array<OptionProps>,
  results?: Array<OptionProps>,
  selected?: Array<OptionProps>,
  activeIndex: number,
  isDirty?: boolean,
  autoScroll?: boolean,
  dropdownState?: string,
  activeItem?: OptionProps | null,
  focus?: boolean,
  open?: boolean,
  searchable?: boolean,
  menuPosition?: object;
  id?: any;
}

export interface SelectedValueProps {
  selected: Array<OptionProps>,
  multiple?: boolean,
  key: string
}

export interface SelectInputProps {
  onFocus?: Function,
  inputClass?: string,
  inputRef?: any,
  placeHolder?: string,
  disabled?: boolean,
  onRemove?: Function,
  open?: boolean,
  extraProps: {
    [k: string]: any
  },
  onClear?: Function;
}

export interface MenuItemProps {
  activeIndex: number,
  position: number,
  menuContainer: any,
  autoScroll: boolean,
  selected: boolean,
  label: string,
  id: string,
  onClick: Function
}

export interface MenuProps {
  maxHeight: number | string,
  options: Array<OptionProps>,
  selected: Array<OptionProps>,
  activeIndex: number,
  open: boolean,
  loading: boolean,
  labelKey: string,
  isDirty: boolean,
  style: React.CSSProperties & {
    dropup?: boolean,
    flip?: boolean
  },
  searchInputProps: InputHTMLAttributes<HTMLInputElement>,
  menuRef: any,
  scrollableAreaRef: any,
  onMenuClick: Function,
  autoScroll: boolean,
  disableAutoScroll: Function,
  animate: boolean,
  searchable: boolean,
  dropdownState: string,
  id: string,
  transitionState: TransitionState;
  transitionDuration: number;
}

export interface ExtraInputProps {
  onKeyDown?: Function,
  onClick?: Function,
  ref?: Function
}
