import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import cx from 'classnames'
import {
  MAXIMUM_DROPDOWN_HEIGHT, UP, DOWN, ESC, RETURN, ANIMATION_TIMER,
  TAB, ACTUAL_VALUE, SELECT_HEIGHT, SELECT_WIDTH,
  HEIGHT_MAP
} from './constants'
import InputWrapper from './InputWrapper'
import Menu from './Menu'
import { InputLabel } from '../TextInput'
import {
  getStateFromProps, constructMenuProps,
  getUpdatedActiveIndex, optionsMap, filterResultsFromOptions,
  getActiveIndex, getMenuHeight, getOffset
} from './utils'
import { isEqual, debounce } from './helpers'
import ArrowUpDown from '../icons/arrow-up-down'
import { OptionProps, SelectProps, SelectState, ExtraInputProps } from './props'
import MenuContainer from '../common/MenuContainer'
import { canUseDOM, noop } from '../utils'
import { TransitionState } from '../constants'

class BasicSelect extends PureComponent<SelectProps, SelectState> {
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
    const { options = [], selected: nextSelected = [], defaultFirstItemSelected } = nextProps
    const selected = optionsMap([...nextSelected], nextProps)
    const nextOptions = optionsMap([...options], nextProps)
    const activeIndex = this._getActiveIndex(selected, defaultFirstItemSelected)
    const nextState: SelectState = {
      value: this.state.value,
      activeIndex,
      id: this.state.id
    }
    const { options: currentOptions, value } = this.state
    if (!isEqual(nextOptions, currentOptions)) {
      nextState.options = nextOptions
      const results = filterResultsFromOptions([...nextOptions], {
        ...nextProps,
        id: this.state.id,
        value,
        activeIndex: -1
      })
      nextState.results = [...results]
      nextState.activeIndex = getActiveIndex([...results], selected.length ? selected : [], nextProps)
      nextState.activeItem = this._getActiveItem(nextState)
    }

    this._handlePropsChange(nextProps, nextState, nextOptions, selected)

