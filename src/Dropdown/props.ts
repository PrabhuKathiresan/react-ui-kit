interface IconProps {
  left?: any;
  right?: any
}

export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export interface OptionItem {
  name: string;
  disabled?: boolean;
  hidden?: boolean;
  key: string;
  onClick?: Function;
  divider?: boolean;
}

export interface DropdownPosition {
  right?: undefined | number;
  left?: undefined | number;
  bottom?: undefined | string | number;
  top?: undefined | string | number;
}

export type PositionalProps =
|
  {
    float?: true,
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }
|
  {
    float?: false | undefined | null;
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
}
