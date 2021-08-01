import React, { useEffect, useRef, useState } from 'react'
import { Dropdown, Button } from '@pk-design/react-ui-kit'

const options = [
  {
    key: 'option1',
    name: 'Action 1'
  },
  {
    key: 'option2',
    name: 'Action 2'
  },
  {
    key: 'option3',
    name: 'Action 3'
  },
  {
    divider: true
  },
  {
    key: 'option4',
    name: 'Another action 1'
  },
  {
    key: 'option5',
    name: 'Another action 2'
  }
]

const dropdownOptions = {
  test1: {
    float: true,
    position: 'top-right'
  },
  test2: {
    float: true,
    position: 'bottom-right'
  },
  lam1: {
    position: 'left'
  },
  lam2: {
    position: 'left'
  }
}

export default function DropdownExample() {
  let contentDropdown = useRef()
  let [id, setId] = useState('lam')
  let [eleId1, setEleId1] = useState(`${id}1`)
  let [eleId2, setEleId2] = useState(`${id}12`)
  let onClick = (item) => {
    console.log('I have clicked on', item.name)
  }

  let onContentDropdownClick = (item) => {
    onClick(item);
    contentDropdown.current?.closeDropdown()
  }

  useEffect(() => {
    setEleId1(`${id}1`)
    setEleId2(`${id}2`)
  }, [id])

  return (
    <div className='col-lg-6 mb-16'>
      <div className='element-flex'>
        <h4 className='mr-8'>Dropdown Example</h4>
        <Button size='small' theme='default' variant='plain' onClick={() => setId(id === 'lam' ? 'test' : 'lam')}>Change dropdown</Button>
      </div>
      <hr />
      <div className='d-flex flex-wrap mb-16'>
        <Dropdown
          textContent='Dropdown action'
          id={eleId1}
          ref={contentDropdown}
          maxHeight={150}
          offsetTop={5}
          {...dropdownOptions[eleId1]}
        >
          <ul className='dropdown-menu show position-relative border-0 pa-0'>
            {
              options.map((option, i) => (
                option.divider ?
                  <hr className='mx-0 my-8' key={i} />
                  :
                  <li className='dropdown-item cursor-pointer' key={option.key} onClick={() => onContentDropdownClick(option)}>{option.name}</li>
              ))
            }
          </ul>
        </Dropdown>
      </div>
      <div style={{ height: 200 }} />
      <div className='d-flex flex-wrap'>
        <Dropdown
          textContent='Dropdown action with items'
          id={eleId2}
          options={options}
          onClick={onClick}
          offsetTop={5}
          {...dropdownOptions[eleId2]}
        />
      </div>
    </div>
  )
}
