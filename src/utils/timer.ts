import { noop } from '.'

interface TimerOptions {
  callback: Function
  autoStart?: boolean
  interval?: number
  onStart?: Function
  onStop?: Function
}

export default class Timer {
  _handle: any
  _interval: number
  _options: TimerOptions
  _callback: Function
  _onStart: Function
  _onStop: Function
  _startTime: number
  _remainingTime: number | null
  playing: boolean

  constructor(options: TimerOptions) {
    this._handle = null
    this._options = options
    this._callback = options.callback
    this._onStart = options.onStart || noop
    this._onStop = options.onStop || noop
    this._interval = options.interval || 3000
    this._startTime = 0
    this._remainingTime = null
    this.playing = false
    if (options.autoStart) {
      this.start()
    }
  }

  start() {
    this.playing = true
    this._onStart()
    this._handle = setInterval(() => {
      this._remainingTime = null
      this._startTime = new Date().getTime()
      this._callback()
    }, this._interval)
  }

  stop() {
    this.playing = false
    clearInterval(this._handle)
    this._onStop()
  }

  restart() {
    clearInterval(this._handle)
    this.start()
  }
}