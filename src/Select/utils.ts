import isEmpty from 'is-empty'
import {
  defaultFilterBy,
} from './helpers'
import {
  MAXIMUM_DROPDOWN_HEIGHT,
  UP,
  ACTUAL_VALUE,
  DROPDOWN_ITEM_HEIGHT
} from './constants'
import {
  OptionProps,
  SelectProps,
  SelectState
} from './props'
import { generateUEID, noop } from '../utils'

export const getLabelKey = (labelKey: Function) => labelKey()

export const getInputValue = (option: OptionProps = {}) => option.__label

export const filterResultsFromOptions = (options: Array<OptionProps>, props: any): Array<OptionProps> => {
  let {
    filterBy = [],
    searchable = false,
    multiple = false,
  } = props
  let results = [...options]
  if (!searchable && !multiple) return results
  if (searchable || multiple) {
    let filter = Array.isArray(filterBy) ? defaultFilterBy : (filterBy || noop) 
    results = options.filter(option => filter(option, props))
  }
  return results
}

export const getStateFromProps = (props: SelectProps): SelectState => {
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

  let stateSelected = optionsMap([...selected], props)

  if (!multiple && stateSelected && stateSelected.length) {
    let [first] = selected
    value = first[labelKey]
  }

  let _options = optionsMap([...options], props)

  let results = filterResultsFromOptions(_options, {
    ...props,
    id,
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
    selected: stateSelected,
    menuPosition: {},
    autoScroll: false,
    isDirty: false,
    searchable,
    dropdownState: 'idle',
    id
  }
}

export const constructMenuProps = (props: any) => {
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
    dropdownState: props.dropdownState || '',
    minDropdownWidth: props.minDropdownWidth
  }
}

export const optionsMap = (options: Array<OptionProps | string>, props: SelectProps): Array<OptionProps> => {
  let { labelKey, customMenuItemRender } = props
  return options.map(option => {
    if (typeof option === 'string') {
      return {
        [labelKey]: option,
        __label: customMenuItemRender ? customMenuItemRender(option) : option,
        [ACTUAL_VALUE]: option
      }
    } else {
      return {
        ...option,
        [labelKey]: option[labelKey],
        __label: customMenuItemRender ? customMenuItemRender(option) : option[labelKey],
        [ACTUAL_VALUE]: {
          ...option
        }
      }
    }
  })
}

function skipDisabledOptions(
  currentIndex: number,
  keyCode: string,
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
  keyCode: string,
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

export const getMenuHeight = (maxDropdownHeight: number, length: number, searchable: boolean) => {
  let height = DROPDOWN_ITEM_HEIGHT
  if (length) {
    height = (length * DROPDOWN_ITEM_HEIGHT) + 15
  } else if (searchable) {
    height = DROPDOWN_ITEM_HEIGHT + 12
  }
  return Math.min(maxDropdownHeight, height)
}

export const getOffset = (el: HTMLDivElement) => {
  let rect = el.getBoundingClientRect().toJSON()
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return {
    ...rect,
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  }
}

export const getActiveIndex = (options: Array<OptionProps | string>, selected: Array<OptionProps | string>, props: SelectProps) => {
  let { defaultFirstItemSelected, async, labelKey } = props
  if (isEmpty(selected)) {
    return defaultFirstItemSelected && options.length ? 0 : -1
  }
  if (async || props.multiple) {
    return defaultFirstItemSelected ? 0 : -1
  }
  let selectedOption = [...selected].shift() || {}
  let value = selectedOption[labelKey]
  return options.findIndex(option => option[labelKey] === value)
}
