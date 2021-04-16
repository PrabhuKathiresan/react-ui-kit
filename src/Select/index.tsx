import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import isEmpty from 'is-empty'
import cx from 'classnames'
import {
  MAXIMUM_DROPDOWN_HEIGHT, UP, DOWN, ESC, RETURN, ANIMATION_TIMER,
  TAB, DROPDOWN_ITEM_HEIGHT, ACTUAL_VALUE, SELECT_HEIGHT, SELECT_WIDTH
} from './constants'
import InputWrapper from './InputWrapper'
import Menu from './Menu'
import {
  noop, getStateFromProps, constructMenuProps,
  getUpdatedActiveIndex, optionsMap, filterResultsFromOptions
} from './utils'
import { isEqual, debounce } from './helpers'
import ArrowUpDown from '../icons/arrow-up-down'
import { OptionProps, SelectProps, SelectState, ExtraInputProps, TransitionState } from './props'
import { MenuContainer } from './MenuContainer'

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

const getMenuHeight = (maxDropdownHeight: number, length: number, searchable: boolean) => Math.min(maxDropdownHeight, (length ? (length * DROPDOWN_ITEM_HEIGHT) + 15 : searchable ? DROPDOWN_ITEM_HEIGHT + 12 : DROPDOWN_ITEM_HEIGHT))

const getOffset = (el: HTMLDivElement) => {
  let rect = el.getBoundingClientRect().toJSON()
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return {
    ...rect,
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  }
}

const getActiveIndex = (options: Array<OptionProps>, selected: Array<OptionProps>, props: SelectProps) => {
  let { defaultFirstItemSelected, async, labelKey } = props
  if (isEmpty(selected)) {
    return defaultFirstItemSelected && options.length ? 0 : -1
  }
  if (async || props.multiple) {
    return defaultFirstItemSelected ? 0 : -1
  }
  let selectedOption = [...selected].shift() || {};
  let value = selectedOption[labelKey]
  return options.findIndex(option => option[labelKey] === value)
}

class Select extends PureComponent<SelectProps, SelectState> {
  _input: null | HTMLInputElement = null
  input: null | HTMLInputElement = null
  _dropdownScrollableArea: null | HTMLDivElement = null
  menu: null | HTMLDivElement = null
  containerRef = React.createRef<null | HTMLDivElement>()
  state = getStateFromProps(this.props)

  componentDidMount() {
    this._listenResizeEvent()
  }

  UNSAFE_componentWillReceiveProps(nextProps: SelectProps) {
    let { multiple, disabled, options = [], selected: nextSelected = [], defaultFirstItemSelected } = nextProps
    let selected = optionsMap([...nextSelected], nextProps)
    let nextOptions = optionsMap([...options], nextProps)
    let nextState: SelectState = {
      value: this.state.value,
      activeIndex: defaultFirstItemSelected ? 0 : -1
    }
    let { options: currentOptions, selected: currentSelected, value } = this.state
    let { multiple: currentMultiple, disabled: currentDisabled, labelKey } = this.props
    if (!isEqual(nextOptions, currentOptions)) {
      nextState.options = nextOptions
      let results = filterResultsFromOptions([...nextOptions], {
        ...nextProps,
        value,
        activeIndex: -1
      })
      nextState.results = [...results]
      nextState.activeIndex = getActiveIndex([...results], selected.length ? selected : [], nextProps)
      nextState.activeItem = nextState.activeIndex === -1 ? null : nextState.results[nextState.activeIndex]
    }

    if (multiple !== currentMultiple) {
      nextState.value = ''
      this.input = null
    }

    if (disabled !== currentDisabled) {
      multiple ? this._input = null : this.input = null
    }

    // If new selections are passed via props, treat as a controlled input.
    if (selected && !isEqual(selected, currentSelected)) {
      nextState.selected = [...selected]

      if (multiple) {
        nextState.results = filterResultsFromOptions([...nextOptions], {
          ...nextProps,
          value: '',
          activeIndex: -1
        })
        nextState.value = ''
        this.setState(nextState)
        return
      }
      nextState.value = selected.length ? selected[0][labelKey] : ''
    }

    // Truncate selections when in single-select mode.
    let newSelected = selected || currentSelected
    if (!multiple && newSelected.length > 1) {
      newSelected = newSelected.slice(0, 1)
      nextState.selected = [...newSelected]
      nextState.value = newSelected[0][labelKey]
    }

    this.setState(nextState)
  }

