import React from 'react'
import dayjs from 'dayjs'
import Button from '../Button'
import { DatePickerFooterProps } from './props'
import { startOf, endOf } from './utils'

const DAY_MAP = {
  yesterday: () => dayjs().subtract(1, 'day').startOf('day').toDate().getTime(),
  today: () => dayjs().startOf('day').toDate().getTime(),
  tomorrow: () => dayjs().add(1, 'day').startOf('day').toDate().getTime()
}

export default function DatePickerFooter(props: DatePickerFooterProps) {
  let { onChange, startDate, endDate } = props

  let handleChange = (day: string) => {
    onChange({
      changeType: 'setDate',
      timestamp: DAY_MAP[day]()
    })
  }

  let computeDisabled = (day: string) => {
    let date = DAY_MAP[day]()
    return !(startOf(startDate, 'day').getTime() < date && endOf(endDate, 'day').getTime() > date)
  }

  return (
    <div className='ui-kit-datepicker_calendar-footer'>
      <Button tabIndex={-1} size='tiny' variant='plain' theme='default' className='is-primary has-less-padding' disabled={computeDisabled('yesterday')} onClick={() => handleChange('yesterday')}>Yesterday</Button>
      <Button tabIndex={-1} size='tiny' variant='plain' theme='default' className='is-primary has-less-padding' disabled={computeDisabled('today')} onClick={() => handleChange('today')}>Today</Button>
      <Button tabIndex={-1} size='tiny' variant='plain' theme='default' className='is-primary has-less-padding' disabled={computeDisabled('tomorrow')} onClick={() => handleChange('tomorrow')}>Tomorrow</Button>
    </div>
  )
}
