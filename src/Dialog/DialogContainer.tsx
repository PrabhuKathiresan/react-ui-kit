import React from 'react'
import { Transition } from 'react-transition-group'
import { DialogContainerProps } from './props'

export default function DialogContainer(props: DialogContainerProps) {
  let {
    hidden,
    transitionDuration,
    children
  } = props
  return (
    <Transition
      timeout={{
        appear: transitionDuration,
        enter: 0,
        exit: transitionDuration
      }}
      in={!hidden}
      unmountOnExit
      appear
    >
      {() => (
        <div
          style={{
            position: 'fixed',
            top: 0,
            zIndex: 999,
            height: '100vh',
            width: '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  )
}
