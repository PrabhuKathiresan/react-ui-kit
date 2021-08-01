import React from 'react'
import { ProgressBar } from '@pk-design/react-ui-kit'

export default function ProgressBarExample() {
  return (
    <>
      <h4>Progress bar</h4>
      <hr />
      <div className='col-lg-6 pa-16'>
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
      </div>
    </>
  )
}
