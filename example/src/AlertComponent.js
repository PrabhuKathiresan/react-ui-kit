import React, { useState } from 'react'
import { Alert, Button, AlertStack } from '@pk-design/react-ui-kit'

const alertStacks = [
  {
    id: 1,
    content: 'Alert content 1',
    type: 'success',
    iconType: 'filled',
    dismissable: true
  },
  {
    id: 2,
    content: 'Alert content 2',
    type: 'error',
    iconType: 'filled'
  },
  {
    id: 3,
    content: 'Alert content 3',
    type: 'warning',
    iconType: 'filled'
  },
  {
    id: 4,
    content: 'I am a alert, with a long text. I will word break when required. I am a alert, with a long text. I will word break when required',
    type: 'info',
    iconType: 'filled'
  }
]

export default function AlertComponent() {
  let [showAlert, setShowAlert] = useState(false)
  let [alerts, setAlerts] = useState([...alertStacks])

  let onDismiss = (alert) => {
    setAlerts((_alerts) => {
      let index = _alerts.findIndex((a) => a.id === alert.id)

      _alerts.splice(index, 1)

      return [..._alerts]
    })
  }

  return (
    <>
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Alert with default icons</h4>
        <hr />
        <Alert content='I am a success alert' type='success' />
        <Alert content='I am a info alert' type='info' />
        <Alert content='I am a warning alert' type='warning' />
        <Alert content='I am a error alert' type='error' />
      </div>
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Alert with filled icons</h4>
        <hr />
        <Alert content='I am a success alert, with filled icon' type='success' iconType='filled' />
        <Alert content='I am a info alert, with filled icon' type='info' iconType='filled' />
        <Alert content='I am a warning alert, with filled icon' type='warning' iconType='filled' />
        <Alert content='I am a error alert, with filled icon' type='error' iconType='filled' />
      </div>
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Filled alerts</h4>
        <hr />
        <Alert variant='filled' content='I am a success alert' type='success' />
        <Alert variant='filled' content='I am a info alert' type='info' />
        <Alert variant='filled' content='I am a warning alert' type='warning' />
        <Alert variant='filled' content='I am a error alert' type='error' />
      </div>
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Dismissable alerts</h4>
        <hr />
        <Alert content='I am a alert, but I can be dismissed' type='info' dismissable />
        <Alert content='I am a alert, with a long text. I will word break when required. I am a alert, with a long text. I will word break when required' type='success' dismissable />
      </div>
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Alert as banner</h4>
        <hr />
        <div className='position-relative border-radius border' style={{ height: 250, overflow: 'auto' }}>
          <Alert content='I am a success alert, with filled icon' banner type='success' iconType='filled' dismissable />
          <div className='pa-16 pt-0'>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
          </div>
        </div>
      </div>
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Controlled alert</h4>
        <hr />
        <Button className='mb-16' onClick={() => setShowAlert(!showAlert)}>Toggle alert</Button>
        <Alert show={showAlert} onClose={() => setShowAlert(false)} content='I am a success alert, with filled icon' type='success' iconType='filled' dismissable />
      </div>
      <Alert
        content='I am a global notification'
        position='fixed'
        banner
        container='.container'
        iconType='filled'
        type='success'
        fitToContainer
        dismissable
      />
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Alert stack</h4>
        <hr />
        <AlertStack
          alerts={alerts}
          onDismiss={onDismiss}
        />
      </div>
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Alert stack as banner - sticky top</h4>
        <hr />
        <div className='position-relative border-radius border' style={{ height: 250, overflow: 'auto' }}>
          <AlertStack
            alerts={alerts}
            banner
            placement='top'
            onDismiss={onDismiss}
          />
          <div className='pa-16 pt-0'>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
          </div>
        </div>
      </div>
      <div className='mb-16 col-xl-4 col-lg-6 col-md-6'>
        <h4>Alert stack as banner - sticky bottom</h4>
        <hr />
        <div className='position-relative border-radius border' style={{ height: 250, overflow: 'auto' }}>
          <div className='pa-16 pb-0'>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
            <p>Some random content</p>
          </div>
          <AlertStack
            alerts={alerts}
            banner
            placement='bottom'
            onDismiss={onDismiss}
          />
        </div>
      </div>
    </>
  )
}
