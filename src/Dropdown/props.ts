interface IconProps {
  left?: any,
  right?: any
}

export interface OptionItem {
  name: string,
  disabled?: boolean,
  hidden?: boolean,
  key: string
}

export interface DropdownPosition {
  right?: undefined | number,
  left?: undefined | number
}

export interface DropdownProps {
  id?: string,
  icon?: IconProps,
  textContent?: any,
  additionalClass?: string,
  dropdownClass?: string,
  options?: Array<OptionItem>,
  selected?: OptionItem,
  onChange?: Function,
  onClick?: Function,
  label?: any,
  loading?: boolean,
  hasTriggerComponent?: any,
  position?: 'right' | 'left',
  additionalTriggerClass?: string,
  children?: any,
  size?: 'sm' | 'lg',
  offsetTop?: number
}