import React, { Component } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import TextInput from '../TextInput'
import MenuContainer from '../common/MenuContainer'
import DatePickerElement from './DatePickerElement'
import DateIcon from '../icons/date-icon'
import { DatePickerProps, DatePickerState } from './props'
import { TransitionState } from '../constants'
import { canUseDOM, getOffset, noop } from '../utils'
import { endOf, startOf } from './utils'

const PICKER_HEIGHT = 380
const TRANSITION_DURATION = 300
const DEFAULT_PICKER_POSITION = {
  top: 'auto',
  bottom: 'auto',
  left: 'auto',
  width: '100%',
  dropup: false
}
const methodMap: any = {
  month: 'changeMonth',
  year: 'changeYear',
  date: 'changeDate',
  setDate: 'onDateClick'
}
const oneDay = 60 * 60 * 24 * 1000
const todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60)

export default class Datepicker extends Component<DatePickerProps, DatePickerState> {
  containerRef = React.createRef<null | HTMLDivElement>()
  menuRef = React.createRef<null | HTMLDivElement>()
  inputContainer = React.createRef<null | HTMLDivElement>()
  inputRef = React.createRef<null | HTMLInputElement>()
  iconRef = React.createRef<null | HTMLSpanElement>()
  monthMenuRef: any = null
  yearMenuRef: any = null
  daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  stopPropagation: boolean = false

  constructor(props: DatePickerProps) {
    super(props)
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let startDate = new Date((date.getFullYear() - 10), 0, 1)
    let endDate = new Date((date.getFullYear() + 10), 11, 31)
    if (props.min) startDate = props.min
    if (props.max) endDate = props.max
    let value = props.value instanceof Date ? props.value.getTime() : ''
    let defaultValue = props.defaultValue instanceof Date ? props.defaultValue.getTime() : ''
    let selectedDay = value || defaultValue
    if (props.value && !props.onChange) {
      console.warn('[Datepicker]: uncontrolled input')
    }
    this.state = {
      open: false,
      pickerPosition: DEFAULT_PICKER_POSITION,
      selectedDay,
      year,
      month,
      monthDetails: this.getMonthDetails(year, month),
      startDate,
      endDate,
      focus: false,
      stopPropagation: false
    }
  }

  componentDidMount() {
    this.setDateToInput(this.state.selectedDay)
  }

