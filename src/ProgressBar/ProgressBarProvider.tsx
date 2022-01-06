import set from 'lodash.set'
import React, { Component, createContext, useContext, forwardRef, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { canUseDOM, generateID } from '../utils'
import ProgressBar from './ProgressBar'
import ProgressBarContainer from './ProgressBarContainer'
import {
  ProgressBarProviderProps,
  ProgressBarState,
  ProgressBarOptions,
  ProgressBarProps
} from './props'

const Context = createContext<ProgressBarProviderProps>({})
const { Provider, Consumer } = Context
const transistionEndSpeed = 200

const getWithDefaults = (bar: ProgressBarProps): ProgressBarProps => {
  let {
    type = 'uncontrolled',
    incrementer = .1,
    speed = 1000,
    trickleSpeed = 1000,
    maximum = .95
  } = bar
  return {
    ...bar,
    type,
    incrementer,
    speed,
    trickleSpeed,
    maximum
  }
}

export class ProgressBarProvider extends Component<{}, ProgressBarState> {
  state: ProgressBarState = {
    bars: []
  }

  get bars(): Array<ProgressBarProps> {
    return this.state.bars
  }

  get hasProgress(): boolean {
    return Boolean(this.state.bars.length)
  }

  getBar = (id: string, options: ProgressBarOptions = {}): ProgressBarProps | undefined => {
    if (!this.hasProgress) return undefined

    return this.bars.find(t => (t.id === id || t.parent === options.parent))
  }

  start = (options: ProgressBarOptions = {}) => {
    let id = options.id || generateID(Math.random())
    if (this.getBar(id, options)) return
    let startValue = options.value || .1
    let bar: ProgressBarProps = getWithDefaults({ ...options, value: 0 })
    let {
      incrementer,
      speed
    } = bar
    bar.id = id

    if (this._isUncontrolled(bar)) {
      bar.interval = setInterval(() => this.increment(id, incrementer), speed)
    }

    let bars = this.bars

    bars.push(bar)

    this.setState({ bars: [...bars] }, () => {
      if (this._isDetermined(bar)) {
        setTimeout(() => {
          this.setState(({ bars }) => {
            return {
              bars: bars.map((bar) => {
                if (bar.id === id) bar.value = startValue
                return bar
              })
            }
          })
        }, 0)
      }
    })
  }

  increment = (id: any, n: number = .1) => {
    let bar = this.getBar(id)
    if (!bar) return

    let { value, interval, maximum = .95 } = bar
    let nextValue = Math.abs(value + n)
    nextValue = Math.min(nextValue, maximum)

    if (nextValue === value && interval) {
      clearInterval(interval)
    }

    set(bar, 'value', nextValue)

    this.setState({ bars: [...this.bars] })
  }

  _finish = (id: any, cb: Function) => {
    this.setState((state) => {
      return {
        bars: state.bars.map(bar => {
          if (bar.id === id) return { ...bar, value: 1, trickleSpeed: transistionEndSpeed }
          return { ...bar }
        })
      }
    }, () => cb())
  }

  _isUncontrolled = (bar: ProgressBarProps) => bar.type === 'uncontrolled'
  _isDetermined = (bar: ProgressBarProps) => bar.type !== 'indeterminate'

  done = (id: any) => {
    let bar = this.getBar(id)
    if (!bar) return

    this._finish(bar.id, () => {
      bar?.interval && clearInterval(bar.interval)
      setTimeout(() => {
        this.setState((state) => {
          let bars = state.bars.filter(t => t.id !== id)
          return { bars }
        })
      }, transistionEndSpeed + 10)
    });
  }

  renderContainner = (bar: ProgressBarProps) => {
    return (
      <ProgressBarContainer {...bar}>
        <ProgressBar {...bar} />
      </ProgressBarContainer>
    )
  }

  renderProgressBars = () => {
    if (!this.hasProgress) return null

    return (
      this.bars.map((bar: ProgressBarProps) => {
        let portalTarget: any = null
        let container = this.renderContainner(bar)
        let { parent = 'body' } = bar
        if (canUseDOM) {
          portalTarget = document.querySelector(parent)
        }
        return (
          <Fragment key={bar.id}>
            {
              portalTarget ? createPortal(container, portalTarget) : container
            }
          </Fragment>
        )
      })
    )
  }

  render() {
    let providerValue: ProgressBarProviderProps = {
      start: this.start,
      increment: this.increment,
      done: this.done,
      getBar: this.getBar
    }
    let {
      children
    } = this.props

    return (
      <Provider value={providerValue}>
        {children}
        {this.renderProgressBars()}
      </Provider>
    )
  }
}

export const ProgressBarConsumer = ({ children }: { children: any }) => (
  <Consumer>{context => children(context)}</Consumer>
);

export const withProgressBarManager = (Comp: any) => (
  forwardRef((props: any, ref: any) => (
    <ProgressBarConsumer>
      {(context: ProgressBarProviderProps) => <Comp progressBarManager={context} {...props} ref={ref} />}
    </ProgressBarConsumer>
  ))
)

export const useProgressBar = (): ProgressBarProviderProps => {
  const ctx = useContext(Context);

  if (!ctx) {
    throw Error(
      'The `useToasts` hook must be called from a descendent of the `ToastProvider`.'
    );
  }

  return {
    start: ctx.start,
    done: ctx.done,
    increment: ctx.increment,
    getBar: ctx.getBar
  };
};
