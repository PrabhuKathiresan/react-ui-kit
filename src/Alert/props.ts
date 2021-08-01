import { CSSProperties } from 'react'

export interface Alert {
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
  dismissable?: boolean;
  content?: any;
  showIcon?: boolean;
  iconType?: 'default' | 'filled';
  variant?: 'default' | 'filled';
}

export interface AlertProps extends Alert {
  onClose?: Function;
  title?: any;
  children?: any;
  container?: string | null;
  banner?: boolean;
  fixed?: boolean;
  show?: boolean;
  transitionDuration?: number;
  style?: CSSProperties;
  position?: 'absolute' | 'fixed';
  fitToContainer?: boolean;
  containerClass?: string;
}