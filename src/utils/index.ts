import { CSSProperties } from 'react'
import createSorter from './create-sorter'
import { PaginationOption, TableProps, TableState } from '../DataTable/props'
import * as typeCheck from './type-check'

export const {
  isString,
  isObject,
  isFunction,
  isDefined,
  isUnDefined,
  isNumber
} = typeCheck 

export const noop = () => {
  // this is intentional
}

export const uniqueId = () => new Date().getTime()

export const isEqual = (val1: any, val2: any) => {
  let v1 = typeof val1 === 'object' ? JSON.stringify(val1) : val1
  let v2 = typeof val2 === 'object' ? JSON.stringify(val2) : val2
  return `${v1}` === `${v2}`
}

export const toLowerCase = (str: any) => String(str).toString().toLowerCase()

export const sortData = (data: any, sortedColumns: any) => data.sort(createSorter(...sortedColumns))

const getFilteredData = (filter: any, filterFunc: Function) => {
  let {
    value, accessor, useFilter, type,
  } = filter
  return (data: any) => {
    let accessData = typeof accessor === 'function' ? accessor(data) : data[accessor]
    if (typeof useFilter === 'function') {
      accessData = useFilter(data)
    }
    if (type === 'string') {
      accessData = toLowerCase(accessData)
      value = toLowerCase(value)
    }
    if (type === 'date') {
      accessData = new Date(accessData)
      value = new Date(value)
    }
    return filterFunc(accessData, value)
  }
}

export const filterData = (data: any, filters: any = []) => {
  let filteredData = [...data]

  filters.forEach((filter: any) => {
    let {
      condition, value
    } = filter
    let filterFunc: Function
    switch (condition) {
      case 'eq':
        filterFunc = (d: any, k: any) => d === k
        break
      case 'neq':
        filterFunc = (d: any, k: any) => d !== k
        break
      case 'contains':
        filterFunc = (d: any, k: any) => d.includes(k)
        break
      case 'gt':
        filterFunc = (d: any, k: any) => d > k
        break
      case 'gte':
        filterFunc = (d: any, k: any) => d >= k
        break
      case 'lt':
        filterFunc = (d: any, k: any) => d < k
        break
      case 'lte':
        filterFunc = (d: any, k: any) => d <= k
        break
      case 'startsWith':
        filterFunc = (d: any, k: any) => d.startsWith(k)
        break
      case 'endsWith':
        filterFunc = (d: any, k: any) => d.endsWith(k)
        break
      default:
        filterFunc = (d: any, k: any) => d === k
    }
    if (value) {
      filteredData = filteredData.filter(getFilteredData(filter, filterFunc))
    }
  })

  return filteredData
}

export const getProcessedData = (data: Array<any>, props: TableProps & TableState) => {
  let processedData = []
  let total = data.length
  let {
    sortedColumns = [],
    filters = [],
    async = false,
    selected = [],
    paginate
  } = props

  if (async) {
    return {
      total,
      data: [...data],
      allDataSelected: selected.length === data.length
    }
  }

  let sortedData = sortData([...data], [...sortedColumns])
  let filteredData = filterData(sortedData, [...filters])

  if (paginate) {
    let { paginationOptions, selectedPages } = props
    let { limit, currentPage } = paginationOptions
    let page = `${currentPage}::${limit}`
    let _selected = !!selectedPages[page]
    total = filteredData.length
    let start = (currentPage - 1) * limit
    let end = Math.min(currentPage * limit, total)
    processedData = filteredData.map((d) => ({
      ...d,
      selected: _selected || !!d.selected
    })).slice(start, end)
  } else {
    let { selectAll } = props
    processedData = filteredData.map((d) => ({
      ...d,
      selected: !!selectAll || !!d.selected
    }))
  }

  return {
    data: processedData,
    allDataSelected: selected.length === processedData.length,
    total
  }
}

export const getTableStyle = (props: TableProps) => {
  return {
    width: isString(props.width) ? props.width : `${props.width}px`,
    height: isString(props.height) ? props.height : `${props.height}px`,
  }
}

export const selectableColumn = () => ({
  selectColumn: true,
  selected: (row: any) => row.selected,
  width: 48
})

export const headerSelectColumn = () => ({
  selectColumn: true,
  width: 48
})

export const headerSelectionColumn = () => ({
  selectionColumn: true,
  width: 42
})

export const getNextPage = (options: PaginationOption, total: number) => {
  const lastPage = Math.ceil(total / options.limit)
  if (options.currentPage === lastPage) {
    return options.currentPage
  }
  return options.currentPage + 1
}

export const getPreviousPage = (options: PaginationOption) => {
  if (options.currentPage === 1) {
    return options.currentPage
  }
  return options.currentPage - 1
}

export const stringify = (json: any) => JSON.stringify(json)

export const parseJson = (jsonStr: any) => JSON.parse(jsonStr)

export const generateID = (t: number) => Math.floor(Math.random() * (t * 100000))

export const mapIndex = (arr: Array<any>) => arr.map((a, i) => ({ ...a, index: i }))

export function generateUEID() {
  let first: any = (Math.random() * 46656) | 0
  let second: any = (Math.random() * 46656) | 0
  first = ('000' + first.toString(36)).slice(-3)
  second = ('000' + second.toString(36)).slice(-3)
  return first + second
}

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const getPortalTarget = (container: any) => canUseDOM && Boolean(container) && document.querySelector(container)

export const getOffset = (el: HTMLDivElement | HTMLInputElement) => {
  let rect = el.getBoundingClientRect().toJSON()
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return {
    ...rect,
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  }
}

function getTranslate(placement: string) {
  const translateMap = {
    bottom: 'translate3d(0, 120%, 0)',
    top: 'translate3d(0, -120%, 0)',
  }

  return translateMap[placement]
}

const getTransformStyle = (placement: string) => ({
  entering: { transform: getTranslate(placement), opacity: 0 },
  entered: { transform: 'translate3d(0,0,0)', opacity: 1 },
  exiting: { transform: getTranslate(placement), opacity: 0 },
  exited: { transform: getTranslate(placement), opacity: 0 },
})

interface AnimationStyleProps {
  transitionDuration: number
  dropup: boolean
  transitionState: string
}

export const getMenuAnimationStyle = (options: AnimationStyleProps) => {
  let {
    transitionDuration,
    transitionState,
    dropup
  } = options
  return {
    transition: `transform, opacity`,
    transitionDuration: `${transitionDuration}ms, ${transitionDuration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.075, 0.82, 0.165, 1), cubic-bezier(0.075, 0.82, 0.165, 1)',
    ...getTransformStyle(dropup ? 'bottom' : 'top')[transitionState],
    boxShadow: ['entering', 'exiting'].includes(transitionState) ? 'rgba(18, 52, 77, 0.16) 0px 0px 4px 0px' : ''
  }
}

export const getDefaultStyle = (style: CSSProperties & { duration?: string | number }) => {
  let {
    duration = 300,
    transitionProperty = 'transform, opacity',
    transitionDuration = duration,
    transitionTimingFunction = 'linear',
    transformOrigin = 'top',
    ...extraDefaultStyle
  } = style
  return {
    defaultStyle: {
      transitionProperty,
      transitionDuration,
      transitionTimingFunction,
      transformOrigin,
      ...extraDefaultStyle
    }
  }
}

export const getHeightTransition = (height: number | string) => ({
  entering: {
    height,
    overflow: 'hidden'
  },
  entered: {
    height: 'auto',
    overflow: 'visible'
  },
  exiting: {
    height: 0,
    overflow: 'hidden'
  },
  exited: {
    height: 0,
    overflow: 'visible'
  }
})

