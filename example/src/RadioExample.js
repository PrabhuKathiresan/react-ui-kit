import React, { useState } from 'react'
import { Radio } from '@mi-design/react-ui-kit'

export default function RadioExample() {
  let [simpleChecked, setSimpleChecked] = useState(false)
  let [radioGroup, setRadioGroup] = useState('')

  return (
    <div className='col-lg-4'>
      <div className='mb-16'>
        <h4>Radio button</h4>
        <hr />
        <Radio checked={simpleChecked} label='Simple radio button' onChange={(e) => setSimpleChecked(e.target.checked)} />
      </div>
      <div className='mb-16'>
        <h5 className='mb-0'>Favourite fruit</h5>
        <hr />
        <Radio.Group
          value={radioGroup}
          onChange={e => setRadioGroup(e.target.value)}
          options={[
            {
              label: 'Apple',
              value: 'apple'
            },
            {
              label: 'Orange',
              value: 'orange'
            },
            {
              label: 'Mango',
              value: 'mango'
            },
            {
              label: 'Grape',
              value: 'grape'
            },
            {
              label: 'Strawberry',
              value: 'strawberry'
            }
          ]}
        />
      </div>
    </div>
  )
}
