/**
 * Common (non-printable) keycodes for `keydown` and `keyup` events. Note that
 * `keypress` handles things differently and may not return the same values.
 */

export const BACKSPACE = 'Backspace'
export const TAB = 'Tab'
export const RETURN = 'Enter'
export const ESC = 'Escape'
export const SPACE = ' '
export const LEFT = 'ArrowLeft'
export const UP = 'ArrowUp'
export const RIGHT = 'ArrowRight'
export const DOWN = 'ArrowDown'

export const DEFAULT_LABELKEY = 'label'
export const ACTUAL_VALUE = 'actual_value'
export const MAXIMUM_DROPDOWN_HEIGHT = 200
export const MINIMUM_DROPDOWN_WIDTH = 100
export const SELECT_HEIGHT = 32
export const SELECT_WIDTH = '100%'
export const DROPDOWN_ITEM_HEIGHT = 30

export const HEIGHT_MAP = {
  small: 28,
  default: 32,
  large: 36
}

export const OPTIONS_PROPS = ['items', 'selected', 'activeIndex', 'open', 'autoScroll', 'isDirty']

export const ACTIVE_INDEX_PROPS = ['labelKey', 'multiple', 'defaultFirstItemSelected', 'async']

export const ANIMATION_TIMER = 220
