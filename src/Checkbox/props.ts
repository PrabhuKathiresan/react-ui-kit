export interface AbstractCheckboxProps {
  className?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  value?: any;
  tabIndex?: number;
  name?: string;
  children?: React.ReactNode;
  id?: string;
  autoFocus?: boolean;
}

export interface CheckboxProps extends AbstractCheckboxProps {
  hint?: string;
  hintPosition?: 'top' | 'bottom' | 'left' | 'right';
  indeterminate?: boolean;
  subTitle?: any;
  variant?: 'bordered' | 'default'
}

export interface CheckboxGroupOptions {
  label: any;
  value: any;
  hint?: string;
  disabled?: boolean,
  hintPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export interface CheckboxGroupProps {
  label?: any;
  required?: boolean;
  options: Array<CheckboxGroupOptions>;
  value: Array<any>;
  onChange: Function;
  variant?: 'row' | 'column';
}
