import { ACTUAL_VALUE } from './constants'
import { OptionProps, SelectProps, SelectState } from './props'

export const isString = (value: any) => typeof value === 'string'

export const isNumber = (value: any) => typeof value === 'number'

export const isObject = (value: any) => typeof value === 'object'

export const isFunction = (value: any) => typeof value === 'function'

export const stringify = (value: object) => JSON.stringify(value)

export const isEqual = (obj1: object = {}, obj2: object = {}) => stringify(obj1) === stringify(obj2)

function isMatch(input: string, string: string, props: SelectProps) {
  let searchStr = input
  let str = string

  if (!props.caseSensitive) {
    searchStr = searchStr.toLowerCase()
    str = str.toLowerCase()
  }

  return str.indexOf(searchStr) !== -1
}


/**
 * Default algorithm for filtering results.
 */
export function defaultFilterBy(option: OptionProps, props: SelectProps & SelectState) {
  let { filterBy = [], labelKey, multiple, selected = [], value, onMenuItemRender } = props

  // Don't show selected options in the menu for the multi-select case.
  if (multiple && selected.some((o: OptionProps) => isEqual(o, option[ACTUAL_VALUE]))) {
    return false
  }

  let fields = Array.isArray(filterBy) ? filterBy.slice() : []

  if (onMenuItemRender && isFunction(onMenuItemRender) && isMatch(value, onMenuItemRender(option), props)) {
    return true
  }

  if (isMatch(value, option[labelKey], props)) {
    return true
  }

  return fields.some(field => {
    let text = option[field]

    if (!isString(text)) {
      // Coerce to string since `toString` isn't null-safe.
      text = `${text}`
    }

    return isMatch(value, text, props)
  })
}

export function debounce(callback: Function, interval: number) {
  let debounceTimeoutId: any

  return function (...args: any) {
    clearTimeout(debounceTimeoutId)
    debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval)
  }
}
