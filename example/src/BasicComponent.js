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

export default function BasicComponent() {
  return (
    <div className='row'>
      <TextInputExample />
      <CheckboxExample />
      <RadioExample />
      <ButtonExample />
      <ToastComponent />
      <ToastClassComponent />
      <DialogExample />
      <DialogClassExample />
      <DropdownExample />
    </div>
  )
}
