import React, { useState } from 'react'
import { Button, Dialog, Select, Checkbox } from '@mi-design/react-ui-kit'
import FormComponent from './FormComponent'

const { useDialog } = Dialog
const POSITIONS = [
  {
    name: 'Top',
    value: 'top'
  },
  {
    name: 'Right',
    value: 'right'
  },
  {
    name: 'Bottom',
    value: 'bottom'
  },
  {
    name: 'Left',
    value: 'left'
  },
  {
    name: 'Top right',
    value: 'top-right'
  },
  {
    name: 'Top left',
    value: 'top-left'
  },
  {
    name: 'Top center',
    value: 'top-center'
  },
  {
    name: 'Bottom right',
    value: 'bottom-right'
  },
  {
    name: 'Bottom left',
    value: 'bottom-left'
  },
  {
    name: 'Bottom center',
    value: 'bottom-center'
  },
  {
    name: 'Center',
    value: 'center'
  },
]
const SIZES = [
  {
    name: 'Tiny',
    value: 'xs'
  },
  {
    name: 'Small',
    value: 'sm'
  },
  {
    name: 'Medium',
    value: 'md'
  },
  {
    name: 'Large',
    value: 'lg'
  },
  {
    name: 'Full screen',
    value: 'xl'
  }
]
const DEFAULTPOSITION = {
  name: 'Right',
  value: 'right'
}
const DEFAULTSIZE = {
  name: 'Small',
  value: 'sm'
}
const getSelected = (opts, s, defaultVal) => opts.find(o => o.value === s) || defaultVal

export default function DialogExample() {
  let dialog = useDialog();

  let [options, setOptions] = useState({
    title: 'Test',
    content: 'This is a description component in the dialog window',
    position: 'right',
    size: 'sm',
    showBackdrop: true
  })

  let handleClick = () => {
    
    dialog.show({
      ...options,
      content: <FormComponent stickyFooter={false} />
    })
  }

  return (
    <div className='col-lg-4 mb-16'>
      <h4>Dialog (useDialog)</h4>
      <hr />
      <h6>Options</h6>
      <div className='d-flex flex-wrap'>
        <Select
          labelKey='name'
          label='Select position'
          containerClass='mr-8'
          closeOnOutsideClick={true}
          options={POSITIONS}
          selected={[getSelected(POSITIONS, options.position, DEFAULTPOSITION)]}
          onChange={selected => {
            setOptions(options => ({ ...options, position: selected[0]?.value || 'right' }))
          }}
        />
        <Select
          labelKey='name'
          label='Select size'
          containerClass='mr-8'
          closeOnOutsideClick={true}
          options={SIZES}
          selected={[getSelected(SIZES, options.size, DEFAULTSIZE)]}
          onChange={selected => {
            setOptions(options => ({ ...options, size: selected[0]?.value || 'sm' }))
          }}
        />
        <Checkbox className='mr-8 mb-16' checked={options.showBackdrop} onChange={e => setOptions(options => ({ ...options, showBackdrop: e.target.checked }))}>Show backdrop</Checkbox>
      </div>
      <Button onClick={() => handleClick()}>Show Dialog</Button>
    </div>
  )
}
