import {
  TransformFunction
} from 'yup/es/types'
import FormData from './form-data'

export type FieldComponents = 'TextInput' | 'TextArea' | 'Checkbox' | 'Checkbox.Group' | 'Select' | 'Radio' | 'Radio.Group' | 'DatePicker' | 'MonthPicker' | 'Custom'
export type FieldTypes = 'text' | 'tel' | 'string' | 'email' | 'url' | 'password' | 'number' | 'date' | 'datetime' | 'boolean' | 'bool' | 'array' | 'object' | 'nested'
interface ErrorMessageAttrs {
  required?: string
  email?: string
  url?: string
  default?: string
  exactLength?: string
}

export interface FieldValidationAttrs {
  enum?: Array<any>
  min?: number | Date
  max?: number | Date
  length?: number
  when?: Array<any>
  pattern?: RegExp
  transform?: TransformFunction<any>
  errorMessage?: ErrorMessageAttrs
}

export interface FormFields extends FieldValidationAttrs {
  // Field properties
  name: string
  label?: string
  placeholder?: string

  // Field value getter
  getter?: Function

  // Field types
  type?: FieldTypes
  customComponent?: any
  component?: FieldComponents
  componentProps?: any

  // Field change control
  onInputChange?: Function

  // Default value of the field
  default?: any

  // Field behaviours
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  nullable?: boolean
  editable?: boolean
  optional?: boolean

  // Field controlled behaviours
  disabledIf?: Function
  hiddenIf?: Function

  // Field attribute validations
  maxLength?: number

  // Custom support for translation
  translateOptions?: any

  // manage group fields
  group?: boolean
  groupTitle?: string
  groupType?: 'row' | 'column'
  groupClass?: string
  fields?: Array<FormFields>

  // Any custom field attributes - maintain lowercase
  [k: string]: any
}

export interface FormState {
  formData: FormData
  errors?: object
  genericError: any
  submitting?: boolean
  dirty?: boolean
  startValidate?: boolean
}

export interface IconProps {
  left?: any
  right?: any
}

export interface ServiceProps {
  [k: string]: Function
}

export interface FormProps {
  idField?: string
  onSubmit?: Function
  service?: ServiceProps
  createMethod?: string
  updateMethod?: string
  fields: Array<FormFields>
  data: object
  stickyFooter?: boolean
  loading?: boolean
  loadingText?: any
  disabled?: boolean
  submitBtnText?: string
  submitBtnIcon?: IconProps
  showCancelBtn?: boolean
  cancelBtnText?: string
  cancelBtnIcon?: IconProps
  onCancel?: Function
  name: string
  onSuccess?: Function
  onError?: Function
  extra?: any
  customValidation?: Function
  constructParams?: Function
  t?: Function
  ignoreDefaultTranslationOption?: boolean
  submitOnlyIfValid?: boolean
  abortEarly?: boolean
  stripUnchanged?: boolean
  beforeUpdate?: (obj: object, data: object) => object
}

export interface FieldRules {
  name: string
  method?: any
  message?: any
  validationProps: object
  formatter?: Function
  ctx?: any
}

export interface AttributesType {
  [key: string]: Array<any>
}

export interface ChangedAttributesType {
  [key: string]: any
}
