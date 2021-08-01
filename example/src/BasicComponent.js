import React from 'react'
import ToastComponent from './ToastComponent'
import ToastClassComponent from './ToastClassComponent'
import TextInputExample from './TextInputExample'
import CheckboxExample from './CheckboxExample'
import ButtonExample from './ButtonExample'
import DialogExample from './DialogExample'
import DialogClassExample from './DialogClassExample'
import RadioExample from './RadioExample'
import DropdownExample from './DropdownExample'
import AlertComponent from './AlertComponent'

export default function BasicComponent() {
  return (
    <div className='row'>
      <div className='col-lg-4'>
        <ul>
          <li></li>
        </ul>
      </div>
      <div className='col-lg-8'>
        <div className='row'>
          <DropdownExample id='test' />
          <TextInputExample />
          <CheckboxExample />
          <RadioExample />
          <ButtonExample />
          <ToastComponent />
          <ToastClassComponent />
          <DialogExample />
          <DialogClassExample />
          <DropdownExample />
          <AlertComponent />
        </div>
      </div>
    </div>
  )
}
