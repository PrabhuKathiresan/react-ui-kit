export declare type Positions = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export declare type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export declare type ToastType = 'success' | 'error' | 'warning' | 'info';

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
};

export interface ProviderProps {
  add: Function,
  remove: Function,
  removeAll: Function,
  update: Function,
  toasts?: Array<any>
}

export interface TransitionProps {
  transitionState: TransitionState
}
