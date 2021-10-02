export interface ActionContainerProps {
  content: {
    primary: any
    secondary?: any
  },
  showSecondaryAction?: boolean
  height?: number | string
  containerClass?: string
  transitionDuration?: number
  primaryContentClass?: string
  secondaryContentClass?: string
}
