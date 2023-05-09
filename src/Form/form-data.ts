import get from 'lodash.get'
import set from 'lodash.set'
import { ValidationError } from 'yup'
import { isEqual, isFunction, isObject } from '../utils'
import { FormFields, ChangedAttributesType, AttributesType } from './props'
import Schema from './schema'
import { isMultiValueField, isDateField, isBooleanField, isGroupField, isNestedField } from './utils'

const getNumberValue = (value: any) => value ? (isNaN(value) ? undefined : value) : undefined
const getDateValue = (value: any) => value instanceof Date ? value : undefined

export default class FormData extends Schema {
  fields: Array<FormFields>
  data: object
  abortEarly: boolean
  strict: boolean = false
  idField: string
  isNew: boolean
  _id: string
  stripUnchanged: boolean

  attributes: ChangedAttributesType = {}
  _initialValue: object = {}

  constructor(data: object, fields: Array<FormFields>, options: any) {
    super(fields, options)
    this.fields = fields
    let {
      abortEarly = true,
      idField = 'id',
      stripUnchanged = false
    } = options
    this.abortEarly = abortEarly
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

  handleValidationError(validationError: ValidationError, validation: any): any {
    validation.isValid = false
    let {
      inner: innerError,
      path,
      message
    } = validationError
    if (this.abortEarly) {
      if (path) validation.errors[path] = message
      else validation.genericError = [message]
    } else {
      for (let error of innerError) {
        if (error.path) {
          if (!validation.errors[error.path]) validation.errors[error.path] = message
        } else {
          validation.genericError = (validation.genericError || []).concat([message])
        }
      }
    }
    return validation
  }

  validate = () => {
    let validation: any = {
      isValid: true,
      errors: {},
      genericError: null
    }
    if (this.abortEarly) {
      for (let field of this.validationOrder) {
        try {
          this.schema.validateSyncAt(field, this.data, { strict: true })
        } catch (validationError: any) {
          validation = this.handleValidationError(validationError, validation)
          break
        }
      }
    } else {
      try {
        this.schema.validateSync(this.data, this.validationOption)
      } catch (validationError: any) {
        validation = this.handleValidationError(validationError, validation)
      }
    }
    return validation
  }

  serialize = (options: any = {}) => {
    let parsedData: any = {}
    try {
      parsedData = this.schema.cast(this.processableData, {
        assert: false,
        ...options
      })
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

  _setupData = (fields: Array<FormFields>, data: object, formData: any = {}, parentKey: string = '') => {
    let today = new Date()
    let filteredFields = fields.filter((f) => !f.hidden)
    
    for (let field  of filteredFields) {
      let {
        name, getter, component = 'TextInput', componentProps = {},
        type = 'text', default: defaultValue = undefined
      } = field
      name = parentKey ? `${parentKey}.${name}` : name
      if (isGroupField(field)) {
        let { fields = [] } = field;
        this._setupData(fields, data, formData, isNestedField(field) ? name : '')
        continue
      }
      let multiple = Boolean(componentProps.multiple)
      let value = getter && isFunction(getter) ? getter(data) : get(data, name)
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
        defaultValue = typeof defaultValue === 'boolean' ? defaultValue : field.nullable ? undefined : false
      }
      if (type === 'number') {
        value = getNumberValue(value)
        defaultValue = getNumberValue(defaultValue)
      } else {
        value = value || defaultValue || undefined
      }
      set(formData, name, value)
      set(this._initialValue, name, value)
      set(this.attributes, name, [value])
    }

    return formData
  }

  hasDirtyAttributes = (allAttrs: ChangedAttributesType = this.attributes): boolean => {
    let attrs = Object.entries(allAttrs);
    return attrs.some(([, prop]: [any, [any, any]]) => {
      if (!Array.isArray(prop) && isObject(prop)) {
        return this.hasDirtyAttributes(prop as ChangedAttributesType)
      }
      let [previous, current = previous] = prop as [any, any]
      return !isEqual(previous, current)
    });
  }

  changedAttributes = (allAttrs: ChangedAttributesType = this.attributes, data: AttributesType = {}, parentKey: string = ''): AttributesType => {
    let attrs = Object.entries(allAttrs)
    return attrs.reduce((attributes, [key, prop]: [any, [any, any]]) => {
      key = parentKey ? `${parentKey}.${key}` : key
      if (!Array.isArray(prop) && isObject(prop)) {
        return this.changedAttributes(prop, attributes, key)
      }
      let [previous, current = previous] = prop as [any, any]
      if (!isEqual(previous, current)) set(attributes, key, current)
      return attributes
    }, data)
  }
}
