export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
  dismissable?: boolean;
  onClose?: Function;
  content?: any;
  title?: any;
  children?: any;
  showIcon?: boolean;
}