    this.setState(nextState)
  }

  componentDidUpdate(_prevProps: SelectProps, prevState: SelectState) {
    const { value, options = [] } = this.state
    if (prevState.value !== value) {
      const { defaultFirstItemSelected } = this.props
      const results = filterResultsFromOptions([...options], {
        ...this.props,
        id: this.state.id,
        value,
        activeIndex: -1
      })
      const activeIndex = defaultFirstItemSelected ? 0 : -1
      const activeItem = defaultFirstItemSelected ? results[0] : null
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
  }

  componentWillUnmount() {
    this._revokeResizeListener()
  }

  _getActiveIndex = (selected: Array<any>, firstItemSelected?: boolean) => {
    if (selected.length) {
      const { results = [] } = this.state
      return getActiveIndex([...results], selected, this.props)
    }

    return firstItemSelected ? 0 : -1
  }

  _getActiveItem = (state = this.state) => {
    const {
      activeIndex,
      results = []
    } = state
    return activeIndex === -1 ? null : results[activeIndex]
  }

  _handlePropsChange = (nextProps: SelectProps, nextState: SelectState, nextOptions: Array<OptionProps>, selected: Array<OptionProps>) => {
    const {
      multiple,
      disabled,
      labelKey
    } = nextProps
    const {
      selected: currentSelected
    } = this.state
    if (multiple !== this.props.multiple) {
      nextState.value = ''
      this.input = null
    }

    if (disabled !== this.props.disabled) {
      if (multiple) this._input = null
      else this.input = null
    }

    // If new selections are passed via props, treat as a controlled input.
    if (selected && !isEqual(selected, currentSelected)) {
      nextState.selected = [...selected]

      if (multiple) {
        nextState.results = filterResultsFromOptions([...nextOptions], {
          ...nextProps,
          id: this.state.id,
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
  }

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
    typeof this.props.setMenuRef === 'function' && this.props.setMenuRef(this.containerRef.current)
  }

  _checkMenuPosition = () => {
    const nextMenuPosition = this._getMenuPosition()
    const { menuPosition } = this.state
    if (!isEqual(nextMenuPosition, menuPosition)) {
      this._setMenuPosition(nextMenuPosition)
    }
  }

  _getMenuPosition = () => {
    if (!this.input) {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        dropup: false
      }
    }
    const { maxDropdownHeight = MAXIMUM_DROPDOWN_HEIGHT, dropup, searchable = false } = this.props
    const { results = [] } = this.state
    const menuHeight = getMenuHeight(maxDropdownHeight, results.length, searchable)
    const body = document.documentElement || document.body
    const position = getOffset(this.input)
    let bottom: string | number = 'auto'
    let top = position.y + position.height + 2
    let _dropup = false
    const offset = Math.max(body.scrollTop, (body.scrollHeight - window.innerHeight))
    const offsetHeight = body.scrollHeight - offset
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
    const value = e.currentTarget.value
    const clearSelection = !this.props.multiple && this.state.selected?.length
    this.setState((prevState) => {
      return {
        isDirty: true,
        selected: clearSelection ? [] : prevState.selected,
        value,
      }
    }, () => {
      const { onInputChange = noop, onChange = noop } = this.props
      onInputChange(value, e)
      clearSelection && onChange([])
    })
  }

  _handleActiveIndexChange = (activeIndex: number) => {
    const { results = [] } = this.state;
    const activeItem = activeIndex === -1 ? null : results[activeIndex]
    this.setState({
      activeIndex,
      activeItem
    })
  }

  _handleKeyDown = (e: React.KeyboardEvent) => {
    const { activeItem } = this.state
    const { multiple, searchable } = this.props
    const input = multiple ? this._input : this.input

    // Skip most actions when the menu is hidden.
    if (!this._isMenuOpen()) {
      if (e.key === UP || e.key === DOWN) {
        this._openMenu()
      }

      return
    }

    switch (e.key) {
      case UP:
      case DOWN:
        // Prevent input cursor from going to the beginning when pressing up.
        e.preventDefault()
        this._enableAutoScroll()
        this._handleActiveIndexChange(getUpdatedActiveIndex(
          this.state.activeIndex,
          e.key,
          this.state.results || []
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

  _onFocus = (e: React.FocusEvent) => {
    e.persist()
    if (!this._hasFocus()) {
      this._setFocus(true)
      this._openMenu()
    } else {
      !this._isMenuOpen() ? this._openMenu() : this._closeMenu()
    }
    const { onInputFocus = noop } = this.props;
    onInputFocus(e)
  }

  _onBlur = (e: React.FocusEvent) => {
    e.persist()
    this._hasFocus() && this._setFocus(false)
    const { onInputBlur = noop } = this.props
    onInputBlur(e)
  }

  _onMenuClick = (option: OptionProps) => {
    let {
      [ACTUAL_VALUE]: selected
    } = option
    if (this.props.multiple) {
      const prevSelected = [...(this.state.selected || [])].map(s => s[ACTUAL_VALUE])
      selected = [...prevSelected, selected]
    } else {
      selected = [selected]
    }
    this.props.onChange && this.props.onChange(selected)
    this._closeMenu()
  }

  _onRemoveSelected = (option: OptionProps) => {
    if (!this.props.multiple) return
    const { labelKey, onChange = noop } = this.props;
    const selected = [...(this.state.selected || [])].filter(s => s[labelKey] !== option[labelKey]).map(ms => ms[ACTUAL_VALUE])
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
      const nextState: SelectState = {
        id: prevState.id,
        value: prevState.value,
        open: true,
        activeIndex: -1
      }
      const { results = [], selected = [] } = prevState;
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
      this.props.onOpen && this.props.onOpen()
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
      const {
        multiple,
        onClose = noop
      } = this.props
      setTimeout(() => {
        this._revokeClickListener()
        const input = multiple ? this._input : this.input
        input && input.blur()
      }, 100)
      onClose()
    })
  }

  _listenResizeEvent = () => window.addEventListener('resize', this._handleResize)

  _revokeResizeListener = () => window.removeEventListener('resize', this._handleResize)

  _listenClickEvent = () => {
    setTimeout(() => {
      if (this._isMenuOpen()) {
        document.addEventListener('click', this._handleOutsideClick, false)
        document.addEventListener('scroll', this._handlePageScroll, true)
      }
    }, 100)
  }

  _revokeClickListener = () => {
    document.removeEventListener('click', this._handleOutsideClick, false)
    document.removeEventListener('scroll', this._handlePageScroll, true)
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
    const {
      animate = true,
      transitionDuration = animate ? ANIMATION_TIMER : 0,
      searchable
    } = this.props

    const {
      menuPosition,
      open,
      value,
      id
    } = this.state

    const mergedStateAndProps = {
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
              style={menuPosition || {}}
              open={open || false}
              closeMenu={this._closeMenu}
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

  _getRightIcon = () => {
    const {
      showRightIcon = true,
      icons
    } = this.props
    let component = null
    if (showRightIcon) {
      component = icons?.right || <ArrowUpDown width={12} height={12} />
    }
    return {
      component,
      onClick: this._triggerOpen,
      additionalClasses: 'is-clickable'
    }
  }

  _getLeftIcon = () => ({
    component: this.props.icons?.left || null
  })

  _getContainerStyle = () => {
    const {
      multiple,
      height,
      inputSize = 'default',
      borderless,
      textOnly
    } = this.props
    let { width = SELECT_WIDTH } = this.props
    if (borderless && textOnly && this.input) {
      width = 'max-content'
    }
    return multiple ? { minHeight: height, height: 'auto', width } : { height: height || HEIGHT_MAP[inputSize] || SELECT_HEIGHT, width }
  }

  _getExtraProps = () => {
    const {
      searchable,
      multiple
    } = this.props
    const extraProps: ExtraInputProps = searchable ? {} : { onKeyDown: this._handleKeyDown }
    if (multiple) extraProps.ref = this._setBackgroundInputRef

    return extraProps;
  }

  _getPortalTarget = () => {
    const {
      container
    } = this.props
    return canUseDOM && container ? document.querySelector(container) : null
  }

  render() {
    const {
      disabled = false,
      inputProps,
      placeholder,
      loading,
      onMenuItemRender,
      multiple,
      labelKey,
      containerClass = '',
      allowClear = false,
      onChange,
      error = '',
      message = '',
      inputClass = '',
      textOnly = false,
      inputSize = 'default',
      borderless = false,
      width = SELECT_WIDTH
    } = this.props

    const {
      open,
      selected,
      id
    } = this.state

    const rightIcon = this._getRightIcon()
    const leftIcon = this._getLeftIcon()
    const containerStyle = this._getContainerStyle()
    const extraProps = this._getExtraProps()
    const portalTarget = this._getPortalTarget()
    const menuContainer = this._menuContainer()

    return (
      <>
        <div className={cx('ui-kit-input-block', containerClass, { 'has-error': error })}>
          <InputLabel {...this.props} />
          <div data-testid={`${id}-select`} className={cx('ui-kit-select', { 'ui-kit-select--multiple': multiple })} id={`${id}-select`} style={containerStyle}>
            <InputWrapper
              inputProps={inputProps}
              inputClass={inputClass}
              disabled={disabled}
              placeholder={placeholder}
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
              inputSize={inputSize}
              borderless={borderless}
              width={width}
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
          {message && <span className='pt-4 element-flex' data-testid={`${id}-input-message`}>{message}</span>}
          {error && <span className='text--danger pt-4 element-flex' data-testid={`${id}-input-error`}>{error}</span>}
        </div>
      </>
    )
  }
}

export default BasicSelect
