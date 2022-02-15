import get from 'lodash.get'
import set from 'lodash.set'
import { ValidationError } from 'yup'
import { isEqual, isFunction } from '../utils'
import { FormFields, ChangedAttributesType, AttributesType } from './props'
import Schema from './schema'
import { isMultiValueField, isDateField, isBooleanField } from './utils'

const noopWithReturn = (str: string) => str
const getNumberValue = (value: any) => value ? (isNaN(value) ? '' : value) : ''
const getDateValue = (value: any) => value instanceof Date ? value : null

export default class FormData extends Schema {
  fields: Array<FormFields>
  data: object
  abortEarly: boolean
  strict: boolean = false
  t: Function
  idField: string
  isNew: boolean
  _id: string
  stripUnchanged: boolean

  attributes: ChangedAttributesType = {}
  _initialValue: object = {}

  constructor(data: object, fields: Array<FormFields>, options: any) {
    super(fields)
    this.fields = fields
    let {
      abortEarly = true,
      t = noopWithReturn,
      idField = 'id',
      stripUnchanged = false
    } = options
    this.abortEarly = abortEarly
    this.t = t
    this.idField = idField
    this.isNew = true
    this.stripUnchanged = stripUnchanged
    this.data = this._setupData(fields, data)

    this._id = get(data, this.idField)

    if (this._id) {
      this.isNew = false
    }
  }

  get validationOption(): any {
    return {
      strict: this.strict,
      abortEarly: this.abortEarly
    }
  }

  // use this only to ensure if form is valid.
  // this will abortEarly as soon as it finds any error
  get isValid(): boolean {
    return this.validate().isValid
  }

  get processableData(): any {
    let data = this.stripUnchanged ? this.changedAttributes() : this.data
    return data
  }

  handleValidationError(validationError: ValidationError): any {
    let errors: any = {}
    let { path, message, inner: innerError} = validationError
    if (this.abortEarly) {
      errors[path] = this.t(message)
    } else {
      for (let error of innerError) {
        if (!errors[error.path]) errors[error.path] = error.message
      }
    }
    return errors
  }

  validate = () => {
    let validation: any = {
      isValid: true,
      errors: {}
    }
    try {
      this.schema.validateSync(this.processableData, this.validationOption)
    } catch (validationError: any) {
      validation.isValid = false
      validation.errors = this.handleValidationError(validationError)
    }
    return validation
  }

  serialize = (options: any = {}) => {
    let parsedData: any = {}
    try {
      parsedData = this.schema.cast(this.processableData, options)
    } catch (error) {
      console.error(error)
    }
    return parsedData
  }

  update = (data: object) => {
    this.data = this._setupData(this.fields, data)
    return this
  }

  updateAttribute = (name: string, value: any) => {
    set(this.data, name, value)
    let attribute = get(this.attributes, name) || []
    let previousValue = attribute[0] || get(this._initialValue, name)
    if (previousValue === value) {
      attribute = [previousValue]
    } else {
      attribute = [previousValue, value]
    }
    set(this.attributes, name, attribute)
    return this
  }

  updateAttributes = (attrs: object) => {
    for (let [key, value] of Object.entries(attrs)) {
      this.updateAttribute(key, value)
    }
    return this
  }

  _setupData = (fields: Array<FormFields>, data: object) => {
    let today = new Date()
    return fields.filter((f) => !f.hidden).reduce((formData, field) => {
      let {
        name, getter, component = 'TextInput', componentProps = {},
        type = 'text', default: defaultValue = ''
      } = field
      let previous, current;
      let multiple = Boolean(componentProps.multiple)
      let value = getter && isFunction(getter) ? getter(data) : get(data, name)
      previous = current = value;
      if (isMultiValueField(component, multiple)) {
        if (!value) value = []
        else if (!Array.isArray(value)) value = [value]

        defaultValue = []
      }
      if (isDateField(component, type)) {
        value = getDateValue(value)
        defaultValue = getDateValue(defaultValue)

        if (component === 'MonthPicker') value = value || defaultValue || today
      }
      if (isBooleanField(component, type)) {
        value = Boolean(value)
        defaultValue = typeof defaultValue === 'boolean' ? defaultValue : field.nullable ? null : false
      }
      if (type === 'number') {
        value = getNumberValue(value)
        defaultValue = getNumberValue(defaultValue)
      } else {
        value = value || defaultValue
      }
      if (![[], '', null, undefined, today].includes(value)) current = value
      set(formData, name, value)
      set(this._initialValue, name, value)
      set(this.attributes, name, [previous, current])
      return formData
    }, {})
  }

  hasDirtyAttributes = () => {
    let attrs = Object.entries(this.attributes)

    return attrs.some(([, prop]) => {
      let [previous, current = previous] = prop
      return !isEqual(previous, current)
    })
  }

  changedAttributes = (): AttributesType => {
    let attrs = Object.entries(this.attributes)

    return attrs.reduce((attributes, [key, prop]) => {
      let [previous, current = previous] = prop
      if (!isEqual(previous, current)) attributes[key] = current
      return attributes
    }, {})
  }
}
