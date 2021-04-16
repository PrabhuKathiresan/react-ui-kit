import React from 'react'
import Checkbox from '../Checkbox'
import {
  ColumnProps,
  ColumnItemProps
} from './props'
import { noop } from '../utils'

interface ColumnSettingsProps {
  columns: Array<ColumnProps>,
  style: object,
  onChange: Function,
  setRef: any
}

function ColumnItem(props: ColumnItemProps) {
  let { selected, name, disabled, onClick } = props
  let _handleChange = disabled ? noop : (e: any) => onClick(e.target.checked)
  return (
    <li>
      <Checkbox checked={selected} disabled={disabled} onChange={_handleChange}>{name}</Checkbox>
    </li>
  )
}

export default function ColumnSettings(props: ColumnSettingsProps) {
  let { columns = [], style, onChange, setRef } = props
  return (
    <div className='ui-kit-table-column-settings' style={style} ref={setRef}>
      <div className='ui-kit-table-column-settings--header'>List of columns</div>
      <ul>
        {
          columns.map((column, i) => (
            <ColumnItem
              selected={!column.hidden}
              name={column.name || ''}
              key={i}
              onClick={() => onChange(!column.hidden, i, column)}
              disabled={column.hideDisabled}
            />
          ))
        }
      </ul>
    </div>
  )
}
