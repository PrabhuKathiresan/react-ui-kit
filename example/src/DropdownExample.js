import React, { useRef, useState } from 'react'
import { Dropdown, Checkbox, Select } from '@pk-design/react-ui-kit'

const { BasicSelect } = Select

const DropdownOptions = [
  {
    label: 'Left',
    value: 'left',
    float: false
  },
  {
    label: 'Right',
    value: 'right',
    float: false
  },
  {
    label: 'Top Right',
    value: 'top-right',
    float: true
  },
  {
    label: 'Bottom Right',
    value: 'bottom-right',
    float: true
  },
  {
    label: 'Top Left',
    value: 'top-left',
    float: true
  },
  {
    label: 'Bottom Left',
    value: 'bottom-left',
    float: true
  }
];

const OPTIONS = [
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


export default function DropdownExample() {
  let contentDropdown = useRef()
  let [float, setFloat] = useState(true)
  let [position, setPosition] = useState('bottom-left')
  let onClick = (item) => {
    console.log('I have clicked on', item.name)
  }

  let onContentDropdownClick = (item) => {
    onClick(item);
    console.log(contentDropdown.current)
    contentDropdown.current?.closeDropdown()
  }

  let options = DropdownOptions.filter((option) => option.float === float)
  let selected = options.filter(option => option.value === position)

  function onFloatChange(e) {
    let { checked } = e.target
    if (checked) setPosition('bottom-left')
    else setPosition('left')
    setFloat(checked)
  }

  return (
    <div className='col-lg-6 mb-16'>
      <div className='element-flex'>
        <h4 className='mr-8'>Dropdown Example</h4>
      </div>
      <hr />
      <div className='mb-16'>
        <div className='mb-16'>
          <Checkbox checked={float} id='float' onChange={onFloatChange}>Floating dropdown</Checkbox>
        </div>
        <div>
          <BasicSelect
            label='Dropdown position'
            labelKey='label'
            options={options}
            selected={selected}
            onChange={(_s) => _s.length && setPosition(_s[0].value)}
            closeOnOutsideClick
          />
        </div>
      </div>
      <div className='d-flex flex-wrap mb-16'>
        <Dropdown
          textContent='Dropdown'
          id='dropdown1'
          ref={contentDropdown}
          maxHeight={150}
          offsetTop={5}
          float={float}
          position={position}
        >
          <ul className='dropdown-menu show position-relative border-0 pa-8'>
            {
              OPTIONS.map((option, i) => (
                option.divider ?
                  <hr className='mx-0 my-8' key={i} />
                  :
                  <li className='dropdown-item cursor-pointer' key={option.key} onClick={() => onContentDropdownClick(option)}>{option.name}</li>
              ))
            }
          </ul>
        </Dropdown>
      </div>
      <div style={{ height: 500 }} />
      <div className='d-flex flex-wrap'>
        <Dropdown
          textContent='Dropdown action'
          id='dropdown2'
          options={OPTIONS}
          onClick={onClick}
          offsetTop={5}
          float={float}
          position={position}
        />
      </div>
      <div style={{ height: 600 }} />
      <div className='d-flex flex-wrap'>
        <Dropdown
          textContent='Dropdown action with items'
          id='dropdown3'
          options={OPTIONS}
          onClick={onClick}
          offsetTop={5}
          float={float}
          position={position}
        />
      </div>
    </div>
  )
}