  componentDidUpdate(_prevProps: SelectProps, prevState: SelectState) {
    let { value, options } = this.state
    if (prevState.value !== value) {
      let { defaultFirstItemSelected } = this.props
      let results = filterResultsFromOptions([...options], {
        ...this.props,
        value,
        activeIndex: -1
      })
      let activeIndex = defaultFirstItemSelected ? 0 : -1
      let activeItem = defaultFirstItemSelected ? results[0] : null
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        results,
        activeItem,
        activeIndex
      }, () => {
        if (this._dropdownScrollableArea) {
          this._dropdownScrollableArea.scrollTop = 0
        }
      })
    }

    if (this.props.multiple, _prevProps.multiple) {

    }
  }

  componentWillUnmount() {
    this._revokeResizeListener()
  }

  // eslint-disable-next-line react/sort-comp
  _setInputRef = (input: HTMLInputElement) => {
    if (!this.input) {
      this.input = input
      this._setMenuPosition()
    }
  }

  _setBackgroundInputRef = (input: HTMLInputElement) => {
    this._input = input
  }

  _setDropdownScrollableArea = (dropdownScrollArea: HTMLDivElement) => {
    this._dropdownScrollableArea = dropdownScrollArea
  }

  _setMenuRef = (menu: HTMLDivElement) => {
    this.menu = menu
  }

  _checkMenuPosition = () => {
    let nextMenuPosition = this._getMenuPosition()
    let { menuPosition } = this.state
    if (!isEqual(nextMenuPosition, menuPosition)) {
      this._setMenuPosition(nextMenuPosition)
    }
  }

  _getMenuPosition = () => {
    if (!this.input) {
      return
    }
    let { maxDropdownHeight = MAXIMUM_DROPDOWN_HEIGHT, dropup, searchable = false } = this.props
    let { results } = this.state
    let menuHeight = getMenuHeight(maxDropdownHeight, results.length, searchable)
    let body = document.documentElement || document.body
    let position = getOffset(this.input)
    let bottom: string | number = 'auto'
    let top = position.y + position.height + 2
    let _dropup = false
    let offset = Math.max(body.scrollTop, (body.scrollHeight - window.innerHeight))
    let offsetHeight = body.scrollHeight - offset
    if (dropup || ((position.bottom + menuHeight) > offsetHeight)) {
      top = 'auto'
      bottom = offsetHeight - position.y + 2
      _dropup = true
    }
    return {
      top,
      bottom,
      left: position.left,
      width: position.width,
      dropup: _dropup
    }
  }

  _setMenuPosition = (menuPosition = this._getMenuPosition()) => {
    this.setState(prevState => ({
      ...prevState,
      menuPosition
    }))
  }

  _handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    let value = e.currentTarget.value
    let clearSelection = !this.props.multiple && this.state.selected.length
    this.setState((prevState) => {
      return {
        isDirty: true,
        selected: clearSelection ? [] : prevState.selected,
        value,
      }
    }, () => {
      let { onInputChange = noop, onChange } = this.props
      onInputChange(value, e)
      clearSelection && onChange([])
    })
  }

  _handleActiveIndexChange = (activeIndex: number) => {
    let { results = [] } = this.state;
    let activeItem = activeIndex === -1 ? null : results[activeIndex]
    this.setState({
      activeIndex,
      activeItem
    })
  }

  _handleKeyDown = (e: React.KeyboardEvent) => {
    let { activeItem } = this.state
    let { multiple, searchable } = this.props
    let input = multiple ? this._input : this.input

    // Skip most actions when the menu is hidden.
    if (!this._isMenuOpen()) {
      if (e.keyCode === UP || e.keyCode === DOWN) {
        this._openMenu()
      }

      return
    }

    switch (e.keyCode) {
      case UP:
      case DOWN:
        // Prevent input cursor from going to the beginning when pressing up.
        e.preventDefault()
        this._enableAutoScroll()
        this._handleActiveIndexChange(getUpdatedActiveIndex(
          this.state.activeIndex,
          e.keyCode,
          this.state.results
        ))
        break
      case RETURN:
        // Prevent form submission while menu is open.
        e.preventDefault()
        activeItem && this._onMenuClick(activeItem)
        break
      case ESC:
      case TAB:
        // ESC simply hides the menu. TAB will blur the input and move focus to
        // the next item hide the menu so it doesn't gain focus.
        searchable && input && input.focus()
        this._closeMenu()
        break
      default:
        break
    }
  }

  _onClick = (e: React.MouseEvent) => {
    e.persist()
    let { onInputClick = noop } = this.props

    if (this._hasFocus() && !this._isMenuOpen()) {
      this._openMenu()
    }

    onInputClick()
  }

  _onFocus = (e: React.FocusEvent) => {
    e.persist()
    if (!this._hasFocus()) {
      this._setFocus(true)
      this._openMenu()
    } else {
      !this._isMenuOpen() && this._openMenu()
    }
    let { onInputFocus = noop } = this.props;
    onInputFocus(e)
  }

  _onBlur = (e: React.FocusEvent) => {
    e.persist()
    this._hasFocus() && this._setFocus(false)
    let { onInputBlur = noop } = this.props
    onInputBlur(e)
  }

  _onMenuClick = (option: OptionProps) => {
    let {
      [ACTUAL_VALUE]: selected
    } = option
    if (this.props.multiple) {
      let prevSelected = [...this.state.selected].map(s => s[ACTUAL_VALUE])
      selected = [...prevSelected, selected]
    } else {
      selected = [selected]
    }
    this.props.onChange && this.props.onChange(selected)
    this._closeMenu()
  }

  _onRemoveSelected = (option: OptionProps) => {
    if (!this.props.multiple) return
    let { labelKey, onChange = noop } = this.props;
    let selected = [...this.state.selected].filter(s => s[labelKey] !== option[labelKey]).map(ms => ms[ACTUAL_VALUE])
    onChange(selected)
    this._isMenuOpen() && this._closeMenu()
  }

  _hasFocus = () => this.state.focus

  _isMenuOpen = () => this.state.open

  _setFocus = (focus: boolean) => {
    this.setState({
      focus
    })
  }

  _triggerOpen = () => {
    if (!this._isMenuOpen()) {
      this.input && this.input.focus()
      this._openMenu()
    } else {
      this.input && this.input.blur()
      this._closeMenu()
    }
  }

  _openMenu = () => {
    this._checkMenuPosition()
    this._enableAutoScroll()
    this.setState((prevState: SelectState) => {
      let nextState: SelectState = {
        value: prevState.value,
        open: true,
        activeIndex: -1
      }
      let { results = [], selected = [] } = prevState;
      if (!prevState.searchable) {
        nextState.activeIndex = getActiveIndex(results, selected.length ? selected : [], this.props)
      } else {
        nextState.activeIndex = this.props.defaultFirstItemSelected ? 0 : -1
      }
      nextState.activeItem = nextState.activeIndex === -1 ? null : results[nextState.activeIndex]
      return nextState
    }, () => {
      setTimeout(() => {
        this._listenClickEvent()
      }, 100)
    })
  }

  _closeMenu = () => {
    this._disableAutoScroll()
    this.setState({
      activeIndex: -1,
      activeItem: null,
      open: false,
      focus: false,
      isDirty: false,
    }, () => {
      setTimeout(() => {
        this._revokeClickListener()
        let input = this.props.multiple ? this._input : this.input
        input && input.blur()
      }, 100)
    })
  }

  _listenResizeEvent = () => window.addEventListener('resize', this._handleResize)

  _revokeResizeListener = () => window.removeEventListener('resize', this._handleResize)

  _listenClickEvent = () => {
    setTimeout(() => {
      if (this._isMenuOpen()) {
        document.addEventListener('click', this._handleOutsideClick, false)
        document.addEventListener('scroll', this._handlePageScroll, false)
      }
    }, 100)
  }

  _revokeClickListener = () => {
    document.removeEventListener('click', this._handleOutsideClick, false)
    document.removeEventListener('scroll', this._handlePageScroll, false)
  }

  _handleOutsideClick = (event: Event) => {
    if (
      this._isMenuOpen()
      && (this.menu && (event.target instanceof HTMLElement || event.target instanceof SVGElement) && !this.menu.contains(event.target))
      && this.props.closeOnOutsideClick
    ) {
      this._closeMenu()
    }
  }

  _handleResize = () => {
    this._recomputeMenuPostition()
  }

  _handlePageScroll = (e: Event) => {
    if (this.menu && (e.target instanceof HTMLElement || e.target instanceof HTMLDocument) && !this.menu.contains(e.target)) {
      this._closeMenu()
    }
  }

  // eslint-disable-next-line react/sort-comp
  _recomputeMenuPostition = debounce(() => {
    this._setMenuPosition()
  }, 500)

  _autoScrollEnabled = () => this.state.autoScroll

  _enableAutoScroll = () => {
    if (!this._autoScrollEnabled()) {
      this.setState({
        autoScroll: true
      })
    }
  }

  _disableAutoScroll = () => {
    if (this._autoScrollEnabled()) {
      this.setState({
        autoScroll: false
      })
    }
  }

  _menuContainer = () => {
    let {
      id,
      animate,
      transitionDuration = animate ? ANIMATION_TIMER : 0,
      searchable
    } = this.props

    let {
      menuPosition,
      open,
      value,
      id: internalId
    } = this.state

    id = id || internalId

    let mergedStateAndProps = {
      ...this.props,
      ...this.state,
    }

    return (
      <MenuContainer ref={this.containerRef} position={menuPosition}>
        <Transition
          appear
          in={open}
          mountOnEnter
          timeout={{
            appear: transitionDuration,
            enter: 0,
            exit: transitionDuration
          }}
          unmountOnExit
        >
          {(transitionState: TransitionState) => (
            <Menu
              {...constructMenuProps(mergedStateAndProps)}
              transitionState={transitionState}
              disableAutoScroll={this._disableAutoScroll}
              menuRef={this._setMenuRef}
              scrollableAreaRef={this._setDropdownScrollableArea}
              style={menuPosition}
              open={open}
              onMenuClick={this._onMenuClick}
              searchable={searchable || false}
              searchInputProps={{
                value,
                onChange: searchable ? this._handleInputChange : noop,
                onKeyDown: this._handleKeyDown
              }}
              transitionDuration={transitionDuration}
              id={id}
            />
          )}
        </Transition>
      </MenuContainer>
    )
  }

  render() {
    let {
      id,
      width = SELECT_WIDTH,
      height = SELECT_HEIGHT,
      disabled = false,
      inputProps,
      placeHolder,
      searchable,
      loading,
      icons = {},
      onMenuItemRender,
      multiple,
      labelKey,
      containerClass = '',
      allowClear = false,
      onChange,
      showRightIcon = true,
      label = '',
      labelClass = '',
      error = '',
      inputClass = '',
      container,
      required = false,
      textOnly = false
    } = this.props

    let {
      open,
      selected,
      id: internalId
    } = this.state

    id = id || internalId

    let rightIcon = {
      component: showRightIcon ? (isEmpty(icons.right) ? <ArrowUpDown width={14} height={14} /> : icons.right) : null,
      onClick: this._triggerOpen,
      additionalClasses: 'is-clickable'
    }

    let leftIcon = {
      component: icons.left ? icons.left : null
    }

    let containerStyle = multiple ? { minHeight: height, height: 'auto', width } : { height, width }

    let extraProps: ExtraInputProps = searchable ? {} : {
      onKeyDown: this._handleKeyDown,
      onClick: this._onFocus
    }

    let portalTarget = canUseDOM && container ? document.querySelector(container) : null

    if (multiple) extraProps.ref = this._setBackgroundInputRef

    let menuContainer = this._menuContainer()

    return (
      <>
        <div className={cx('ui-kit-input-block', containerClass, { 'has-error': error })}>
          {
            label && <label className={cx('ui-kit-input-label', labelClass, { 'is-required': required })} htmlFor={`${id}`}>{label}</label>
          }
          <div data-testid={`${id}-select`} className={cx('ui-kit-select', { 'ui-kit-select--multiple': multiple })} id={`${id}-select`} style={containerStyle}>
            <InputWrapper
              inputProps={inputProps}
              inputClass={inputClass}
              disabled={disabled}
              placeHolder={placeHolder ? placeHolder : (searchable ? 'Search...' : 'Select...')}
              onFocus={this._onFocus}
              inputRef={this._setInputRef}
              loading={loading}
              icons={{
                left: leftIcon,
                right: rightIcon
              }}
              multiple={multiple}
              selected={selected}
              labelKey={labelKey}
              onMenuItemRender={onMenuItemRender}
              onRemove={this._onRemoveSelected}
              open={open}
              extraProps={extraProps}
              id={id}
              allowClear={allowClear}
              onChange={onChange}
              textOnly={textOnly}
            />
            {
              portalTarget ?
                (
                  createPortal(
                    <>{menuContainer}</>,
                    portalTarget
                  )
                ) :
                (
                  <>{menuContainer}</>
                )
            }
          </div>
          {error && <span className='text-danger pt-2' data-testid={`${id}-input-error`}>{error}</span>}
        </div>
      </>
    )
  }
}

export default Select
