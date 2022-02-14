import * as yup from 'yup'
import dayjs from 'dayjs'
import { FieldComponents, FieldTypes } from './props'
import { emailRegex } from './utils'

const {
  object,
  string,
  number,
  bool,
  array,
  date,
  mixed
} = yup

interface ErrorMessageAttrs {
  required?: string
  email?: string
  default?: string
}

interface FieldAttrs {
  name?: string
  type?: FieldTypes
  component?: FieldComponents
  required?: boolean
  email?: boolean
  url?: boolean
  nullable?: boolean
  default?: any
  enum?: Array<any>
  min?: number | Date
  max?: number | Date
  hidden?: boolean
  when?: Array<any>
  transform?: yup.TransformFunction<any>
  errorMessage?: ErrorMessageAttrs
}

interface SchemaAttrs {
  [key: string]: FieldAttrs
}

export default class Schema {
  _schema: yup.ObjectSchema
  constructor(attrs: SchemaAttrs | Array<FieldAttrs>) {
    let fieldSchema = this._setupSchema(attrs)
    this._schema = object().shape(fieldSchema)
  }

  get schema() {
    return this._schema
  }

  _setupSchema = (attrs: SchemaAttrs | Array<FieldAttrs>) => {
    let _schema: any = {}
    for (let [attrName, props] of Object.entries(attrs).reverse()) {
      let {
        type,
        default: defaultValue = '',
        hidden,
        transform = null,
        nullable = false,
        required,
        component,
        name = '',
        errorMessage = {},
        ...rest
      } = props
      attrName = name || attrName
      if (hidden) {
        continue
      }

      let {
        required: requiredMessage = 'Please fill this required field'
      } = errorMessage

      let field
      switch (type) {
        case 'date':
        case 'datetime':
          field = date().nullable(nullable)
          if (required) field = field.required(requiredMessage)
          if (defaultValue instanceof Date) field = field.default(defaultValue)
          if (rest.min instanceof Date) field = field.min(dayjs(rest.min).startOf('d').toDate())
          if (rest.max instanceof Date) field = field.max(dayjs(rest.max).endOf('d').toDate())
          break
        case 'number':
          let {
            nullable: _nullable = true
          } = props;
          field = number().nullable(_nullable)
          if (required) field = field.required(requiredMessage)
          if (typeof defaultValue === 'number') field = field.default(defaultValue)
          if (rest.enum?.length) field = field.oneOf(rest.enum)
          if (typeof rest.min === 'number') field = field.min(rest.min)
          if (typeof rest.max === 'number') field = field.max(rest.max)

          if (!transform) transform = (value: any) => isNaN(value) ? null : value
          break
        case 'bool':
        case 'boolean':
          field = bool().nullable(nullable)
          if (required) field = field.required(requiredMessage)
          break
        case 'string':
        case 'text':
        case 'email':
        case 'url':
        case 'password':
          field = string().nullable(nullable)
          if (required) field = field.required(requiredMessage)
          field = field.default(defaultValue)
          field = field.trim()
          let {
            email = (type === 'email'),
            url = (type === 'url')
          } = rest
          if (email) field = field.matches(emailRegex, {
            message: 'Enter valid email address'
          })
          if (url) field = field.url()
          if (rest.enum?.length) field = field.oneOf(rest.enum)
          break
        case 'array':
          field = array()
          if (Array.isArray(rest.when)) {
            let [dependentFields, handler] = rest.when
            field = field.when(dependentFields, handler)
          } else {
            if (required) field = field.required(requiredMessage)
            else if (nullable) field = field.nullable()
          }
          if (!Array.isArray(defaultValue)) defaultValue = nullable ? null : []
          field = field.default(defaultValue)
          break
        case 'object':
          field = object().nullable(nullable)
          if (required) field = field.required(requiredMessage)
          field = field.default(defaultValue || undefined)
        default:
          field = mixed().nullable(nullable)
          if (required) field = field.required(requiredMessage)
          field = field.default(defaultValue || null)
          break
      }

      if (typeof transform === 'function') {
        field = field.transform(transform)
      }

      _schema[attrName] = field
    }

    return _schema
  }
}
