import React, { Component, useContext } from 'react'
import { createPortal } from 'react-dom'
import { Transition, TransitionGroup } from 'react-transition-group'
import { generateUEID, noop } from '../utils'
import DialogContainer from './container'
import DialogController from './controller'
import { DialogState, TransitionState, ProviderProps, Props, DialogProps } from './props'

const DialogContext = React.createContext<ProviderProps | null>(null);
const { Provider, Consumer } = DialogContext;

const ANIMATION_DURATION = 200
const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export class DialogProvider extends Component<Props, DialogState> {
  state: DialogState = { modals: [] }

  has = (id: string) => {
    if (!this.state.modals.length) {
      return false
    }

    return Boolean(this.state.modals.filter(t => t.id === id).length)
  }

  dismiss = (id: string, cb: Function = noop) => {
    cb(id)
    this.hide(id)
  }

  show = (option: DialogProps, cb: Function = noop) => {
    let id = option.id ? option.id : generateUEID()
    option.id = id

    // bail if a toast exists with this ID
    if (this.has(id)) {
      return
    }

    let callback = () => cb(id)
    this.setState((state) => {
      return {
        modals: [
          ...state.modals,
          {
            ...option
          }
        ]
      }
    }, callback)
  }

  hide = (id: string, cb: Function = noop) => {
    // bail if NO dialog exists with this ID
    if (!this.has(id)) {
      return
    }

    let callback = () => cb()
    this.setState((state) => {
      let modals = state.modals.filter(t => t.id !== id)
      return { modals }
    }, callback)
  }

  render() {
    let {
      position = 'right',
      size = 'md',
      container,
      transitionDuration = ANIMATION_DURATION,
      children
    } = this.props

    let {
      modals
    } = this.state

    let hasModal = Boolean(modals.length)

    let portalTarget = canUseDOM ? container ? document.querySelector(container) : document.body : null

    return (
      <Provider value={{ show: this.show, hide: this.hide }}>
        {children}
        {
          portalTarget ?
            (
              createPortal(
                <DialogContainer hidden={!hasModal}>
                  <TransitionGroup component={null}>
                    {
                      modals.map((modal: DialogProps) => (
                        <Transition
                          appear
                          mountOnEnter
                          timeout={transitionDuration}
                          unmountOnExit
                          key={modal.id}
                        >
                          {(transitionState: TransitionState) => (
                            <DialogController
                              {...modal}
                              position={modal.position || position}
                              size={modal.size || size}
                              transitionState={transitionState}
                              transitionDuration={transitionDuration}
                              onClose={() => this.dismiss(modal.id, modal.onClose)}
                            />
                          )}
                        </Transition>
                      ))
                    }
                  </TransitionGroup>
                </DialogContainer>,
                portalTarget
              )
            ) :
            (
              <DialogContainer children={null} hidden={true} />
            )
        }
      </Provider>
    )
  }
}

export const DialogConsumer = ({ children }: { children: any }) => (
  <Consumer>{context => children(context)}</Consumer>
);

export const withDialogManager = (Comp: any) => (
  React.forwardRef((props: any, ref: any) => (
    <DialogConsumer>
      {(context: any) => <Comp dialogManager={context} {...props} ref={ref} />}
    </DialogConsumer>
  ))
)

export const useDialog = () => {
  const ctx = useContext(DialogContext);

  if (!ctx) {
    throw Error(
      'The `useToasts` hook must be called from a descendent of the `ToastProvider`.'
    );
  }

  return {
    show: ctx.show,
    hide: ctx.hide
  };
};
