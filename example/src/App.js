import React from 'react';
import { Link, NavLink, Redirect, Route, Switch } from 'react-router-dom';
// import BasicComponent from './BasicComponent';
import SelectComponent from './SelectComponent';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';
import CustomFormComponent from './CustomFormComponent';
import DatepickerComponent from './DatepickerComponent';

import './App.css';
import BaseRoute from './BasicRoute';

function App() {
  return (
    <div className="">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to='/'>@pk-design/react-ui-kit</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/ui-components'>UI components</NavLink>
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/select'>Select</NavLink>
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/form'>Form</NavLink>
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/custom-form'>Custom Form</NavLink>
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/data-table'>Data table</NavLink>
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/date-picker'>Date picker</NavLink>
            </div>
          </div>
        </div>
      </nav>
      <div className="container py-40 text-default">
        <Switch>
          <Route path='/ui-components/:componentName' component={BaseRoute} />
          <Route exact path='/select' component={SelectComponent} />
          <Route exact path='/form' component={FormComponent} />
          <Route exact path='/custom-form' component={CustomFormComponent} />
          <Route exact path='/data-table' component={TableComponent} />
          <Route exact path='/date-picker' component={DatepickerComponent} />
          <Redirect from='/' to='/ui-components/alert' exact />
          <Redirect to='/' />
        </Switch>
      </div>
    </div>
  );
}

export default App;
