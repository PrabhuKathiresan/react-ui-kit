import React, { useState } from 'react'
import { Alert, Button, AlertStack } from '@pk-design/react-ui-kit'
import AppCode from './AppCode'
import PropsTable from './PropsTable'

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

const alertProps = [
  {
    name: 'title',
    description: 'Title to be displayed on the alert',
    type: 'any',
    default: 'null'
  },
  {
    name: 'content',
    description: 'Content to be displayed on the alert',
    type: 'any',
    default: 'null'
  },
  {
    name: 'type',
    description: 'Alert type',
    type: 'string',
    default: 'info',
    options: `'success' | 'error' | 'warning' | 'info'`
  },
  {
    name: 'className',
    description: 'Classname applied to alert box',
    type: 'string',
    default: ''
  },
  {
    name: 'dismissable',
    description: 'If alert can be dismissed',
    type: 'boolean',
    default: 'undefined'
  },
  {
    name: 'showIcon',
    description: 'If alert can display icon',
    type: 'boolean',
    default: 'true'
  },
  {
    name: 'iconType',
    description: 'Displayed icon type',
    type: 'string',
    default: 'default',
    options: `'default' | 'filled'`
  },
  {
    name: 'variant',
    description: 'Alert variant',
    type: 'string',
    default: 'default',
    options: `'default' | 'filled'`
  },
  {
    name: 'container',
    description: 'Parent container of the alert',
    type: 'string',
    default: 'null'
  },
  {
    name: 'banner',
    description: 'Is alert an banner',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'fixed',
    description: 'Is alert holds a fixed position',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'show',
    description: 'Can alert be shown (Useful when controlling alert visibility)',
    type: 'boolean',
    default: 'undefined'
  },
  {
    name: 'transitionDuration',
    description: 'Transistion duration on close (in milliseconds)',
    type: 'number',
    default: '220'
  },
  {
    name: 'style',
    description: 'CSS styles to be applied to alert',
    type: 'CSS object',
    default: '{}'
  },
  {
    name: 'position',
    description: 'CSS position of alter container',
    type: 'string',
    default: 'undefined',
    options: `absolute | fixed`
  },
  {
    name: 'fitToContainer',
    description: 'Fit alert into container',
    type: 'boolean',
    default: 'undefined'
  },
  {
    name: 'containerClass',
    description: 'Class applied to the container',
    type: 'string',
    default: ''
  },
  {
    name: 'onClose',
    description: 'Triggered on close of alert',
    type: 'function',
    default: 'noop'
  }
]

const alertStackProps = [
  {
    name: 'placement',
    description: 'Placement of alert stack',
    type: 'string',
    default: 'top',
    options: 'top | bottom'
  },
  {
    name: 'alerts',
    description: 'List of alerts to be stacked',
    type: 'Array of alert props',
    default: '[]'
  },
  {
    name: 'className',
    description: 'Alert stack className',
    type: 'string',
    default: ''
  },
  {
    name: 'banner',
    description: 'Is alert stack a banner',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'offset',
    description: 'Offset if alert stack is a banner',
    type: 'number',
    default: '0'
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
      <div>
        <h4>Usage</h4>
        <AppCode code={
          `
            import { Alert } from '@pk-design/react-ui-kit';
            // on render
            <Alert content='I am a success alert' type='success' />
          `
        } />
      </div>
      <div>
        <h4>Props</h4>
        <h6>Alert</h6>
        <PropsTable contents={alertProps} />
        <h6>Alert stack</h6>
        <PropsTable contents={alertStackProps} />
      </div>
    </>
  )
}
