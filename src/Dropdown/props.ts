interface IconProps {
  left?: any;
  right?: any
}

export interface OptionItem {
  name: string;
  disabled?: boolean;
  hidden?: boolean;
  key: string;
  onClick?: Function;
  divider?: boolean;
}

export interface DropdownPosition {
  right?: number;
  left?: number;
  bottom?: string | number;
  top?: string | number;
}

export type PositionalProps =
|
  {
    float?: true,
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }
|
  {
    float?: false | null;
    position?: 'right' | 'left';
  };

export interface DropdownProps {
  id?: string;
  icon?: IconProps;
  textContent?: any;
  additionalClass?: string;
  dropdownClass?: string;
  options?: Array<OptionItem>;
  selected?: OptionItem;
  onChange?: Function;
  onClick?: Function;
  label?: any;
  loading?: boolean;
  hasTriggerComponent?: any;
  additionalTriggerClass?: string;
  children?: any;
  size?: 'sm' | 'lg';
  offsetTop?: number;
  maxHeight?: number | 'auto';
  container?: string;
  floatOffset?: number;
}
