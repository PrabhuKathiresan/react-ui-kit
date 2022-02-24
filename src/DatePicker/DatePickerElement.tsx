import React, { forwardRef, useState } from 'react'
import cx from 'classnames'
import { DatePickerElementProps } from './props'
import DatePickerHeader from './DatePickerHeader'
import DatePickerFooter from './DatePickerFooter'
import { getMenuAnimationStyle } from '../utils'

const DAYS_MINI = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function DatePickerElement(props: DatePickerElementProps, ref: any) {
  let {
    transitionState,
    transitionDuration = 0,
    position = {},
    days,
    month,
    year,
    startDate,
    endDate,
    monthMenuRef,
    yearMenuRef,
    onChange,
    id
  } = props
  let [menuState, setMenuState] = useState({ month: false, year: false })

  let { dropup } = position

  let menuOpen = menuState.month || menuState.year

  return (
    <div
      className={cx('ui-kit-select--dropdown', transitionState)}
      style={{
        overflow: 'visible',
        margin: dropup ? '16px 16px 2px' : '2px 16px 16px'
      }}
      ref={ref}
    >
      <div
        className={cx('ui-kit-select--transition')}
        style={getMenuAnimationStyle({ transitionState, transitionDuration, dropup })}
      >
        <div className='ui-kit-select--popup ui-kit-datepicker_element--popup'>
          <DatePickerHeader
            id={id}
            selectedMonth={month}
            selectedYear={year}
            startDate={startDate}
            endDate={endDate}
            yearMenuRef={yearMenuRef}
            monthMenuRef={monthMenuRef}
            onChange={onChange}
            onMenuOpen={(key: string) => setMenuState(_state => ({ ..._state, [key]: true }))}
            onMenuClose={(key: string) => setTimeout(() => setMenuState(_state => ({ ..._state, [key]: false })), 100)}
          />
          <div className='ui-kit-datepicker_calendar-container'>
            {menuOpen && <div className='ui-kit-datepicker_calendar-container-mask' />}
            <div className='ui-kit-datepicker_calendar-container-head'>
              {DAYS_MINI.map((d,i)=><div key={i} className='cch-name'>{d}</div>)}
            </div>
            <div className='ui-kit-datepicker_calendar-container-body'>
              {days}
            </div>
          </div>
          <DatePickerFooter
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  )
}

export default forwardRef(DatePickerElement)
