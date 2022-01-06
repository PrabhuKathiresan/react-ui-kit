// declare type ProgessBarType = 'primary' | 'success' | 'warning' | 'danger'
// declare type ProgessBarSize = 'small' | 'default' | 'large'

// export interface PBProps extends InternalProps {
//   id?: any
//   value: number
//   duration: number
//   options?: PBStartOptions
//   minimum?: number
// }

export interface ProgressBarState {
  bars: Array<ProgressBarProps>
}

export interface ProgressBarProviderProps {
  start?: Function
  done?: Function
  increment?: Function
  getBar?: Function
}

// export interface CommonPBProps extends DefaultPBProps,IndeterminatePBProps {
//   id?: any
//   showSpinner?: boolean
//   trickleSpeed?: number
//   indeterminate?: boolean
// }

export interface ProgressBarStyleProps {
  placement?: 'top' | 'bottom'
  position?: 'absolute' | 'fixed'
  height?: number | string
}

// export interface PBContainerProps extends PBStyleProps {
//   children: any
// }

// interface InternalProps {
//   _interval?: any
// }

// interface DefaultPBProps {
//   incrementer?: number
//   value?: number
// }

// interface IndeterminatePBProps {
//   loading: boolean
// }

// export interface PBStartOptions extends PBStyleProps, InternalProps {
//   indeterminate?: boolean
//   speed?: number
//   parent?: string
// }

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
