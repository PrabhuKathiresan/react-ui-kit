import * as yup from 'yup'
import dayjs from 'dayjs'
import isEmpty from 'is-empty'
import { FormFields } from './props'
import { noopWithReturn, parseTranslationOptions } from './utils'

const {
  object,
  string,
  number,
  bool,
  array,
  date
} = yup

export default class Schema {
  _schema: yup.AnyObjectSchema
  _fieldOrder: Array<string>

  _options: any

  constructor(attrs: Array<FormFields>, options: any = {}) {
    this._options = options
    let shape = this._setupSchema(attrs)
    this._fieldOrder = Object.keys(shape)
    let organizedShape = Object.entries(shape).reverse().reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {})
    this._schema = object().shape(organizedShape)
  }

  get schema() {
    return this._schema
  }

  get validationOrder() {
    return this._fieldOrder
  }

  get t() {
    let { t = noopWithReturn } = this._options
    return t
  }

  get hasTranslation() {
    return !isEmpty(this._options.t)
  }

  _setupSchema = (fields: Array<FormFields>, _schema: any = {}) => {
    for (let field of fields) {
      if (field.hidden || field.disabled) {
        continue
      }
      if (field.group && Array.isArray(field.fields)) {
        this._setupSchema(field.fields, _schema)
        continue
      }
      let schema = this._getFieldSchema(field)
      _schema[field.name] = schema
    }

    return _schema
  }

  _getFieldSchema = (field: FormFields) => {
    let {
      label = '',
      type,
      default: defaultValue,
      hidden,
      transform = null,
      required,
      optional = !required,
      component,
      name,
      errorMessage = {},
      ...rest
    } = field

    defaultValue = defaultValue || undefined

    if (this.hasTranslation) {
      let { translateOptions = {} } = field
      if (!this._options.ignoreDefaultTranslationOption) {
        translateOptions = {
          entity: label,
          length: rest.length,
          ...translateOptions
        }
      }
      translateOptions = parseTranslationOptions(translateOptions, this.t)
      for (let key in errorMessage) {
        errorMessage[key] = this.t(errorMessage[key], translateOptions)
      }
    }

    let {
      required: requiredMessage = 'Please fill this required field',
      email: emailErrorMessage = 'Enter valid email address',
      url: urlErrorMessage = 'Enter valid url',
      exactLength = `Should be exactly ${rest.length} characters`
    } = errorMessage

    let schema
    switch(type) {
      case 'date':
      case 'datetime':
        schema = date().default(defaultValue)
        if (Array.isArray(rest.when)) {
          let [dependentFields, handler] = rest.when
          schema = schema.when(dependentFields, handler)
        } else if (required) {
          schema = schema.required(requiredMessage)
        } else {
          schema = schema.optional()
        }
        if (rest.min instanceof Date) schema = schema.min(dayjs(rest.min).startOf('d').toDate())
        if (rest.max instanceof Date) schema = schema.max(dayjs(rest.max).endOf('d').toDate())
        break
      case 'number':
        schema = number().default(defaultValue)
        if (Array.isArray(rest.when)) {
          let [dependentFields, handler] = rest.when
          schema = schema.when(dependentFields, handler)
        } else if (required) {
          schema = schema.required(requiredMessage)
        } else {
          schema = schema.optional()
        }

        if (rest.enum?.length) schema = schema.oneOf(rest.enum)
        if (typeof rest.min === 'number') schema = schema.min(rest.min)
        if (typeof rest.max === 'number') schema = schema.max(rest.max)
        if (!transform) transform = (value: any) => isNaN(value) ? undefined : value
        break
      case 'bool':
      case 'boolean':
        schema = bool()
        if (required) schema = schema.required(requiredMessage)
        else schema = schema.optional()
        break
      case 'array':
        if (!Array.isArray(defaultValue)) defaultValue = optional ? undefined : []  
        schema = array().default(defaultValue)
        if (Array.isArray(rest.when)) {
          let [dependentFields, handler] = rest.when
          schema = schema.when(dependentFields, handler)
        } else {
          if (required) schema = schema.required(requiredMessage)
          else schema = schema.optional()
        }
        if (typeof rest.min === 'number') schema = schema.max(rest.min)
        if (typeof rest.max === 'number') schema = schema.max(rest.max)
        break
      case 'object':
        schema = object().default(defaultValue)
        if (Array.isArray(rest.when)) {
          let [dependentFields, handler] = rest.when
          schema = schema.when(dependentFields, handler)
        } else if (required) {
          schema = schema.required(requiredMessage)
        } else {
          schema = schema.optional()
        }
        break
      case 'string':
      case 'password':
      case 'url':
      case 'email':
      case 'text':
      case 'tel':
      default:
        schema = string().trim().default(defaultValue)
        if (Array.isArray(rest.when)) {
          let [dependentFields, handler] = rest.when
          schema = schema.when(dependentFields, handler)
        } else if (required) {
          schema = schema.required(requiredMessage)
        } else {
          schema = schema.optional()
        }
        if (type === 'email') {
          if (rest.pattern) schema = schema.matches(rest.pattern, { message: emailErrorMessage })
          else schema = schema.email(emailErrorMessage)
        }
        if (type === 'url') {
          if (rest.pattern) schema = schema.matches(rest.pattern, { message: urlErrorMessage })
          else schema = schema.url(urlErrorMessage)
        }
        if (rest.enum?.length) schema = schema.oneOf(rest.enum)
        if (rest.length) schema = schema.length(rest.length, exactLength)
        break
    }

    if (typeof transform === 'function') {
      schema = schema.transform(transform)
    }

    return schema
  }
}
