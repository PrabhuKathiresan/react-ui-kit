import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import AccordionComponent from './AccordionComponent';
import AlertComponent from './AlertComponent';
import ButtonExample from './ButtonExample';
import CarouselComponent from './CarouselComponent';
import CheckboxExample from './CheckboxExample';
import DialogExample from './DialogExample';
import DropdownExample from './DropdownExample';
import ProgressBarExample from './ProgressBarExample';
import RadioExample from './RadioExample';
import TabsComponent from './TabsComponent';
import TextInputExample from './TextInputExample';
import ToastComponent from './ToastComponent';

const componentMap = {
  alert: AlertComponent,
  accordion: AccordionComponent,
  button: ButtonExample,
  checkbox: CheckboxExample,
  carousel: CarouselComponent,
  dialog: DialogExample,
  dropdown: DropdownExample,
  'radio-button': RadioExample,
  'text-input': TextInputExample,
  toast: ToastComponent,
  'progress-bar': ProgressBarExample,
  tabs: TabsComponent
}

function BaseRoute() {
  let match = useRouteMatch()
  let path = '/ui-components'
  let { params: { componentName = 'alert' } } = match
  let Component = componentMap[componentName]
  return (
    <div className="row">
      <div className='col-xl-2 col-lg-3 mb-16'>
        <ul className='list-group'>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/alert`}>Alert</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/accordion`}>Accordion</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/button`}>Button</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/carousel`}>Carousel</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/checkbox`}>Checkbox</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/dropdown`}>Dropdown</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/dialog`}>Dialog</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/progress-bar`}>Progress bar</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/radio-button`}>Radio button</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/tabs`}>Tabs</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/text-input`}>Text input</NavLink></li>
          <li className='list-group-item'><NavLink activeClassName='active' aria-current='page' to={`${path}/toast`}>Toast</NavLink></li>
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
