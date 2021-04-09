/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

export default function Loader({ loading = false }) {
  return (
    <div className='ui-kit-table-loader-container d-flex-justify-center-align-center' style={{ display: loading ? 'flex' : 'none' }}>
      <div className='ui-kit-table-loader-wrapper d-flex-justify-center-align-center'>
        <div className='ui-kit-table-loader'>
          <svg viewBox='22 22 44 44'>
            <circle className='ui-kit-table-loader-path' cx='44' cy='44' r='19.5' fill='none' strokeWidth='4' />
          </svg>
        </div>
      </div>
    </div>
  );
}
