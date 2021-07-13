import React, { useEffect, useState } from 'react'
import { DataTable } from '@pk-design/react-ui-kit'
import service from './service'
import CUSTOMERS from './customers.json'

const { BasicTable, AsyncTable } = DataTable

const formatDate = dateStr => {
  const [date, month, year] = dateStr.split('/');
  return `${month}/${date}/${year}`;
};

const COLUMNS = [
  {
    name: 'Customer name',
    accessor: 'name',
    width: 240,
    sortable: true,
    hideDisabled: true
  },
  {
    name: 'Address',
    accessor: 'address',
    width: 240
  },
  {
    name: 'State',
    accessor: (row) => row.state.name,
    width: 180
  },
  {
    name: 'Contact number',
    accessor: 'contact',
    width: 150
  },
  {
    name: 'GST number',
    accessor: 'gstInNumber',
    width: 150
  },
  {
    name: 'Last modified on',
    accessor: row => new Date(row.updatedAt).toDateString(),
    width: 150
  }
]

const OLYMPICS_COLUMNS = [
  {
    name: 'Athlete',
    accessor: 'athlete',
    width: 180,
    sortable: true,
    resizable: true,
    filterable: true,
    type: 'string'
  },
  {
    name: 'Sport',
    accessor: 'sport',
    width: 120,
    sortable: true,
    resizable: true,
    filterable: true,
    type: 'string',
  },
  {
    name: 'Age',
    accessor: 'age',
    type: 'number',
    width: 100,
  },
  {
    name: 'Year',
    accessor: 'year',
    type: 'number',
    width: 120
  },
  {
    name: 'Date',
    accessor: row => new Date(formatDate(row.date)).toDateString(),
    useSort: row => new Date(formatDate(row.date)),
    sortable: true,
    width: 150,
    type: 'date',
    filterable: true,
  },
  {
    name: 'Gold',
    accessor: 'gold',
    type: 'number',
  },
  {
    name: 'Silver',
    accessor: 'silver',
    type: 'number',
  },
  {
    name: 'Bronze',
    accessor: 'bronze',
    type: 'number',
  },
]

export default function TableComponent() {
  let [customers, setCustomers] = useState([])
  let [selected, setSelected] = useState([])
  let [loading, setLoading] = useState(true)
  let [basicColumns, setBasicColumns] = useState([...COLUMNS])

  useEffect(() => {
    setTimeout(() => {
      setCustomers(JSON.parse(JSON.stringify(CUSTOMERS)))
      setLoading(false)
    }, 1000)
  }, [])

  let onRowSelect = (row, index, checked) => {
    setCustomers(_customers => {
      _customers[index].selected = checked
      let sindex = selected.findIndex((s) => s._id === row._id)
      let predicate = (_selected) => [..._selected]
      if (checked) {
        if (sindex === -1) {
          predicate = _selected => [..._selected, row]
        }
      } else {
        if (sindex !== -1) {
          predicate = _selected => [..._selected].splice(sindex, 1)
        }
      }
      setSelected(predicate)
      return [..._customers]
    })
  }

  let onSelectAll = (options) => {
    let { complete = false, selected = false } = options
    let selectedRecords = []
    setCustomers(_customers => {
      if (complete) {
        if (selected) selectedRecords = [..._customers];
        return _customers.map((_customer, i) => {
          return {
            ..._customer,
            selected: selected
          }
        })
      }
      let { currentPage, total, limit } = options
      let start = (currentPage - 1) * limit
      let end = Math.min(currentPage * limit, total)
      return _customers.map((_customer, i) => {
        let _selected = i >= start && i < end ? selected : !!_customer.selected
        if (_selected) selectedRecords.push({ ..._customer })
        return { ..._customer, selected: _selected }
      })
    })
    setSelected(selectedRecords);
  }

  let onColumnChange = (hidden, index, column) => {
    setBasicColumns(columns => {
      columns[index].hidden = hidden
      return [...columns]
    })
  }

  return (
    <div>
      <h4 className='mb-20'>Basic table</h4>
      <BasicTable
        columns={[...basicColumns]}
        data={[...customers]}
        loading={loading}
        selectable
        height={500}
        paginate
        fixedWidth
        selected={selected}
        onSelect={onRowSelect}
        onSelectAll={onSelectAll}
        showColumnSelection
        onColumnChange={onColumnChange}
        headerBorderless
        columnSelectionIcon={<i className='material-icons-outlined fs-18'>drive_file_rename_outline</i>}
      />
      <h4 className='my-20'>Async table</h4>
      <AsyncTable
        columns={[...OLYMPICS_COLUMNS]}
        service={service}
        height={500}
        paginate
        selectable
        headerHeight={40}
        footerHeight={40}
        showProgress
        hideFooterText
      />
    </div>
  )
}
