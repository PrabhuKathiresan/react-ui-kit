import React, { useState } from 'react'
import { set } from 'lodash'
import { ProgressBar, Button, TextInput, Select, Checkbox } from '@pk-design/react-ui-kit'

const { withProgressBarManager } = ProgressBar
const { BasicSelect } = Select

const placementOptions = [
  {
    name: 'top',
    label: 'Top'
  },
  {
    name: 'bottom',
    label: 'Bottom'
  }
];

const TypeOptions = [
  {
    name: 'controlled',
    label: 'Controlled'
  },
  {
    name: 'uncontrolled',
    label: 'Uncontrolled'
  },
  {
    name: 'indeterminate',
    label: 'Indeterminate'
  }
];

function ProgressBarExample(props) {
  let [progress, setProgress] = useState({
    default: {
      parent: 'body',
      placement: placementOptions[0],
      showSpinner: true,
      type: TypeOptions[0],
      value: 0
    },
    indeterminate: {
      parent: '#indeterminate-progress-bar',
      placement: placementOptions[0],
      showSpinner: true,
      type: TypeOptions[2]
    }
  })
  function startProgress(id, _opts = {}) {
    let _options = progress[id]
    let options = { ..._options, ..._opts, id, placement: _options.placement.name, type: _options.type.name }
    props.progressBarManager.start(options)
  }

  function updateProgress(id) {
    props.progressBarManager.increment(id)
  }

  function stopProgress(id) {
    props.progressBarManager.done(id)
  }

  function updateState(type, key, value) {
    let _progress = { ...progress }
    set(_progress, `${type}.${key}`, value)
    setProgress(_progress)
  }

  let defaultBarState = props.progressBarManager.getBar('default')
  let indeterminateBarState = props.progressBarManager.getBar('indeterminate')

  return (
    <div className='row'>
      <h4>Progress bar</h4>
      <hr />
      <div className='row gx-4 gy-2'>
        <div className='col-lg-5'>
          <div className='pa-16 border border-radius position-relative' id='default-progress-bar'>
            <h6>Default progress bar</h6>
            <p className='text--muted'>(#default-progress-bar)</p>
            <TextInput
              label={'Parent container'}
              value={progress.default.parent}
              onChange={(e) => updateState('default', 'parent', e.target.value)}
            />
            <TextInput
              type='number'
              label={'Start value'}
              min={0}
              max={.9}
              step={.1}
              value={progress.default.value}
              onChange={(e) => updateState('default', 'value', parseFloat(e.target.value))}
            />
            <BasicSelect
              label={'Progress placement'}
              labelKey='label'
              options={placementOptions}
              closeOnOutsideClick
              selected={[progress.default.placement]}
              onChange={([placement]) => updateState('default', 'placement', placement)}
            />
            <BasicSelect
              label={'Progress type'}
              labelKey='label'
              options={TypeOptions}
              closeOnOutsideClick
              selected={[progress.default.type]}
              onChange={([type]) => updateState('default', 'type', type)}
            />
            <Checkbox
              checked={progress.default.showSpinner}
              name='Show spinner'
              onChange={(e) => updateState('default', 'showSpinner', e.target.checked)}
            >
              Show Spinner
            </Checkbox>
            <br />
            <Button id='start-btn' disabled={defaultBarState} className='mt-16 mr-16' onClick={() => startProgress('default')}>
              Start
            </Button>
            <Button id='incr-btn' disabled={!defaultBarState} className='mt-16 mr-16' onClick={() => updateProgress('default')}>
              Increment 10
            </Button>
            <Button id='stop-btn' disabled={!defaultBarState} className='mt-16 mr-16' onClick={() => stopProgress('default')}>
              Stop
            </Button>
          </div>
        </div>
        <div className='col-lg-5'>
          <div className='pa-16 border border-radius position-relative' id='indeterminate-progress-bar'>
            <h6>Indeterminate progress bar</h6>
            <p className='text--muted'>(#indeterminate-progress-bar)</p>
            <TextInput
              label={'Parent container'}
              value={progress.indeterminate.parent}
              onChange={(e) => updateState('indeterminate', 'parent', e.target.value)}
            />
            <BasicSelect
              label={'Progress placement'}
              labelKey='label'
              options={placementOptions}
              closeOnOutsideClick
              selected={[progress.indeterminate.placement]}
              onChange={([placement]) => updateState('indeterminate', 'placement', placement)}
            />
            <Checkbox
              checked={progress.indeterminate.showSpinner}
              name='Show spinner'
              onChange={(e) => updateState('indeterminate', 'showSpinner', e.target.checked)}
            >
              Show Spinner
            </Checkbox>
            <br />
            <Button id='indeterminate-btn' disabled={indeterminateBarState} className='mt-16 mr-16' onClick={() => startProgress('indeterminate', { type: 'indeterminate' })}>
              Start Indeterminate
            </Button>
            <Button id='stop-indeterminate-btn' disabled={!indeterminateBarState} className='mt-16 mr-16' onClick={() => stopProgress('indeterminate')}>
              Stop
            </Button>
          </div>
        </div>
      </div>
      {/* <div className='col-lg-6 pa-16'>
        <h6>Small progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} size='small' />
        <h6>Medium progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} />
        <h6>Large progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} size='large' />
      </div>
      <div className='col-lg-6 pa-16'>
        <h6>Small progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} size='small' type='success' />
        <h6>Medium progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} type='success' />
        <h6>Large progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} size='large' type='success' />
      </div>
      <div className='col-lg-6 pa-16'>
        <h6>Small progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} size='small' type='warning' />
        <h6>Medium progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} type='warning' />
        <h6>Large progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} size='large' type='warning' />
      </div>
      <div className='col-lg-6 pa-16'>
        <h6>Small progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} size='small' type='danger' />
        <h6>Medium progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} type='danger' />
        <h6>Large progress bar</h6>
        <ProgressBar max={100} value={Math.floor(Math.random() * 101)} size='large' type='danger' />
      </div> */}
    </div>
  )
}

export default withProgressBarManager(ProgressBarExample)
