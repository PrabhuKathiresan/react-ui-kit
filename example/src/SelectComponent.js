import React, { useState } from 'react'
import { Select } from '@pk-design/react-ui-kit';
import data from './countries.json';

const { BasicSelect, AsyncSelect } = Select;

const Fruits = ['Apple', 'Banana', 'Grapes', 'Jack fruit', 'Kiwi', 'Lemon', 'Mango'];

export default function SelectComponent() {
  let [selected, setSelected] = useState([]);
  let [asyncSelected, setAsyncSelected] = useState([]);
  let [countries,] = useState([...data]);
  let [favFruit, setFavFruit] = useState([]);
  let [options, setOptions] = useState({
    defaultFirstItemSelected: false,
    searchable: false,
    multiple: false,
    animate: true,
    labelKey: 'name',
    allowClear: false,
    disabled: false,
    flip: false,
    dropup: false,
    error: '',
    label: 'Select country',
    closeOnOutsideClick: true,
    async: false
  });

  let handleInputChange = (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setOptions(_options => ({
      ..._options,
      [e.target.name]: value
    }));
  }

  let handleSearch = (searchTerm) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...countries].filter(country => JSON.stringify(country).toLowerCase().includes(`${searchTerm}`.toLowerCase())))
      }, 100);
    })
  }

  let { options: _options, label: _label, ...asyncOptions } = options;

  return (
    <div className='col-12'>
      <div className='row my-16'>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <input type='checkbox' checked={options.animate} id='animate' name='animate' onChange={handleInputChange} />
          <label className='mb-0 ml-16' htmlFor='animate'>Animate</label>
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <input type='checkbox' checked={options.closeOnOutsideClick} id='closeOnOutsideClick' name='closeOnOutsideClick' onChange={handleInputChange} />
          <label className='mb-0 ml-16' htmlFor='closeOnOutsideClick'>Close on outside click</label>
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <input type='checkbox' id='defaultFirstItemSelected' checked={options.defaultFirstItemSelected} name='defaultFirstItemSelected' onChange={handleInputChange} />
          <label className='mb-0 ml-16' htmlFor='defaultFirstItemSelected'>Default first item selected</label>
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <input type='checkbox' id='searchable' checked={options.searchable} name='searchable' onChange={handleInputChange} />
          <label className='mb-0 ml-16' htmlFor='searchable'>Allow search</label>
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <input type='checkbox' id='multiple' checked={options.multiple} name='multiple' onChange={handleInputChange} />
          <label className='mb-0 ml-16' htmlFor='multiple'>Multi select</label>
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <input type='checkbox' id='allowClear' checked={options.allowClear} name='allowClear' onChange={handleInputChange} />
          <label className='mb-0 ml-16' htmlFor='allowClear'>Allow clear</label>
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <input type='checkbox' id='disabled' checked={options.disabled} name='disabled' onChange={handleInputChange} />
          <label className='mb-0 ml-16' htmlFor='disabled'>Disabled</label>
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <input type='checkbox' id='dropup' checked={options.dropup} name='dropup' onChange={handleInputChange} />
          <label className='mb-0 ml-16' htmlFor='dropup'>Drop up</label>
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <label className='mb-0 mr-16' htmlFor='error'>Error</label>
          <input type='text' id='error' value={options.error} name='error' onChange={handleInputChange} />
        </div>
        <div className='d-flex align-items-center mb-16 col-lg-3'>
          <label className='mb-0 mr-16' htmlFor='label'>Label</label>
          <input type='text' id='label' value={options.label} name='label' onChange={handleInputChange} />
        </div>
      </div>
      <div className='row'>
        <div className='col-lg-4'>
          <BasicSelect
            onChange={(s) => setSelected(s)}
            selected={selected}
            id='demo'
            {...options}
            options={[...countries]}
            icons={{
              right: <i className='bi-chevron-expand'></i>
            }}
            inputProps={{ tabIndex: 0 }}
          />
        </div>
        <div className='col-lg-4'>
          <AsyncSelect
            onChange={(s) => setAsyncSelected(s)}
            selected={asyncSelected}
            id='demo-async'
            {...asyncOptions}
            searchable
            label={`${options.label} - Async version`}
            onSearch={handleSearch}
          />
        </div>
        <div className='col-lg-3'>
          <BasicSelect
            {...options}
            options={[...Fruits]}
            id='fruits'
            label='Select favourite fruit'
            selected={favFruit}
            onChange={(s) => setFavFruit(s)}
          />
        </div>
      </div>
    </div>
  )
}
