import React, { Component, useContext } from 'react'
import { createPortal } from 'react-dom'
import { TransitionGroup, Transition } from 'react-transition-group'
import { noop, generateUEID, canUseDOM } from '../utils'
import { Props, ToastProps, ToastState, ProviderProps } from './props'
import { ToastContainer } from './ToastContainer'
import { ToastElement } from './ToastElement'
import ToastController from './ToastController'
import { TransitionState } from '../constants'

const ToastContext = React.createContext<ProviderProps | null>(null);
const { Consumer, Provider } = ToastContext;

export class ToastProvider extends Component<Props, ToastState> {
  state: ToastState = { toasts: [] }

  has = (id: string) => {
    if (!this.state.toasts.length) {
      return false
    }

    return Boolean(this.state.toasts.filter(t => t.id === id).length)
  }

  onDismiss = (id: string, ctx: any, cb: Function = noop) => {
    cb(id, ctx)
    this.remove(id)
  }

  // Public API
  // ------------------------------

  add = (content: any, options: ToastProps, cb: Function = noop) => {
    let id = options.id ? options.id : generateUEID()
    options.id = id
    let callback = () => cb(id)

    // bail if a toast exists with this ID
    if (this.has(id)) {
      return
    }

    let { position = 'top-right' } = this.props

    // update the toast stack
    this.setState(state => {
      let newToast = {
        ...options,
        message: content
      }
      let toasts = []
      if (position.startsWith('top')) {
        toasts = [newToast, ...state.toasts]
      } else {
        toasts = [...state.toasts, newToast]
      }

      return { toasts }
    }, callback)

    // consumer may want to do something with the generated ID (and not use the callback)
    return id
  }
  remove = (id: string, cb: Function = noop) => {
    let callback = () => cb(id)

    // bail if NO toasts exists with this ID
    if (!this.has(id)) {
      return
    }

    this.setState(state => {
      let toasts = state.toasts.filter(t => t.id !== id)
      return { toasts }
    }, callback)
  }
  removeAll = () => {
    if (!this.state.toasts.length) {
      return
    }

    this.state.toasts.forEach(t => this.remove(t.id))
  }
  update = (id: string, options?: ToastProps, cb: Function = noop) => {
    let callback = () => cb(id)

    // bail if NO toasts exists with this ID
    if (!this.has(id)) {
      return
    }

    // update the toast stack
    this.setState(state => {
      let old = state.toasts
      let i = old.findIndex(t => t.id === id)
      let updatedToast = { ...old[i], ...options }
      let toasts = [...old.slice(0, i), updatedToast, ...old.slice(i + 1)]

      return { toasts }
    }, callback)
  }

  _getPortalTarget = () => {
    let {
      container
    } = this.props
    let target = null
    if (canUseDOM) {
      target = container ? document.querySelector(container) : document.body
    }
    return target
  }

  render() {
    let { add, remove, removeAll, update, props, state } = this;
    let {
      children,
      position = 'top-right',
      autoDismiss: inheritedAutoDismiss = true,
      duration = 5000,
      transitionDuration = 220
    } = props
    let { toasts } = state
    let hasToasts = Boolean(toasts.length)
    let portalTarget = this._getPortalTarget()
    return (
      <Provider value={{ add, remove, removeAll, update }}>
        {children}
        {
          portalTarget ? (
            createPortal(
              <ToastContainer position={position} hasToasts={hasToasts}>
                <TransitionGroup component={null}>
                  {
                    toasts.map(
                      ({
                        type,
                        autoDismiss,
                        description,
                        id,
                        onClose,
                        ...unknownConsumerProps
                      }) => (
                        <Transition
                          appear
                          key={id}
                          mountOnEnter
                          timeout={transitionDuration}
                          unmountOnExit
                        >
                          {
                            (transitionState: TransitionState) => (
                              <ToastController
                                id={id}
                                type={type}
                                autoDismiss={autoDismiss !== undefined
                                  ? autoDismiss
                                  : inheritedAutoDismiss}
                                duration={duration}
                                component={ToastElement}
                                key={id}
                                onClose={(ctx: any) => this.onDismiss(id, ctx, onClose)}
                                position={position}
                                transitionDuration={transitionDuration}
                                transitionState={transitionState}
                                {...unknownConsumerProps}
                              >
                                {description}
                              </ToastController>
                            )
                          }
                        </Transition>
                      )
                    )
                  }
                </TransitionGroup>
              </ToastContainer>,
              portalTarget
            )
          ) : (
            <ToastContainer position={position} hasToasts={hasToasts} /> // keep ReactDOM.hydrate happy
          )
        }
      </Provider>
    )
  }
}

export const ToastConsumer = ({ children }: { children: any }) => (
  <Consumer>{context => children(context)}</Consumer>
);

export const withToastManager = (Comp: any) => (
  React.forwardRef((props: any, ref: any) => (
    <ToastConsumer>
      {(context: any) => <Comp toastManager={{
        addToast: context.add,
        removeToast: context.remove,
        removeAllToasts: context.removeAll,
        updateToast: context.update
      }} {...props} ref={ref} />}
    </ToastConsumer>
  ))
)

export const useToasts = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw Error(
      'The `useToasts` hook must be called from a descendent of the `ToastProvider`.'
    );
  }

  return {
    addToast: ctx.add,
    removeToast: ctx.remove,
    removeAllToasts: ctx.removeAll,
    updateToast: ctx.update,
    toastStack: ctx.toasts,
  };
};
