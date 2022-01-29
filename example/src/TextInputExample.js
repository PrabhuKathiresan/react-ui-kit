import React, { useEffect, useState } from 'react'
import { TextInput } from '@pk-design/react-ui-kit'
import { iconSizeMap } from './ButtonExample';

export default function TextInputExample() {
  let [success, setSuccess] = useState(false);
  let [userName, setUserName] = useState('');

  useEffect(() => {
    if (userName.length > 6) setSuccess(true)
    else setSuccess(false)
  }, [userName])
  return (
    <div className='col-xl-4 col-lg-6 mb-16'>
      <h4>Text input</h4>
      <hr />
      <TextInput
        label='User name'
        hintPosition='top'
        hint='Type in 6 char to see success state'
        id='normal'
        success={success}
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextInput
        label='Left hint that will show on left side'
        hintPosition='left'
        hint='I will show the hint on left.'
        id='left-hint'
        icon={{ left: '@', right: '$' }}
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
        hintIcon={<i className='material-icons-outlined' style={{ fontSize: iconSizeMap.medium }}>home</i>}
        hint='I will display a message. And this will show a very long text that you will never expect.'
        id='hint'
      />
    </div>
  )
}
