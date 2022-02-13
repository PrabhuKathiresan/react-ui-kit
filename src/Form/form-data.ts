import get from 'lodash.get'
import set from 'lodash.set'
import { isEqual, isFunction } from '../utils'
import { FormFields, ChangedAttributesType, AttributesType } from './props'
import Schema from './schema'
import { isMultiValueField, isDateField, isBooleanField } from './utils'

const noopWithReturn = (str: string) => str

export default class FormData extends Schema {
  fields: Array<FormFields>
  data: object

  attributes: ChangedAttributesType = {}
  _initialValue: object = {}

  constructor(data: object, fields: Array<FormFields>) {
    super(fields)
    this.fields = fields
    this.data = this._setupData(fields, data)
  }

  // use this only to ensure if form is valid.
  // this will abortEarly as soon as it finds any error
  get isValid(): boolean {
    return this.validate({ abortEarly: true, strict: false }).isValid
  }

  validate = (options: any = {}, t: Function = noopWithReturn) => {
    let validation: any = {
      isValid: true,
      errors: {}
    }
    try {
      this.schema.validateSync(this.data, { abortEarly: false, ...options })
    } catch (validationError: any) {
      validation.isValid = false
      for (let error of validationError.inner) {
        if (!validation.errors[error.path]) validation.errors[error.path] = t(error.message)
      }
    }
    return validation;
  }

  serialize = (options: any = {}) => {
    let parsedData: any = {}
    try {
      parsedData = this.schema.cast(this.data, options)
    } catch (error) {
      console.error(error)
    }
    return parsedData
  }

  update = (data: object) => {
    this.data = this._setupData(this.fields, data);
    return this;
  }

  updateAttribute = (name: string, value: any) => {
    set(this.data, name, value);
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
    return fields.reduce((formData, field) => {
      let {
        name, getter, component = 'TextInput', componentProps = {},
        type = 'text', default: defaultValue = ''
      } = field
      let multiple = Boolean(componentProps.multiple)
      let value = getter && isFunction(getter) ? getter(data) : get(data, name)
      if (isMultiValueField(component, multiple)) {
        if (!value) value = []
        else if (!Array.isArray(value)) value = [value]

        defaultValue = []
      }
      if (isDateField(component, type)) {
        value = value instanceof Date ? value : new Date()
      }
      if (isBooleanField(component, type)) {
        value = Boolean(value)
        defaultValue = typeof defaultValue === 'boolean' ? defaultValue : field.nullable ? null : false
      }
      if (type === 'number') {
        value = (value && isNaN(value)) ? '' : value;
        defaultValue = (defaultValue && isNaN(defaultValue)) ? '' : defaultValue;
        value = typeof value === 'undefined' ? defaultValue : value;
      } else {
        value = value || defaultValue
      }
      set(formData, name, value)
      set(this._initialValue, name, value)
      set(this.attributes, name, [value])
      return formData
    }, {})
  }

  hasDirtyAttributes = () => {
    let attrs = Object.entries(this.attributes);

    return attrs.some(([, prop]) => {
      let [previous, current = previous] = prop
      return !isEqual(previous, current)
    })
  }

  changedAttributes = (): AttributesType => {
    let attrs = Object.entries(this.attributes);

    return attrs.reduce((attributes, [key, prop]) => {
      let [previous, current = previous] = prop
      if (!isEqual(previous, current)) attributes[key] = current
      return attributes
    }, {})
  }
}
