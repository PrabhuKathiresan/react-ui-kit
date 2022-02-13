import React from 'react'
import Button from '../Button'
import Next from '../icons/next'
import Previous from '../icons/previous'
import Monthpicker from '../MonthPicker'
import { DatePickerHeaderProps } from './props'

export default function DatePickerHeader(props: DatePickerHeaderProps) {
  let {
    selectedMonth,
    selectedYear,
    startDate,
    endDate,
    monthMenuRef,
    yearMenuRef,
    onChange,
    onMenuClose,
    onMenuOpen
  } = props

  let startYear = startDate.getFullYear()
  let endYear = endDate.getFullYear()
  let startMonth = startDate.getMonth()
  let endMonth = endDate.getMonth()

  let selectedDate = new Date(selectedYear, selectedMonth)

  let disablePrevious = selectedYear === startYear && selectedMonth === startMonth
  let disableNext = selectedYear === endYear && selectedMonth === endMonth

  let handleChange = (_: any, change: any) => {
    onChange({ changeType: 'date', ...change })
  }

  return (
    <div className='ui-kit-datepicker_calendar-header'>
      <Button tabIndex={-1} size='tiny' variant='plain' className='px-4' disabled={disablePrevious} onClick={() => onChange({ changeType: 'month', offset: -1 })}><Previous /></Button>
      <Monthpicker
        min={startDate}
        max={endDate}
        value={selectedDate}
        onChange={handleChange}
        monthMenuRef={monthMenuRef}
        yearMenuRef={yearMenuRef}
        onOpen={(type: string) => onMenuOpen(type)}
        onClose={(type: string) => onMenuClose(type)}
        yearWidth={80}
        width={100}
        container='body'
        className='element-flex-justify-around mb-0'
        inputSize='small'
        tabIndex={-1}
      />
      <Button tabIndex={-1} size='tiny' variant='plain' className='px-4' disabled={disableNext} onClick={() => onChange({ changeType: 'month', offset: 1 })}><Next /></Button>
    </div>
  )
}
