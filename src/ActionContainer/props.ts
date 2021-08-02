export interface ActionContainer {
  content: {
    primary: any;
    secondary?: any;
  },
  showSecondaryAction?: boolean;
  height?: number | string;
  containerClass?: string;
  transitionDuration?: number;
}
