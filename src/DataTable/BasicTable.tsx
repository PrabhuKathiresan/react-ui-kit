import React, { Component } from 'react'
import Footer from './Footer'
import Loader from './Loader'
import ColumnSettings from './ColumnSettings'
import EmptyBox from '../icons/empty-box'
import {
  getNextPage,
  getPreviousPage,
  getTableStyle,
  getProcessedData,
  noop,
  mapIndex
} from '../utils'
import { getPaginationOptions, DEFAULT_FOOTER_HEIGHT, DEFAULT_HEADER_HEIGHT } from './constants'
import Table from './Table'
import {
  TableProps,
  TableState,
  ColumnProps
} from './props'

export default class BasicTable extends Component<TableProps, TableState> {
  scrollableArea = React.createRef<HTMLDivElement>()
  columnSettings: (HTMLDivElement | null) = null
  records: Array<any> = []
  totalRecords: number = 0

  constructor(props: TableProps) {
    super(props)
    let { paginate = false, defaultSortedColumns = [], paginationOptions } = props
    this.state = {
      paginate,
      paginationOptions: getPaginationOptions(paginationOptions),
      sortedColumns: [...defaultSortedColumns],
      showSettings: false,
      selectedPages: {},
      partiallySelectedPages: {}
    }
  }

  getPageLimit = () => this.state.paginationOptions.limit

  getCurrentPageKey = () => {
    let { paginationOptions: { currentPage, limit } } = this.state
    return `${currentPage}::${limit}`
  }

  currentPageSelected = () => {
    let { paginate, selected = [] } = this.props
    if (paginate) {
      return this.state.selectedPages[this.getCurrentPageKey()]
    }
    return this.records.length === selected.length
  }

  currentPageHasPartialSelection = () => {
    let { paginate, selected = [] } = this.props
    if (paginate) {
      return this.state.partiallySelectedPages[this.getCurrentPageKey()]
    }
    return !!selected.length
  }

  toggleRowSelect = (row: any, index: number, checked: boolean) => {
    let { paginate, onSelect = noop } = this.props
    if (paginate) {
      let { selectedPages, partiallySelectedPages } = this.state
      let page = this.getCurrentPageKey()
      partiallySelectedPages[page] = true
      if (this.currentPageSelected()) {
        delete selectedPages[page]
      } else {
        let selectedRecords = this.records.filter(record => record.selected)
        if (checked) {
          // Since this current record haven't been selected in actual state, adding 1
          if (selectedRecords.length + 1 === this.getPageLimit()) {
            delete partiallySelectedPages[page]
            selectedPages[page] = true
          }
        } else {
          if (!(selectedRecords.length - 1)) {
            delete partiallySelectedPages[page]
          }
        }
      }
      this.setState({
        selectedPages: { ...selectedPages },
        partiallySelectedPages: { ...partiallySelectedPages }
      })
    }
    onSelect(row, index, checked)
  }

  toggleSelectAll = (checked: boolean) => {
    let { paginate, onSelectAll = noop } = this.props
    if (paginate) {
      let { paginationOptions, selectedPages, partiallySelectedPages } = this.state
      let page = this.getCurrentPageKey()
      if (this.currentPageSelected()) {
        delete selectedPages[page]
      } else {
        selectedPages[page] = true
      }
      delete partiallySelectedPages[page]
      this.setState({
        selectedPages: { ...selectedPages },
        partiallySelectedPages: { ...partiallySelectedPages }
      })
      onSelectAll({
        ...paginationOptions,
        total: this.totalRecords,
        selected: checked,
        recordIndexes: this.records.map(rec => rec.index)
      })
    } else {
      onSelectAll({ selected: checked })
    }
  }

  getSelectedState = () => {
    let selected = 'none'
    if (this.currentPageSelected()) {
      selected = 'all'
    } else if (this.currentPageHasPartialSelection()) {
      selected = 'partial'
    }
    return selected
  }

  sortColumn = (column: ColumnProps) => {
    if (column.sortable) {
      this.setState(prevState => {
        let sortedColumns = [...prevState.sortedColumns]
        let property = column.useSort || column.accessor || ''
        let name = column.name || ''
        let index = sortedColumns.findIndex(c => c.name === column.name)
        if (index !== -1) {
          if (sortedColumns[index].direction === 'ASC') {
            sortedColumns[index] = {
              ...sortedColumns[index],
              direction: 'DESC',
            }
          } else {
            sortedColumns.splice(index, 1)
          }
        } else {
          sortedColumns.unshift({
            property,
            name,
            direction: 'ASC'
          })
        }
        return {
          sortedColumns
        }
      }, () => {
        let { paginate, onSelectAll = noop } = this.props
        if (paginate) {
          this.setState({
            selectedPages: {},
            partiallySelectedPages: {}
          }, () => {
            onSelectAll({
              complete: true,
              selected: false
            })
          })
        }
      })
    }
  }

