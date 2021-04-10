import React from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import BasicComponent from './BasicComponent';
import SelectComponent from './SelectComponent';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';

import './App.css';

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
              <NavLink className='nav-link' exact activeClassName='active' aria-current='page' to='/'>Basic</NavLink>
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/select'>Select</NavLink>
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/form'>Form</NavLink>
              <NavLink className='nav-link' activeClassName='active' aria-current='page' to='/data-table'>Data table</NavLink>
            </div>
          </div>
        </div>
      </nav>
      <div className="container py-40 text-default">
        <Route exact path='/' component={BasicComponent} />
        <Route exact path='/select' component={SelectComponent} />
        <Route exact path='/form' component={FormComponent} />
        <Route exact path='/data-table' component={TableComponent} />
      </div>
    </div>
  );
}

export default App;
