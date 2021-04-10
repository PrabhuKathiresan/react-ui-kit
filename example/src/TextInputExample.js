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
        hint='I will show the hint.'
        id='normal'
      />
      <TextInput
        label='I am error input'
        hintPosition='left'
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
