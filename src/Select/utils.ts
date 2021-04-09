import {
  defaultFilterBy
} from './helpers'
import {
  MAXIMUM_DROPDOWN_HEIGHT,
  UP,
  ACTUAL_VALUE
} from './constants'
import {
  OptionProps,
  SelectProps,
  SelectState
} from './props'
import { generateUEID } from '../utils'

export const noop = () => { }

export const getLabelKey = (labelKey: Function) => labelKey()

export const getInputValue = (option: OptionProps = {}) => option.__label

export const filterResultsFromOptions = (options: Array<OptionProps>, props: SelectProps & SelectState) => {
  let {
    filterBy = [],
    searchable = false,
    multiple = false,
  } = props;
  let results = [...options]
  if (!searchable && !multiple) return results
  if (searchable || multiple) {
    let filter = Array.isArray(filterBy) ? defaultFilterBy : (filterBy || noop) 
    results = options.filter(option => filter(option, props))
  }
  return results
}

export const getStateFromProps = (props: SelectProps) => {
  let {
    options = [],
    selected = [],
    multiple,
    defaultFirstItemSelected,
    searchable = false,
    labelKey,
    id = generateUEID()
  } = props

  let value = ''

  selected = optionsMap([...selected], props)

  if (!multiple && selected && selected.length) {
    let _selected = [...selected].shift() || {}
    value = _selected[labelKey]
  }

  let _options = optionsMap([...options], props)

  let results = filterResultsFromOptions(_options, {
    ...props,
    results: [],
    value,
    activeIndex: -1
  })

  return {
    activeIndex: defaultFirstItemSelected ? 0 : -1,
    activeItem: defaultFirstItemSelected ? results[0] : null,
    options: _options,
    open: props.defaultOpen || false,
    focus: props.autoFocus || false,
    value,
    results,
    selected,
    menuPosition: {},
    autoScroll: false,
    isDirty: false,
    searchable,
    dropdownState: 'idle',
    id
  }
}

export const constructMenuProps = (props: SelectProps & SelectState) => {
  let options = props.results ? [...props.results] : []
  return {
    options,
    labelKey: props.labelKey,
    maxHeight: MAXIMUM_DROPDOWN_HEIGHT,
    selected: props.selected || [],
    activeIndex: props.activeIndex,
    isDirty: props.isDirty || false,
    autoScroll: props.autoScroll || false,
    loading: props.loading || false,
    animate: props.animate || false,
    dropdownState: props.dropdownState || ''
  }
}

export const optionsMap = (options: Array<OptionProps>, props: SelectProps) => {
  let { labelKey, onMenuItemRender } = props
  return options.map(option => {
    return {
      ...option,
      [labelKey]: option[labelKey],
      __label: onMenuItemRender ? onMenuItemRender(option) : option[labelKey],
      [ACTUAL_VALUE]: {
        ...option
      }
    }
  })
}

function skipDisabledOptions(
  currentIndex: number,
  keyCode: number,
  items: Array<OptionProps>
){
  let newIndex = currentIndex

  while (items[newIndex] && items[newIndex].disabled) {
    newIndex += keyCode === UP ? -1 : 1
  }

  return newIndex
}

export function getUpdatedActiveIndex(
  currentIndex: number,
  keyCode: number,
  items: Array<OptionProps>
) {
  let newIndex = currentIndex

  // Increment or decrement index based on user keystroke.
  newIndex += keyCode === UP ? -1 : 1

  // Skip over any disabled options.
  newIndex = skipDisabledOptions(newIndex, keyCode, items)

  // If we've reached the end, go back to the beginning or vice-versa.
  if (newIndex === items.length) {
    newIndex = -1
  } else if (newIndex === -2) {
    newIndex = items.length - 1

    // Skip over any disabled options.
    newIndex = skipDisabledOptions(newIndex, keyCode, items)
  }

  return newIndex
}

// export function debounce(callback, interval) {
//   let debounceTimeoutId

//   return function (...args) {
//     clearTimeout(debounceTimeoutId)
//     debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval)
//   }
// }
