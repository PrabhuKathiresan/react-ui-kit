import React, { useState } from 'react'
import { DatePicker, MonthPicker } from '@pk-design/react-ui-kit'

export default function DatepickerComponent() {
  let [date, setDate] = useState(new Date(2021, 5, 10));
  let [mpDate, setMpDate] = useState(new Date())
  return (
    <div style={{ width: 480 }}>
      <DatePicker label='Basic datepicker' closeOnSelect placeholder='choose a date' />
      <br />
      <DatePicker
        label='Datepicker with default value'
        closeOnSelect
        defaultValue={new Date(2021, 6, 5)}
      />
      <br />
      <DatePicker
        label='Datepicker with min and max dates'
        closeOnSelect
        min={new Date(2021, 6, 10)}
        max={new Date()}
      />
      <br />
      <DatePicker
        label='Reminder date'
        closeOnSelect
        min={new Date()}
        max={new Date(2021, 6, 31)}
      />
      <br />
      <DatePicker
        label='Datepicker with custom size'
        closeOnSelect
        className='custom-datepicker-size'
        hint='This is custom datepicker with custom size'
      />
      <br />
      <DatePicker
        label='Datepicker with default value'
        value={date}
        onChange={(d) => setDate(d)}
        container='body'
        closeOnScroll={false}
        error='This is a error message'
      />
      <br />
      <DatePicker
        disabled
        label='Disabled datepicker'
        message='This is a disabled date picker input'
      />
      <br />
      <MonthPicker
        onChange={(_date) => setMpDate(_date)}
        label='Basic monthpicker'
        value={mpDate}
      />
      <div style={{ height: 400 }} />
      <div className='d-flex'>
        <DatePicker
          closeOnSelect
          label='Datepicker that will dropup'
          className='mr-8'
        />
        <MonthPicker
          onChange={(_) => setMpDate(_)}
          label='Basic monthpicker'
          value={mpDate}
        />
      </div>
      
    </div>
  )
}