  filteredColumns = () => [...this.props.columns].filter(column => !column.hidden)

  gotoNextPage = (total: number) => {
    this.setState(state => ({
      paginationOptions: {
        ...state.paginationOptions,
        currentPage: getNextPage(state.paginationOptions, total)
      }
    }), this.afterPageChange)
  }

  gotoPreviousPage = () => {
    this.setState(state => ({
      paginationOptions: {
        ...state.paginationOptions,
        currentPage: getPreviousPage(state.paginationOptions)
      }
    }), this.afterPageChange)
  }

  afterPageChange = () => {
    if (this.scrollableArea.current) this.scrollableArea.current.scrollTop = 0
  }

  setPaginationLimit = (limit: number = 10) => {
    this.setState((prevState: TableState) => ({
      paginationOptions: {
        ...prevState.paginationOptions,
        currentPage: 1,
        limit
      }
    }), () => {
      this.clearSelection()
      this.afterPageChange()
    })
  }

  clearSelection = () => {
    let { clearSelection = noop } = this.props
    this.setState({
      selectedPages: {},
      partiallySelectedPages: {}
    }, () => clearSelection())
  }

  toggleColumnSettings = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings
    }), () => {
      setTimeout(() => {
        if (this.state.showSettings) {
          this.addEvtListener()
        } else {
          this.removeEvtListener()
        }
      }, 10)
    })
  }

  addEvtListener = () => window.addEventListener('click', this.handleOutsideClick, false)

  removeEvtListener = () => window.removeEventListener('click', this.handleOutsideClick, false)

  handleOutsideClick = (e: MouseEvent) => {
    if (
      this.columnSettings
      && e.target instanceof HTMLElement
      && !this.columnSettings.contains(e.target)
    ) {
      this.toggleColumnSettings()
    }
  }

  render() {
    let {
      data = [],
      headerHeight = DEFAULT_HEADER_HEIGHT,
      footerHeight = DEFAULT_FOOTER_HEIGHT,
      paginate = false,
      loading = false,
      showColumnSelection = false,
      columns = [],
      onColumnChange = noop,
      emptyText,
      emptyIcon = null,
      selectable,
      fixedWidth,
      variant = 'bordered',
      onRefresh = noop,
      id = new Date().getTime().toString(),
      hideFooterText = false
    } = this.props

    let { showSettings, sortedColumns } = this.state

    let { data: processedData, total } = getProcessedData(mapIndex(data), {
      ...this.props,
      ...this.state
    })

    this.records = [...processedData]
    this.totalRecords = total

    let isEmpty = total === 0

    let tableStyle = getTableStyle(this.props)
    let filteredColumns = this.filteredColumns()

    return (
      <div className='ui-kit-table-container' style={tableStyle}>
        <div className='ui-kit-table-wrapper' style={{ height: `calc(${tableStyle.height} - ${footerHeight}px)` }} ref={this.scrollableArea}>
          <Table
            data={processedData}
            sortedColumns={sortedColumns}
            selectable={selectable}
            showColumnSelection={showColumnSelection}
            fixedWidth={fixedWidth}
            headerHeight={headerHeight}
            variant={variant}
            columns={filteredColumns}
            sortColumn={this.sortColumn}
            getSelectedState={this.getSelectedState}
            toggleColumnSettings={this.toggleColumnSettings}
            toggleSelectAll={this.toggleSelectAll}
            toggleRowSelect={this.toggleRowSelect}
            id={id}
          />
        </div>
        <Footer
          paginationOptions={this.state.paginationOptions}
          paginate={paginate}
          itemsCount={total}
          height={footerHeight}
          setPaginationLimit={this.setPaginationLimit}
          gotoNextPage={this.gotoNextPage}
          gotoPreviousPage={this.gotoPreviousPage}
          refreshTable={onRefresh}
          hideFooterText={hideFooterText}
          id={id}
        />
        <Loader loading={loading} />
        {
          showColumnSelection && showSettings && (
            <ColumnSettings
              columns={columns}
              style={{
                top: headerHeight,
                maxHeight: `calc(${tableStyle.height} - ${footerHeight + headerHeight}px)`
              }}
              onChange={onColumnChange}
              setRef={(columnSettings: HTMLDivElement) => this.columnSettings = columnSettings}
            />
          )
        }
        {
          (!loading && isEmpty) ?
            <EmptyBox emptyText={emptyText} emptyIcon={emptyIcon} />
            :
            null
        }
      </div>
    )
  }
}
