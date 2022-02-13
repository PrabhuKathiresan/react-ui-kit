import FormData from './form-data'

export type FieldComponents = 'TextInput' | 'TextArea' | 'Checkbox' | 'Checkbox.Group' | 'Select' | 'Radio' | 'Radio.Group' | 'DatePicker' | 'MonthPicker' | 'Custom'
export type FieldTypes = 'text' | 'string' | 'email' | 'url' | 'password' | 'number' | 'date' | 'datetime' | 'boolean' | 'bool' | 'array'

export interface FormFields {
  name: string
  label?: string
  getter?: Function
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  type?: FieldTypes
  component?: FieldComponents
  customComponent?: any
  componentProps?: object
  disabledIf?: Function
  requiredIf?: Function
  hiddenIf?: Function
  onInputChange?: Function
  validation?: Function | boolean
  formatter?: Function
  validationProps?: object
  editable?: boolean
  default?: any
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
  isNewForm?: boolean
  submitBtnText?: string
  submitBtnIcon?: IconProps
  showCancelBtn?: boolean
  cancelBtnText?: string
  cancelBtnIcon?: IconProps
  onCancel?: Function
  name: string
  dataId?: any
  onSuccess?: Function
  onError?: Function
  strict?: boolean
  extra?: any
  customValidation?: Function
  constructParams?: Function
  t?: Function
  submitOnlyIfValid?: boolean
  beforeUpdate?: (obj: object) => object
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
