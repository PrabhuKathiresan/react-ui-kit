import React from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import { BasicSelect } from '../Select'
import { MonthPickerProps } from './props'
import { noop, generateUEID } from '../utils'
import Tooltip from '../Tooltip'
import InfoCircle from '../icons/info-circle'

const MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const today = new Date()
const defaultStartDate = new Date(today.getFullYear() - 10, 0)
const defaultEndDate = new Date(today.getFullYear() + 10, 11)

function MonthPicker(props: MonthPickerProps, ref: any) {
  let {
    id = generateUEID(),
    startDate = dayjs(defaultStartDate).startOf('month').toDate(),
    endDate = dayjs(defaultEndDate).endOf('month').toDate(),
    onChange,
    monthMenuRef = noop,
    yearMenuRef = noop,
    onOpen = noop,
    onClose = noop,
    width,
    height,
    value,
    defaultValue,
    container,
    className = '',
    borderless = false,
    label = null,
    labelClass = '',
    required = false,
    disabled = false,
    hint = null,
    hintPosition = 'left',
    yearWidth,
    message,
    error,
    inputSize = 'default',
    animate = true,
    ...inputProps
  } = props

  value = value || defaultValue || today
  let selectedMonth = value.getMonth()
  let selectedYear = value.getFullYear()

  let startYear = startDate.getFullYear()
  let endYear = endDate.getFullYear()
  let month = { label: MonthList[selectedMonth], value: selectedMonth, disabled: false }
  let year = { label: selectedYear.toString(), value: selectedYear }

  let disableMonth = (index: number) => {
    if (selectedYear === startYear) {
      let startMonth = startDate.getMonth()

      if (index < startMonth) {
        return true
      }
    }

    if (selectedYear === endYear) {
      let endMonth = endDate.getMonth()

      if (index > endMonth) {
        return true
      }
    }

    return false
  }

  let monthList = MonthList.map((_month, i) => ({ label: _month, value: i, disabled: disableMonth(i) })).filter((item) => !item.disabled)
  let yearsList = []
  for (let i = startYear; i <= endYear; i++) {
    yearsList.push({ label: i.toString(), value: i })
  }

  let selectProps = {
    labelKey: 'label',
    animate,
    inputSize,
    closeOnOutsideClick: true,
    height,
    borderless,
    container,
    required,
    inputProps
  }

  return (
    <div className={cx('ui-kit-input-block', className)} data-testid={id} ref={ref}>
      {
        label &&
        <label className={cx('ui-kit-input-label', labelClass, { 'is-required required': required })} htmlFor={disabled ? '' : id} data-testid={disabled ? `disabled-monthpicker-label-${id}` : `monthpicker-label-${id}`}>
          <span>{label}</span>
          {
            hint &&
            <span className='ml-8 ui-kit-input-hint-icon'>
              <Tooltip direction={hintPosition} content={hint} wrapperClass='d-flex'>
                <InfoCircle width={14} height={14} />
              </Tooltip>
            </span>
          }
        </label>
      }
      <div className='element-flex'>
        <BasicSelect
          options={yearsList}
          id={`${id}-year-selection`}
          onChange={(selected: any) => {
            let [_year] = selected
            onChange(new Date(_year.value, selectedMonth), { year: _year.value })
          }}
          width={yearWidth}
          selected={[year]}
          containerClass='mb-0 w-auto mr-8'
          setMenuRef={yearMenuRef}
          disabled={disabled || yearsList.length < 2}
          onOpen={() => onOpen('year')}
          onClose={() => onClose('year')}
          {...selectProps}
        />
        <BasicSelect
          options={monthList}
          id={`${id}-month-selection`}
          onChange={(selected: any) => {
            let [_month] = selected
            onChange(new Date(selectedYear, _month.value), { month: _month.value })
          }}
          width={width}
          selected={[month]}
          containerClass='mb-0 w-auto'
          setMenuRef={monthMenuRef}
          disabled={disabled || monthList.length < 2}
          onOpen={() => onOpen('month')}
          onClose={() => onClose('month')}
          {...selectProps}
        />
      </div>
      {message && <span className='pt-4 element-flex' data-testid={`${id}-input-message`}>{message}</span>}
      {error && <span className='text--danger pt-4 element-flex' data-testid={`${id}-input-error`}>{error}</span>}
    </div>
  )
}

export default React.forwardRef(MonthPicker)
