import React from 'react'
import { TextInput } from '@pk-design/react-ui-kit'

export default function TextInputExample() {
  return (
    <div className='col-lg-4 mb-16'>
      <h4>Text input</h4>
      <hr />
      <TextInput
        label='User name'
        hintPosition='top'
        hint='I will show the hint on top. I will show the hint on top.'
        id='normal'
      />
      <TextInput
        label='Left hint that will show on left side'
        hintPosition='left'
        hint='I will show the hint on left.'
        id='left-hint'
      />
      <TextInput
        label='I am error input'
        hintPosition='right'
        hint='I will show some helper text'
        error='This field is required'
        id='error'
      />
      <TextInput
        label='I have a hint'
        hintPosition='bottom'
        hint='I will display a message. And this will show a very long text that you will never expect.'
        id='hint'
      />
    </div>
  )
}
