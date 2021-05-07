import React from 'react'
import { Button, Toast } from '@pk-design/react-ui-kit'

const { useToasts } = Toast

export default function ToastComponent() {
  let { addToast } = useToasts()

  let handleClick = (type, message, options = {}) => {
    addToast(message, {
      type,
      ...options
    })
  }

  return (
    <div className='col-lg-4 mb-16'>
      <div className='example-btn-block'>
        <h4>Toast component</h4>
        <hr />
        <Button onClick={() => handleClick('success', 'Success Toast', { description: 'Hello everyone! Hooray its a success toast, This will have more content to display and lets see how it works' })}>
          Success
        </Button>
        <Button onClick={() => handleClick('info', 'Hello everyone! Hooray its a success toast')}>
          Info
        </Button>
        <Button onClick={() => handleClick('error', 'Hello everyone! Hooray its a error toast')}>
          Error
        </Button>
        <Button onClick={() => handleClick('warning', 'Hello everyone! Hooray its a warning toast')}>
          Warning
        </Button>
        <Button onClick={() => handleClick('success', 'Hello everyone! I will close in 5 seconds', { autoDismiss: true, duration: 5000 })}>
          Auto dismissed in 5 secs
        </Button>
        <Button onClick={() => handleClick('success', 'Profile creation success')}>
          Without description
        </Button>
      </div>
    </div>
  )
}
