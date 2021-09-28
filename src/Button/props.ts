export interface IconProps {
  left?: any;
  right?: any;
}

export type ButtonTheme = 'primary' | 'danger' | 'success' | 'warning' | 'default';
export type ButtonVariant = 'plain' | 'outlined' | 'filled';
export type ButtonSize = 'tiny' | 'small' | 'default' | 'medium' | 'large';
export type ButtonIconTheme = 'primary' | 'danger' | 'warning';

export interface ButtonProps {
  icon?: IconProps;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  theme?: ButtonTheme
  variant?: ButtonVariant;
  ref?: any;
  block?: boolean;
  bold?: boolean;
  children: any;
  size?: ButtonSize;
  link?: boolean;
  iconOnly?: boolean;
  iconTheme?: ButtonIconTheme;
  raised?: boolean;
  component?: 'button' | any;
}