  componentDidUpdate() {
    if (this.props.value) {
      let nextSelectedDay = this.props.value.getTime()

      if (nextSelectedDay !== this.state.selectedDay) {
        this.setState({ selectedDay: nextSelectedDay }, this.setDateFromTimestamp)
        this.setDateToInput(nextSelectedDay)
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.addBackDrop, false)
  }

  addListener = () => {
    window.addEventListener('click', this.addBackDrop, false)
    window.addEventListener('resize', this.handleResize, false)
    let { closeOnScroll = true } = this.props
    closeOnScroll && window.addEventListener('scroll', this.handleScroll, false)
  }

  removeListener = () => {
    window.removeEventListener('click', this.addBackDrop, false)
    window.removeEventListener('resize', this.handleResize, false)
    let { closeOnScroll = true } = this.props
    closeOnScroll && window.removeEventListener('scroll', this.handleScroll, false)
  }

  handleResize = () => {
    this.datePickerOpen() && this.setPickerPosition()
  }

  addBackDrop = (e: Event) => {
    if (!this.stopPropagation && (this.datePickerOpen() && (e.target instanceof Element || e.target instanceof Document))) {
      if (
        this.inputRef.current?.contains(e.target) ||
        (!this.containerRef.current?.contains(e.target) &&
        !this.monthMenuRef?.contains(e.target) &&
        !this.yearMenuRef?.contains(e.target) &&
        !this.iconRef.current?.contains(e.target))
      ) {
        this.closeDatePicker()
      }
    }
    this.stopPropagation = false
  }

  handleScroll = (e: Event) => {
    if (
      this.datePickerOpen() && this.hasFocus() &&
      (e.target instanceof HTMLElement || e.target instanceof Document) &&
      !this.monthMenuRef?.contains(e.target) &&
      !this.yearMenuRef?.contains(e.target)
    ) {
      this.closeDatePicker()
    }
  }

  onFocus = () => {
    if (!this.hasFocus()) this.datePickerOpen() ? this.closeDatePicker() : this.openDatePicker()
  }

  onClick = () => {
    if (this.hasFocus()) {
      this.stopPropagation = true
      this.closeDatePicker()
    }
  }

  triggerOpen = () => {
    if (this.datePickerOpen()) {
      this.closeDatePicker()
    } else {
      this.stopPropagation = true
      this.inputRef.current?.focus()
    }
  }

  datePickerOpen = () => this.state.open
  hasFocus = () => this.state.focus

  closeDatePicker = () => this.setState({ open: false }, () => {
    this.removeListener()
    setTimeout(() => {
      this.stopPropagation = false
      this.setState({ focus: false }, () => this.inputRef.current?.blur())
    }, 100)
  })

  openDatePicker = () => {
    this.setPickerPosition()
    this.setDateFromTimestamp()
    this.setState({ open: true }, () => {
      setTimeout(() => {
        this.addListener()
        this.stopPropagation = false
        this.setState({ focus: true })
      }, 200)
    })
  }

  setPickerPosition = () => {
    let pickerPosition: any = DEFAULT_PICKER_POSITION;
    if (this.inputRef.current) {
      let { dropup } = this.props
      let _dropup = false
      let input = this.inputRef.current
      let body = document.documentElement || document.body
      let position = getOffset(input)
      let offset = Math.max(body.scrollTop, (body.scrollHeight - window.innerHeight))
      let offsetHeight = body.scrollHeight - offset
        let bottom: string | number = 'auto'
        let top = position.y + position.height + 2
        if (dropup || ((position.bottom + PICKER_HEIGHT) > offsetHeight)) {
          top = 'auto'
          bottom = offsetHeight - position.y + 2
          _dropup = true
        }
        pickerPosition = {
          top,
          bottom,
          left: position.left,
          width: position.width,
          dropup: _dropup
        }
    }
    this.setState({ pickerPosition })
  }

  setDateFromTimestamp = () => {
    let { selectedDay } = this.state
    if (!selectedDay) return;
    let date = new Date(selectedDay)
    let month = date.getMonth()
    let year = date.getFullYear()
    this.setState({
      month,
      year,
      monthDetails: this.getMonthDetails(year, month)
    })
  }

  // helpers
  timeStampToDate = (timestamp: any) => {
    return dayjs(timestamp).startOf('day').toDate();
  }

  getDayDetails = (args: any) => {
    let date = args.index - args.firstDay
    let day = args.index % 7
    let prevMonth = args.month - 1
    let prevYear = args.year
    if (prevMonth < 0) {
      prevMonth = 11
      prevYear--
    }
    let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth)
    let _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1
    let _monthIndex = (date > 0 && date >= args.numberOfDays) ? 1 : 0
    let monthIndex = (date < 0 ? -1 : _monthIndex)
    let month = args.month + monthIndex
    let timestamp = new Date(args.year, month, _date).getTime()
    return {
      date: _date,
      day,
      month,
      monthIndex,
      timestamp,
      dayString: this.daysMap[day]
    }
  }

  getNumberOfDays = (year: number, month: number) => {
    return 40 - new Date(year, month, 40).getDate()
  }

