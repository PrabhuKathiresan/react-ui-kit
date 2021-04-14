export type DialogPositions = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-center';
export type DialogSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export interface ModalProps {
  title: any;
  content: any;
  actions?: Array<any>;
  showFooter?: boolean;
  afterClose?: Function;
  transitionState: TransitionState;
  transitionDuration?: number;
  showBackdrop?: boolean;
}

export interface DialogProps extends ModalProps {
  id: string;
  position?: DialogPositions;
  size?: DialogSizes;
  onClose?: Function;
}

export interface Props extends DialogProps {
  container?: any;
}

export interface DialogContainerProps {
  children: any;
  hidden: boolean;
  transitionDuration?: number;
}

export interface DialogState {
  modals: Array<DialogProps>
}

export interface DialogControllerProps {
  transitionState: TransitionState;
  position: DialogPositions;
  size: DialogSizes;
  modalProps: ModalProps;
  onClose: Function
}

export interface ProviderProps {
  show: Function;
  hide: Function;
  update: Function;
}
