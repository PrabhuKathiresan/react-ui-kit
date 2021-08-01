import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import AlertComponent from './AlertComponent';
import ButtonExample from './ButtonExample';
import CheckboxExample from './CheckboxExample';
import DialogExample from './DialogExample';
import DropdownExample from './DropdownExample';
import ProgressBarExample from './ProgressBarExample';
import RadioExample from './RadioExample';
import TextInputExample from './TextInputExample';
import ToastComponent from './ToastComponent';

// import BasicComponent from './BasicComponent';

const componentMap = {
  alert: AlertComponent,
  button: ButtonExample,
  checkbox: CheckboxExample,
  dialog: DialogExample,
  dropdown: DropdownExample,
  'radio-button': RadioExample,
  'text-input': TextInputExample,
  toast: ToastComponent,
  'progress-bar': ProgressBarExample
}

function BaseRoute() {
  let match = useRouteMatch()
  let path = '/basic'
  let { params: { componentName = 'alert' } } = match
  let Component = componentMap[componentName]
  return (
    <div className="row">
      <div className='col-xl-2 col-lg-3 mb-16'>
        <ul className='list-group'>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/alert`}>Alert</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/button`}>Button</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/dropdown`}>Dropdown</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/text-input`}>Text input</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/toast`}>Toast</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/dialog`}>Dialog</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/checkbox`}>Checkbox</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/radio-button`}>Radio button</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/progress-bar`}>Progress bar</NavLink></li>
        </ul>
      </div>
      <div className='col-xl-10 col-lg-9'>
        <div className='row'>
          <Component />
        </div>
      </div>
    </div>
  );
}

export default BaseRoute;