  getMonthDetails = (year: number, month: number) => {
    let firstDay = (new Date(year, month)).getDay()
    let numberOfDays = this.getNumberOfDays(year, month)
    let monthArray = []
    let rows = 6
    let currentDay = null
    let index = 0
    let cols = 7

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month
        })
        monthArray.push(currentDay)
        index++
      }
    }
    return monthArray
  }

  isCurrentDay = (day: any) => {
    return day.timestamp === todayTimestamp
  }

  isSelectedDay = (day: any) => {
    return day.timestamp === this.state.selectedDay
  }

  getMonthStr = (month: number) => this.monthMap[Math.max(Math.min(11, month), 0)] || 'Month'

  getDateStringFromTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    let dateObject = new Date(timestamp)
    let month = dateObject.getMonth() + 1
    let date = dateObject.getDate()
    return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
  }

  setDateToInput = (timestamp: any) => {
    if (this.inputRef.current) {
      let dateString = this.getDateStringFromTimestamp(timestamp)
      this.inputRef.current.value = dateString
    }
  }

  onDateClick = (day: any) => {
    this.setState({ selectedDay: day.timestamp }, () => this.setDateToInput(day.timestamp))
    let { onChange = noop, closeOnSelect = true } = this.props
    onChange(this.timeStampToDate(day.timestamp))
    closeOnSelect && this.closeDatePicker()
  }

  setYear = (offset: number = 0) => {
    let date = new Date()
    let {
      year = date.getFullYear(),
      month = date.getMonth(),
      startDate,
      endDate
    } = this.state
    year = year + offset
    let startYear = startDate.getFullYear()
    let endYear = endDate.getFullYear()
    let startMonth = startDate.getMonth()
    let endMonth = endDate.getMonth()
    if (startYear === year) month = startMonth < month ? month : startMonth
    else if (endYear === year) month = endMonth > month ? month : endMonth
    this.setState({
      year,
      month,
      monthDetails: this.getMonthDetails(year, month)
    })
  }

  setMonth = (offset: number = 0) => {
    let date = new Date()
    let {
      year = date.getFullYear(),
      month = date.getMonth(),
      startDate,
      endDate
    } = this.state
    month = month + offset
    if (month === -1) {
      month = 11
      year--
    } else if (month === 12) {
      month = 0
      year++
    }
    let startYear = startDate.getFullYear()
    let endYear = endDate.getFullYear()
    let startMonth = startDate.getMonth()
    let endMonth = endDate.getMonth()
    if (startYear === year) month = startMonth < month ? month : startMonth
    else if (endYear === year) month = endMonth > month ? month : endMonth
    this.setState({
      year,
      month,
      monthDetails: this.getMonthDetails(year, month)
    })
  }
  // helpers end

  handleChange = (params: any) => {
    let { changeType } = params
    let method = this[methodMap[changeType]]

    if (method) method(params)
  }

  changeMonth = ({ month, offset }: any) => {
    if (offset !== undefined) {
      return this.setMonth(offset)
    }
    return this.setState({ month }, this.setMonth)
  }

  changeYear = ({ year, offset }: any) => {
    if (offset !== undefined) {
      return this.setYear(offset)
    }
    return this.setState({ year }, this.setYear)
  }

  changeDate = ({ year, month }: any) => {
    if (year) this.setState({ year }, this.setYear)
    else if (month) this.setState({ month }, this.setMonth)
  }

  disabledDate = (timestamp: any) => {
    let date = new Date(timestamp)
    let { startDate, endDate } = this.state

    return startOf(startDate, 'day') > date || endOf(endDate, 'day') < date
  }

  renderDays = () => this.state.monthDetails.map((day: any, index: number) => {
    let disabled = this.disabledDate(day.timestamp)
    return (
      <div
        className={
          cx('ui-kit-datepicker__day-container', {
            'disabled-day': day.monthIndex !== 0,
            disabled,
            'disabled-other-month-day': disabled && day.monthIndex !== 0,
            'ui-kit-datepicker__highlight': this.isCurrentDay(day),
            'ui-kit-datepicker__highlight-primary': this.isSelectedDay(day)
          })
        }
        key={index}
      >
        <div className='ui-kit-datepicker__day' role='button' onClick={() => disabled ? noop : this.onDateClick(day)}>
          <span>{day.date}</span>
        </div>
      </div>
    )
  })

  renderCalendar = () => {
    let date = new Date()
    let {
      pickerPosition,
      open,
      month = date.getMonth(),
      year = date.getFullYear(),
      startDate,
      endDate
    } = this.state
    let {
      animate = true,
      transitionDuration = animate ? TRANSITION_DURATION : 0,
    } = this.props

    return (
      <MenuContainer ref={this.containerRef} position={pickerPosition}>
        <Transition
          appear
          mountOnEnter
          in={open}
          timeout={{
            appear: transitionDuration,
            enter: 0,
            exit: transitionDuration
          }}
          unmountOnExit
        >
          {
            (transitionState: TransitionState) => (
              <DatePickerElement
                transitionState={transitionState}
                transitionDuration={transitionDuration}
                position={pickerPosition}
                days={this.renderDays()}
                month={month}
                year={year}
                startDate={startDate}
                endDate={endDate}
                monthMenuRef={(ref: any) => this.monthMenuRef = ref}
                yearMenuRef={(ref: any) => this.yearMenuRef = ref}
                onChange={this.handleChange}
                ref={this.menuRef}
              />
            )
          }
        </Transition>
      </MenuContainer>
    )
  }

  render() {
    let {
      id,
      disabled,
      placeholder,
      container,
      label = null,
      className = '',
      message,
      error,
      labelClass,
      hint,
      hintPosition
    } = this.props

    let portalTarget = canUseDOM && container ? document.querySelector(container) : null

    return (
      <div className={cx('ui-kit-datepicker', className)}>
        <TextInput
          id={id}
          label={label}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={this.onFocus}
          onClick={this.onClick}
          ref={this.inputRef}
          readOnly
          icon={{
            right: (
              <span className={cx('element-flex-center w-100 h-100', { 'is-clickable': !disabled })} tabIndex={-1} ref={this.iconRef  as React.RefObject<HTMLSpanElement>}>
                <DateIcon className='text--muted' />
              </span>
            )
          }}
          containerRef={this.inputContainer}
          message={message}
          error={error}
          labelClass={labelClass}
          hint={hint}
          hintPosition={hintPosition}
          onRightIconClick={this.triggerOpen}
          className={cx({ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled })}
        />
        {
          portalTarget ?
            (
              createPortal(
                <>{this.renderCalendar()}</>,
                portalTarget
              )
            ) :
            (
              <>{this.renderCalendar()}</>
            )
        }
      </div>
    )
  }
}
