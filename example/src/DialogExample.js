import React, { useState, useEffect } from 'react'
import { Button, Dialog, Select, Checkbox } from '@pk-design/react-ui-kit'
import FormComponent from './FormComponent'
import DialogClassExample from './DialogClassExample'

const { useDialog } = Dialog
const { BasicSelect } = Select
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
const DIALOG = 'basic-dialog'
const UPDATABLE_DIALOG = 'updatable-dialog'

const MyComponent = ({ useNew, onClick }) => (
  <div>
    <div>{useNew ? 'I am new component' : 'old component'}</div>
    <Button onClick={onClick}>{`Swtich to ${useNew ? 'old' : 'new'} component`}</Button>
  </div>
)

export default function DialogExample() {
  let dialog = useDialog()
  let [useNew, setUseNew] = useState(false)
  let [options, setOptions] = useState({
    id: DIALOG,
    title: 'Test',
    content: 'This is a description component in the dialog window',
    position: 'right',
    size: 'sm',
    showBackdrop: true
  })

  let hideDialog = () => dialog.hide(DIALOG)

  let handleClick = () => {
    dialog.show({
      ...options,
      content: <FormComponent onSuccess={hideDialog} onError={hideDialog} stickyFooter onCancel={hideDialog} />
    })
  }

  let openWithUpdate = () => {
    dialog.show({
      ...options,
      id: UPDATABLE_DIALOG,
      content: <MyComponent useNew={useNew} onClick={() => setUseNew(!useNew)} />
    })
  }

  useEffect(() => {
    dialog.update(UPDATABLE_DIALOG, {
      content: <MyComponent useNew={useNew} onClick={() => setUseNew(!useNew)} />
    })
  }, [useNew]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className='col-xl-4 col-lg-6 mb-16'>
        <h4>Dialog (useDialog)</h4>
        <hr />
        <h6>Options</h6>
        <div className='d-flex flex-wrap'>
          <BasicSelect
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
          <BasicSelect
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
        <Button onClick={() => handleClick()} className='mr-16'>Show Dialog</Button>
        <Button onClick={() => openWithUpdate()}>Updatable Dialog</Button>
      </div>
      <DialogClassExample />
    </>
  )
}
