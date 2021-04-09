export interface IconProps {
  left?: any;
  right?: any;
}

export interface ButtonProps {
  icon?: IconProps;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  theme?: 'primary' | 'secondary' | 'danger';
  ref?: any;
  block?: boolean;
  large?: boolean;
  bold?: boolean;
  children: any;
  plain?: boolean;
  link?: boolean;
  small?: boolean;
  tiny?: boolean;
}
