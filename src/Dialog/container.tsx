import React from 'react'
import { Transition } from 'react-transition-group'
import { DialogContainerProps } from './props'

export default function DialogContainer(props: DialogContainerProps) {
  return (
    <Transition
      timeout={{
        enter: 220,
        exit: 220
      }}
      in={!props.hidden}
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
          {props.children}
        </div>
      )}
    </Transition>
  )
}
