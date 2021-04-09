import React from 'react';
import cx from 'classnames';
import CheckedIcon from '../icons/checked-icon';
import UncheckedIcon from '../icons/unchecked-icon';
import {
  ColumnProps,
  ColumnItemProps
} from './props'

interface ColumnSettingsProps {
  columns: Array<ColumnProps>,
  style: object,
  onChange: Function,
  setRef: any
}

function ColumnItem(props: ColumnItemProps) {
  let { selected, name, disabled, onClick } = props;
  return (
    <li className={cx({ 'settings-disabled': disabled })} onClick={disabled ? () => { } : () => onClick()}>
      <span className='column-settings-icon'>
        {selected ? <CheckedIcon /> : <UncheckedIcon />}
      </span>
      <span>{name}</span>
    </li>
  );
}

export default function ColumnSettings(props: ColumnSettingsProps) {
  let { columns = [], style, onChange, setRef } = props;
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
  );
}
