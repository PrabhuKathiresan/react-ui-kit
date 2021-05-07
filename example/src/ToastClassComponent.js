import React, { Component } from 'react'
import { Button, Toast } from '@pk-design/react-ui-kit'

const { withToastManager } = Toast

class ToastClassComponent extends Component {
  handleClick = (type, message, options = {}) => {
    let { toastManager } = this.props
    console.log(toastManager)

    toastManager.addToast(message, {
      type,
      ...options
    })
  }

  onConfirm = () => {
    return new Promise(resolve => setTimeout(resolve, 3000))
  }

  onClose = (_id, confirmed) => {
    if (confirmed) {
      let { toastManager } = this.props

      toastManager.addToast('Confirmed your action', {
        type: 'success',
        autoDismiss: true,
        duration: 5000
      })
    }
  }

  render() {
    return (
      <div className='col-lg-4 mb-16'>
        <div className='example-btn-block'>
          <h4>Toast component - withToastManager</h4>
          <hr />
          <Button onClick={() => this.handleClick('success', 'Success toast', { description: 'Hello everyone! Hooray its a success toast' })}>
            Success
          </Button>
          <Button onClick={() => this.handleClick('info', 'Hello everyone! Hooray its a success toast')}>
            Info
          </Button>
          <Button onClick={() => this.handleClick('error', 'Hello everyone! Hooray its a error toast')}>
            Error
          </Button>
          <Button onClick={() => this.handleClick('warning', 'Hello everyone! Hooray its a warning toast')}>
            Warning
          </Button>
          <Button onClick={() => this.handleClick('success', 'Hello everyone! I will close in 5 seconds', { autoDismiss: true, duration: 5000 })}>
            Auto dismissed in 5 secs
          </Button>
          <Button onClick={() => this.handleClick('warning', 'Are you sure to perform this actions?', {
            confirm: true,
            onConfirm: this.onConfirm,
            onCancel: () => console.log('cancelled'),
            onClose: this.onClose
          })}
          >
            Confirm action
          </Button>
        </div>
      </div>
    )
  }
}

export default withToastManager(ToastClassComponent)
