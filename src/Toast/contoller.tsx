import React, { Component } from 'react'
import { noop } from '../utils'
import { ToastProps as Props, TransitionProps } from './props'

interface ControllerProps extends TransitionProps {
  component: any,
  transitionDuration: number
}

interface TimerType {
  clear: Function
  pause: Function
  resume: Function
}

const defaultAutoDismissTimeout = 5000

class Timer {
  timerId: any
  remaining: number
  start: number
  callback: Function

  constructor(callback: Function, delay: number) {
    this.callback = callback
    this.start = delay
    this.remaining = delay

    this.resume()
  }

  clear() {
    clearTimeout(this.timerId)
  }

  pause() {
    clearTimeout(this.timerId)
    this.remaining -= Date.now() - this.start
  }

  resume() {
    this.start = Date.now()
    clearTimeout(this.timerId)
    this.timerId = setTimeout(this.callback, this.remaining)
  }
}

export default class ToastController extends Component<Props & ControllerProps, {}> {
  timeout: TimerType

  componentDidMount() {
    this.startTimer()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.autoDismiss !== this.props.autoDismiss) {
      const startOrClear = this.props.autoDismiss
        ? this.startTimer
        : this.clearTimer

      startOrClear()
    }
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  startTimer = () => {
    let {
      autoDismiss,
      duration = defaultAutoDismissTimeout,
      onClose = noop,
      confirm
    } = this.props

    if (!autoDismiss || confirm) return

    this.setState({ isRunning: true })
    this.timeout = new Timer(onClose, duration)
  }

  clearTimer = () => {
    if (this.timeout) this.timeout.clear()
  }

  onMouseEnter = () => {
    this.setState({ isRunning: false }, () => {
      if (this.timeout) this.timeout.pause()
    })
  }
  onMouseLeave = () => {
    this.setState({ isRunning: true }, () => {
      if (this.timeout) this.timeout.resume()
    })
  }

  render() {
    let {
      autoDismiss,
      duration,
      component: Toast,
      ...props
    } = this.props

    // NOTE: conditions here so methods can be clean
    let handleMouseEnter = autoDismiss ? this.onMouseEnter : noop
    let handleMouseLeave = autoDismiss ? this.onMouseLeave : noop

    return (
      <Toast
        autoDismiss={autoDismiss}
        autoDismissTimeout={duration}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    )
  }
}