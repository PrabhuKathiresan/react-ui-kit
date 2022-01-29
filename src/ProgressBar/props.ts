export interface ProgressBarState {
  bars: Array<ProgressBarProps>
}

export interface ProgressBarProviderProps {
  start?: Function
  done?: Function
  increment?: Function
  getBar?: Function
}

export interface ProgressBarStyleProps {
  placement?: 'top' | 'bottom'
  position?: 'absolute' | 'fixed'
  height?: number | string
}

export interface ProgressBarOptions extends ProgressBarStyleProps {
  id?: any
  type?: 'controlled' | 'uncontrolled' | 'indeterminate'
  speed?: number
  trickleSpeed?: number
  showSpinner?: boolean
  parent?: string
  loading?: boolean
  incrementer?: number
  maximum?: number
  value?: number
}

export interface ProgressBarProps extends ProgressBarOptions {
  interval?: any
  value: number
}

export interface WithChildren {
  children: any
}
