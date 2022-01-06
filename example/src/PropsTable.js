import React from 'react'

export default function PropsTable({ contents }) {
  return (
    <table className='table table-stripped'>
      <thead>
        <tr>
          <th>Prop name</th>
          <th>Description</th>
          <th>Type</th>
          <th>Default value</th>
          <th>Available options</th>
        </tr>
      </thead>
      <tbody>
        {
          contents.map((content, i) => (
            <tr key={i}>
              <td>{content.name}</td>
              <td>{content.description}</td>
              <td>{content.type}</td>
              <td>{content.default}</td>
              <td>{content.options}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}
