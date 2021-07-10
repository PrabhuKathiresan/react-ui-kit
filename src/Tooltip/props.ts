export interface TooltipProps {
  direction: 'top' | 'bottom' | 'left' | 'right',
  overlayClass?: string,
  wrapperClass?: string,
  container?: string,
  children: any,
  content: any,
  delay?: number
}
