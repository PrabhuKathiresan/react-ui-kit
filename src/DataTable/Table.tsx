import React, { Component } from 'react'
import cx from 'classnames'
import Checkbox from '../Checkbox'
import Settings from '../icons/settings'
import SortDown from '../icons/sort-down'
import SortUp from '../icons/sort-up'
import {
  isDefined,
  noop,
  headerSelectColumn,
  headerSelectionColumn,
  selectableColumn
} from '../utils'
import {
  defaultColumnWidth
} from './constants'
import {
  ColumnProps,
  SelectColumnProps,
  SortedColumnProps,
  TableProps,
  InternalTableState
} from './props'

const SelectColumn = (props: SelectColumnProps) => {
  let { selected, header, onChange } = props
  let checked = false
  let indeterminate = false
  if (header) {
    if (selected === 'partial') indeterminate = true
    if (selected === 'all') checked = true
  } else {
    if (selected) checked = true
  }
  return <Checkbox checked={checked} indeterminate={indeterminate} onChange={(e) => onChange(e.target.checked)} />
}

const SortedColumn = (props: SortedColumnProps) => {
  let { sortedColumns, column } = props
  let index = sortedColumns.findIndex(sc => `${sc.name}`.toLowerCase() === `${column.name}`.toLowerCase())
  if (index === -1) {
    return null
  }
  let sortedColumn = sortedColumns[index]
  return (
    <span className='ui-kit-table-icon ml-auto'>
      {
        sortedColumn.direction === 'ASC' ?
          <SortDown />
          :
          <SortUp />
      }
    </span>
  )
}

const getCellData = (rowData: { [k: string]: any }, column: ColumnProps) => {
  let accessor = column.accessor
  let data = typeof accessor === 'string' && rowData[accessor] || typeof accessor === 'function' && accessor(rowData)
  return isDefined(data) ? data : null
}

export default class Table extends Component<TableProps & InternalTableState, {}> {
  _handleColumnSelectionClick = () => {
    this.props.showColumnSelection && this.props.toggleColumnSettings()
  }

  renderColGroup = (columns: Array<ColumnProps>) => (
    <colgroup>
      {
        columns.map((column, i) => {
          let { fixedWidth } = this.props
          let key = fixedWidth ? 'width' : 'maxWidth'
          let style = {
            [key]: isDefined(column.width) ? column.width : defaultColumnWidth
          }
          return (
            <col
              key={i}
              style={style}
            />
          )
        })
      }
    </colgroup>
  )

  renderHeaderColumn = (column: ColumnProps) => {
    let _column = null;
    let {
      getSelectedState,
      toggleSelectAll,
      columnSelectionIcon,
      sortedColumns
    } = this.props

    if (column.selectColumn) {
      _column = <SelectColumn selected={getSelectedState()} header onChange={(checked: boolean) => toggleSelectAll(checked)} />
    }

    if (column.selectionColumn) {
      _column = (
        <span role='button' aria-hidden tabIndex={0} className='cursor-pointer d-flex-justify-center-align-center selection-column-icon' onClick={() => this._handleColumnSelectionClick()}>
          {columnSelectionIcon || <Settings />}
        </span>
      )
    } else {
      _column = (
        <>
          <span className='ui-kit-table-content'>{column.name}</span>
          <SortedColumn sortedColumns={sortedColumns || []} column={column} />
        </>
      )
    }

    return _column;
  }

  renderHeader = (width: number) => {
    let columns = this.renderableColumns(true)
    let {
      showColumnSelection,
      fixedWidth,
      headerHeight,
      sortColumn,
      headerBorderless = false,
    } = this.props

    return (
      <table className={cx('ui-kit-table ui-kit-table-header', { 'ui-kit-table-header-borderless': headerBorderless })} style={{ minWidth: fixedWidth ? width : 'auto' }}>
        {this.renderColGroup(columns)}
        <thead>
          <tr style={{ height: headerHeight }} className={cx('ui-kit-header-row', { 'has-selection-column': showColumnSelection })}>
            {
              columns.map((column, i) => (
                <th
                  key={i}
                  className={cx({
                    'ui-kit-table-select-column': column.selectColumn,
                    'cursor-pointer': column.sortable,
                    'ui-kit-table-header-selection-column': column.selectionColumn
                  })}
                  onClick={() => sortColumn(column)}
                  style={{ height: column.selectionColumn ? headerHeight : 'auto' }}
                >
                  {this.renderHeaderColumn(column)}
                </th>
              ))
            }
          </tr>
        </thead>
      </table>
    )
  }

  renderBodyColumn = (column: ColumnProps, row: any) => {
    let _column = null;
    let {
      toggleRowSelect = noop
    } = this.props
    if (column.selectColumn) {
      _column = <SelectColumn selected={column.selected && column.selected(row)} header={false} onChange={(checked: boolean) => toggleRowSelect(row, row.index, checked)} />
    }

    if (!column.selectionColumn) {
      _column = <span className='ui-kit-table-content'>{getCellData(row, column)}</span>
    }

    return _column;
  }

  renderBody = (width: number, rows: Array<any>) => {
    let columns = this.renderableColumns()
    let {
      variant,
      fixedWidth
    } = this.props
    return (
      <table className={cx('ui-kit-table ui-kit-table-body', `ui-kit-table-${variant}`)} style={{ minWidth: fixedWidth ? width : 'auto' }}>
        {this.renderColGroup(columns)}
        <tbody>
          <>
            {
              rows.map((row) => (
                <tr key={row.index} className={cx({ 'ui-kit-table-row-selected': row.selected })}>
                  {
                    columns.map((column, i) => (
                      <td
                        key={i}
                        className={cx({
                          'ui-kit-table-select-column': column.selectColumn,
                          'selection-column': column.selectionColumn
                        })}
                      >
                        {this.renderBodyColumn(column, row)}
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </>
        </tbody>
      </table>
    )
  }

  renderableColumns = (header?: boolean) => {
    let { columns } = this.props
    let { selectable, showColumnSelection } = this.props

    if (selectable) {
      if (header) {
        columns = [headerSelectColumn(), ...columns]
      } else {
        columns = [selectableColumn(), ...columns]
      }
    }
    if (showColumnSelection) {
      columns = [...columns, headerSelectionColumn()]
    }
    return [...columns]
  }

  totalTableWidth = () => this.renderableColumns().reduce((width, column) => (column.width || defaultColumnWidth) + width, 0)

  render() {
    let { data } = this.props
    let width = this.totalTableWidth()

    return (
      <>
        {this.renderHeader(width)}
        {this.renderBody(width, data)}
      </>
    )
  }
}
