import React, { useState } from 'react'
import { Checkbox } from '@mi-design/react-ui-kit'

const CheckboxGroup = Checkbox.Group

const FRUITS = [
  {
    label: 'Apple',
    value: 'apple',
    disabled: false
  },
  {
    label: 'Orange',
    value: 'orange'
  },
  {
    label: 'Guava',
    value: 'guava'
  },
  {
    label: 'Mango',
    value: 'mango'
  },
  {
    label: 'Lemon',
    value: 'lemon'
  }
];

export default function CheckboxExample() {
  let [checked, setChecked] = useState(false)
  let [fruits, setFruits] = useState(['apple'])

  let onGroupChange = (e) => {
    let values = [...fruits];
    let index = values.indexOf(e.target.value)
    index !== -1 ? values.splice(index, 1) : values.push(e.target.value)
    setFruits(values)
  }

  let selectAll = (e) => {
    if (e.target.checked) setFruits(FRUITS.map(fruit => fruit.value))
    else setFruits([])
  }
  return (
    <div className='col-lg-4'>
      <div className='mb-16'>
        <h4>Checkbox</h4>
        <hr />
        <Checkbox id='checkbox' name='checkbox' checked={checked} onChange={e => setChecked(e.target.checked)}>
          I am checkbox
        </Checkbox>
      </div>
      <div className='mb-16'>
        <Checkbox indeterminate={fruits.length > 0} checked={fruits.length === FRUITS.length} onChange={(e) => selectAll(e)}>
          <h5 className='mb-0 d-inline-block'>Favorite fruits</h5>
        </Checkbox>
        <hr />
        <CheckboxGroup variant='row' options={FRUITS} value={fruits} onChange={onGroupChange} />
      </div>
    </div>
  )
}
