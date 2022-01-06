import { config } from 'react-transition-group'

if (process.env.NODE_ENV === 'test') {
  console.log('Disabling react-transistion on TEST env')
  config.disabled = true
}

import './scss/react-ui-kit.scss'

export * as DataTable from './DataTable'

export * as Select from './Select'

export { default as TextInput } from './TextInput'

export { default as Checkbox } from './Checkbox'

export { default as Radio } from './Radio'

export { default as Button } from './Button'

export { default as ButtonGroup } from './ButtonGroup'

export { default as Dropdown } from './Dropdown'

export { default as Tooltip } from './Tooltip'

export * as Toast from './Toast'

export * as Dialog from './Dialog'

export { default as Form } from './Form'

export { default as Alert } from './Alert'

export { default as AlertStack } from './AlertStack'

export { default as DatePicker } from './DatePicker'

export { default as MonthPicker } from './MonthPicker'

export { default as Loader } from './Loader'

export * as ProgressBar from './ProgressBar'

export { default as ActionContainer } from './ActionContainer'

export { default as Accordion } from './Accordion'

export { default as Carousel } from './Carousel'

export { default as Tabs } from './Tabs'
