export declare type TooltipDirection = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  direction: TooltipDirection
  overlayClass?: string
  wrapperClass?: string
  container?: string
  children: any
  content: any
  delay?: number
  zIndex?: number
}
