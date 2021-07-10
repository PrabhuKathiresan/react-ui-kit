import React, { useRef } from 'react'
import { Dropdown } from '@pk-design/react-ui-kit'

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

export default function DropdownExample({ id = 'lam' }) {
  let contentDropdown = useRef()
  let onClick = (item) => {
    console.log('I have clicked on', item.name)
  }

  let onContentDropdownClick = (item) => {
    onClick(item);
    contentDropdown.current?.closeDropdown()
  }

  let eleId1 = `${id}1`;
  let eleId2 = `${id}2`;

  return (
    <div className='col-lg-4 mb-16'>
      <h4>Dropdown Example</h4>
      <hr />
      <div className='d-flex flex-wrap mb-16'>
        <Dropdown
          textContent='Dropdown action'
          id={eleId1}
          ref={contentDropdown}
          maxHeight={150}
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
          {...dropdownOptions[eleId2]}
        />
      </div>
    </div>
  )
}
