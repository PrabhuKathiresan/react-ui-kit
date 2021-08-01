import { TransitionState } from '../constants'

export declare type Positions = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'

export declare type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string;
  autoDismiss?: boolean;
  duration?: number;
  type?: ToastType;
  description?: any;
  message?: any;
  closable?: boolean;
  icon?: any;
  position?: Positions;
  onClose?: Function;
  confirm?: boolean;
  onConfirm?: Function;
  onCancel?: Function;
  confirmText?: string;
  cancelText?: string;
}

export interface Props extends ToastProps {
  container?: any,
  transitionDuration?: number
}

export interface ToastState {
  toasts: Array<ToastProps>
}

export interface ToastContainerProps {
  children?: any;
  hasToasts: boolean;
  position: Positions;
  [k: string]: any
}

export interface ProviderProps {
  add: Function,
  remove: Function,
  removeAll: Function,
  update: Function,
  toasts?: Array<any>
}

export interface TransitionProps {
  transitionState: TransitionState;
  transitionDuration: number;
}

export interface SingleToastProp {
  id: string;
  message?: string;
  type: string,
  autoDismiss: boolean, // may be inherited from ToastProvider
  duration: number, // inherited from ToastProvider
  children: any,
  onClose: Function,
  position: Positions,
  confirm?: boolean;
  onConfirm?: Function;
  onCancel?: Function;
  confirmText?: string;
  cancelText?: string;
  onMouseEnter: Function;
  onMouseLeave: Function;
  iconType?: 'default' | 'filled'
}
