import React from 'react'
import Loader from '../Loader'

export default function DataTableLoader({ loading = false }) {
  return (
    <div className='ui-kit-table-loader-container d-flex-justify-center-align-center' style={{ display: loading ? 'flex' : 'none' }}>
      <div className='ui-kit-table-loader-wrapper d-flex-justify-center-align-center'>
        <Loader size={20} />
      </div>
    </div>
  )
}
