import React, { Component } from 'react'
import Dialog from './element'
import { DialogProps, DialogPositions, TransitionState } from './props'

const sizeMap = {
  xs: 360,
  sm: 520,
  md: 720,
  lg: 991,
  xl: 1200
}

const POSITION_TRANSLATE_MAP = {
  'top': {
    outer: {
      height: 'auto'
    },
    inner: {
      position: 'absolute',
      top: 0,
      width: '100%',
      maxWidth: '100%'
    }
  },
  'right': {
    outer: {
      justifyContent: 'flex-end'
    },
    inner: {
      position: 'absolute',
      height: '100%',
      right: 0
    }
  },
  'bottom': {
    outer: {
      height: 'auto'
    },
    inner: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      maxWidth: '100%'
    }
  },
  'left': {
    outer: {
      justifyContent: 'flex-start'
    },
    inner: {
      position: 'absolute',
      height: '100%',
      left: 0
    }
  },
  'center': {
    outer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    inner: {}
  },
  'top-left': {
    outer: {
      justifyContent: 'flex-start'
    },
    inner: {}
  },
  'top-center': {
    outer: {
      justifyContent: 'center'
    },
    inner: {}
  },
  'top-right': {
    outer: {
      justifyContent: 'flex-end'
    },
    inner: {}
  },
  'bottom-left': {
    outer: {
      justifyContent: 'flex-start',
      alignItems: 'flex-end'
    },
    inner: {}
  },
  'bottom-center': {
    outer: {
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    inner: {}
  },
  'bottom-right': {
    outer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end'
    },
    inner: {}
  }
}

const transitionCss = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 1 },
  exited: { opacity: 1 }
}

const dialogPositions = (position: DialogPositions, state: TransitionState) => {
  let posCss = POSITION_TRANSLATE_MAP[position].inner || {}
  return {
    ...posCss,
    ...transitionCss[state]
  }
}

export default class DialogController extends Component<DialogProps> {
  render() {
    let { position = 'right', size = 'sm', transitionState } = this.props
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        ...POSITION_TRANSLATE_MAP[position].outer || {}
      }}>
        <div
          style={{
            width: '100%',
            maxWidth: sizeMap[size],
            ...dialogPositions(position, transitionState),
          }}
        >
          <Dialog {...this.props} />
        </div>
      </div>
    )
  }
}
