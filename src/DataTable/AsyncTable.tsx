import React, { Component } from 'react'
import Table from './Table'
import Footer from './Footer'
import Loader from './Loader'
import ProgressBar from './ProgressBar'
import ColumnSettings from './ColumnSettings'
import EmptyBox from '../icons/empty-box'
import { getPaginationOptions } from './constants'
import {
  getNextPage,
  getPreviousPage,
  getTableStyle,
  generateID,
  stringify,
  noop
} from '../utils'
import {
  ColumnProps,
  AsyncProps,
  AsyncTableState,
  ServiceResponseProps
} from './props'
import {
  DEFAULT_FOOTER_HEIGHT,
  DEFAULT_HEADER_HEIGHT
} from './constants'

class AsyncTable extends Component<AsyncProps, AsyncTableState> {
  scrollableArea = React.createRef<HTMLDivElement>()
  columnSettings: (HTMLDivElement | null) = null
  _unsubscribe: boolean = false

  constructor(props: AsyncProps) {
    super(props)
    let { paginate, paginationOptions, defaultSortedColumns = [] } = props
    this.state = {
      data: [],
      total: 0,
      loading: true,
      progressing: true,
      paginate,
      paginationOptions: getPaginationOptions(paginationOptions),
      sortedColumns: [...defaultSortedColumns],
      selected: [],
      selectAll: false,
      showSettings: false
    }
  }

  componentDidMount() {
    this.fetchRecord()
  }

  componentDidUpdate(prevProps: AsyncProps) {
    let { additionalParams, filters } = this.props
    if (
      (stringify(prevProps.additionalParams) !== stringify(additionalParams)) ||
      (stringify(prevProps.filters) !== stringify(filters))
    ) {
      this.fetchRecord()
    }
  }

  componentWillUnmount() {
    this._unsubscribe = true
  }

  scrollToInitialPosition = () => {
    if (this.scrollableArea.current) {
      this.scrollableArea.current.scrollTop = 0
      this.scrollableArea.current.scrollLeft = 0
    }
  }

  getParams = () => {
    let { additionalParams, filters } = this.props
    let params: any = {
      ...additionalParams,
      filters
    }

    let { paginate, paginationOptions, sortedColumns } = this.state

    if (paginate) {
      params.paginate = true
      params.limit = paginationOptions.limit
      params.skip = ((paginationOptions.currentPage - 1) * paginationOptions.limit)
    }

    params.sort = sortedColumns

    return params
  }

  fetchRecord = () => {
    let { loadingHandler = noop, service } = this.props
    this.setState({ loading: true, progressing: true }, () => loadingHandler(true))
    service
      .get(this.getParams())
      .then((response: ServiceResponseProps) => {
        let { data, total } = response
        if (!this._unsubscribe) {
          this.setState({
            data: data.map((d, i) => ({ ...d, ___id: generateID(total), index: i })),
            total,
            selected: [],
            selectAll: false
          }, this.afterSelect)
          this.scrollToInitialPosition()
        }
      })
      .catch((err: any) => {
        console.error(err)
      })
      .finally(() => {
        if (!this._unsubscribe) {
          this.setState({ loading: false }, () => {
            loadingHandler(false)
            setTimeout(() => {
              this.setState({ progressing: false })
            }, 500)
          })
        }
      })
  }

  refreshTable = () => {
    this.fetchRecord()
  }

  afterSelect = () => {
    let { onSelect = noop } = this.props
    let { selected } = this.state
    onSelect(selected)
  }

  toggleRowSelect = (row: any, index: number) => {
    this.setState(prevState => {
      let { data = [], selected = [] } = prevState
      let nextData = [...data]
      nextData[index].selected = !nextData[index].selected
      let nextSelected = [...selected]
      if (!nextData[index].selected) {
        nextSelected = nextSelected.filter(s => s.___id !== row.___id)
      } else {
        nextSelected.push(row)
      }
      return {
        selectAll: nextData.length === nextSelected.length,
        data: [...nextData],
        selected: [...nextSelected]
      }
    }, this.afterSelect)
  }

  toggleSelectAll = () => {
    this.setState(prevState => {
      let { selectAll, data = [] } = prevState
      return {
        selectAll: !selectAll,
        selected: !selectAll ? [...data] : [],
        data: [...data].map(d => ({
          ...d,
          selected: !selectAll
        }))
      }
    }, this.afterSelect)
  }

  getSelectedState = () => {
    let selectedType = 'none'
    let { selected = [], selectAll } = this.state
    if (selectAll) {
      selectedType = 'all'
    } else if (selected.length) {
      selectedType = 'partial'
    }
    return selectedType
  }

  sortColumn = (column: ColumnProps) => {
    if (column.sortable) {
      this.setState((prevState: AsyncTableState) => {
        let { sortedColumns = [] } = prevState
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
        this.fetchRecord()
      })
    }
  }

  filteredColumns = () => {
    let { columns = [] } = this.props
    return [...columns].filter(column => !column.hidden)
  }

  gotoNextPage = (total: number) => {
    this.setState(state => ({
      paginationOptions: {
        ...state.paginationOptions,
        currentPage: getNextPage(state.paginationOptions, total)
      }
    }), () => {
      this.fetchRecord()
    })
  }

  gotoPreviousPage = () => {
    this.setState(state => ({
      paginationOptions: {
        ...state.paginationOptions,
        currentPage: getPreviousPage(state.paginationOptions)
      }
    }), () => {
      this.fetchRecord()
    })
  }

  setPaginationLimit = (limit: number) => {
    this.setState(state => ({
      paginationOptions: {
        ...state.paginationOptions,
        currentPage: 1,
        limit
      }
    }), () => {
      this.fetchRecord()
    })
  }

  toggleColumnSettings = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings
    }), () => {
      setTimeout(() => {
        let { showSettings } = this.state
        if (showSettings) {
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
      &&
      !this.columnSettings.contains(e.target)
    ) {
      this.toggleColumnSettings()
    }
  }

  render() {
    let {
      data: processedData = [],
      total = 0,
      loading = false,
      showSettings,
      paginationOptions,
      progressing,
      sortedColumns
    } = this.state
    let {
      headerHeight = DEFAULT_HEADER_HEIGHT,
      footerHeight = DEFAULT_FOOTER_HEIGHT,
      onColumnChange = noop,
      columns,
      showColumnSelection,
      paginate = false,
      emptyText,
      selectable = false,
      fixedWidth = false,
      variant = 'bordered',
      showProgress,
      id = new Date().getTime().toString()
    } = this.props

    let isEmpty = !loading && total === 0
    let tableStyle = getTableStyle(this.props)
    let filteredColumns = this.filteredColumns()

    return (
      <div className='ui-kit-table-container' style={tableStyle}>
        {
          showProgress && progressing && <ProgressBar loading={loading} />
        }
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
          paginationOptions={paginationOptions}
          paginate={paginate}
          itemsCount={total}
          height={footerHeight}
          setPaginationLimit={this.setPaginationLimit}
          gotoNextPage={this.gotoNextPage}
          gotoPreviousPage={this.gotoPreviousPage}
          refreshTable={this.fetchRecord}
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
          isEmpty ?
            <EmptyBox headerHeight={headerHeight} footerHeight={footerHeight} emptyText={emptyText} />
            :
            null
        }
      </div>
    )
  }
}

export default AsyncTable
