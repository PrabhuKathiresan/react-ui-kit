import get from 'lodash.get'
import set from 'lodash.set'
import { isEqual, isFunction, isUnDefined } from '../utils'
import { FormFields, FieldRules } from './props'

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const getValue = (v: any, o: any) => String(o.accessor ? (v[o.accessor] || '') : v).trim().toString()

export const validators = {
  isEmail: (value: any, options: any) => {
    value = isUnDefined(value) ? '' : value
    let text = getValue(value, options)
    if (options.allowBlank && !text) {
      return true
    }
    return emailRegex.test(text)
  },
  isRequired: (value: any, options: any) => {
    value = isUnDefined(value) ? '' : value
    let text = getValue(value, options)
    return typeof text !== 'undefined' && text !== ''
  },
  isDate: (date: any, options: any) => {
    if (options.allowBlank && date === '') {
      return true
    }

    return date instanceof Date
  },
  customValidation: (value: any, options: any) => {
    value = isUnDefined(value) ? '' : value
    let { validation, ...option } = options
    if (isFunction(validation)) {
      return validation(value, option)
    }
    let text = getValue(value, option)
    let { allowBlank, maxLength } = option
    if (allowBlank && !text) {
      return true
    }
    if (maxLength) {
      return (text && text.length === maxLength)
    }
    return false
  },
  isNumber: (value: any, options: any) => {
    value = isUnDefined(value) ? '' : value
    let number = getValue(value, options)
    if (options.allowBlank && (typeof number === 'undefined' || number === '')) {
      return true
    }
    let _number = parseFloat(number)
    if (options.min && _number < options.min) {
      return false
    }
    if (options.max && _number > options.max) {
      return false
    }
    return true
  },
  isBoolean: (value: any) => {
    return Boolean(value)
  },
  isArray: (value: any) => {
    return Array.isArray(value) && Boolean(value.length)
  }
}

const MULTI_VALUE_COMPONENTS = ['Checkbox.Group']

export const isArrayField = (props: any, component: string = 'TextInput') => {
  return (
    MULTI_VALUE_COMPONENTS.includes(component) ||
    (component === 'Select' && Boolean(props.multiple))
  )
}

export const isDateField = (component: string = '') => ['MonthPicker', 'DatePicker'].includes(component)

const getValidationMap = (field: FormFields, context: any) => {
  let {
    validation,
    validationProps,
    errorMessage,
    editable = true,
    hidden = false,
    hiddenIf,
    required,
    requiredIf,
    label,
    name,
    dependencyCheck
  } = field
  let fieldName = label || name
  let ctx = {
    editable,
    hidden,
    hiddenIf
  }
  let commonProps = {
    name,
    message: errorMessage || `Please enter valid ${fieldName}`,
    ctx,
    validationProps: { ...validationProps },
  }
  let isBoolean = context._isBoolean(field)
  let isArray = context._isMultiValue(field)
  let isEmail = context._isEmail(field)
  let isNumber = context._isNumber(field)
  let isDate = context._isDate(field)
  let rules = [
    {
      condition: () => validation,
      props: () => ({
        ...commonProps,
        method: 'customValidation',
        validationProps: { ...validationProps, validation }
      }),
    },
    {
      condition: () => required,
      props: () => {
        let method = 'isRequired'
        if (isBoolean) method = 'isBoolean'
        if (isArray) method = 'isArray'
        return {
          ...commonProps,
          method,
          message: errorMessage || `${fieldName} is required`,
        }
      }
    },
    {
      condition: () => requiredIf && isFunction(requiredIf),
      props: () => ({
        ...commonProps,
        method: requiredIf,
        message: errorMessage || `${fieldName} is required`,
      })
    },
    {
      condition: () => isEmail,
      props: () => ({
        ...commonProps,
        method: 'isEmail'
      })
    },
    {
      condition: () => isNumber,
      props: () => {
        let { min, max } = field
        let errMsg = errorMessage
        if (!errorMessage) {
          errMsg = `${fieldName} must be `
          if (min) {
            errMsg += `greater than ${min} `
    
            if (max) errMsg += 'and '
          }
          if (max) errMsg += `lesser than ${max}`
        }
        return {
          ...commonProps,
          method: 'isNumber',
          validationProps: { ...validationProps, min, max },
          message: errMsg,
        }
      }
    },
    {
      condition: () => isDate,
      props: () => ({
        ...commonProps,
        method: 'isDate',
        message: errorMessage || `${fieldName} is invalid`,
      })
    },
    {
      condition: () => dependencyCheck,
      props: () => ({
        ...commonProps,
        method: dependencyCheck.validate,
        message: dependencyCheck.errorMessage
      })
    }
  ]

  return rules.filter((_r) => _r.condition()).map((r) => r.props())
}

class FieldProps {
  _isBoolean = (field: FormFields) => {
    let {
      isBoolean,
      component,
      type
    } = field
    return isBoolean || component === 'Checkbox' || type === 'boolean'
  }

  _isMultiValue = (field: FormFields) => {
    let {
      isArray,
      component,
      componentProps
    } = field

    return isArray || isArrayField(componentProps, component)
  }

  _isEmail = (field: FormFields) => field.isEmail || field.type === 'email'
  _isNumber = (field: FormFields) => field.isNumber || field.type === 'number'
  _isDate = (field: FormFields) => field.isDate || isDateField(field.component)

  _getFieldValue = (field: FormFields, value: any) => {
    let field_value: any = value
    if (this._isBoolean(field)) {
      field_value = Boolean(value)
    }

    if (this._isMultiValue(field)) {
      field_value = Array.isArray(value) ? value : []
    }

    if (this._isNumber(field)) {
      field_value = (typeof value !== 'undefined' && value !== null && value !== '') ? parseFloat(value) : ''
    }

    let {
      formatter
    } = field

    field_value = formatter && isFunction(formatter) ? formatter(field_value) : field_value

    return field_value
  }

  _isHiddenField = (field: FormFields, data: any) => {
    let {
      hiddenIf,
      hidden
    } = field

    return hiddenIf && isFunction(hiddenIf) ? hiddenIf(data) : Boolean(hidden)
  }
}

export class FormValidation extends FieldProps {
  fields: Array<FormFields>
  rules: Array<FieldRules>
  constructor(fields: Array<FormFields>) {
    super()
    this.fields = fields
    this.constructRules(fields)
  }

  constructRules(fields: Array<FormFields>) {
    this.rules = fields.reduce((rules: Array<FieldRules>, field) => {
      rules = rules.concat(getValidationMap(field, this))
      return rules
    }, [])
  }

  validate(data: object) {
    return this.rules.reduce((validation, rule) => {
      try {
        let { name, method, validationProps, message, ctx } = rule
        let { editable, hidden, hiddenIf } = ctx
        hidden = hiddenIf && isFunction(hiddenIf) ? hiddenIf(data) : Boolean(hidden)
        let validField = editable && !hidden
        if (validField) {
          let value = get(data, name)
          let validation_method = typeof method === 'string' ? validators[method] : method

          if (isFunction(validation_method) && !validation_method(value, validationProps, data)) {
            set(validation.errors, name, message)
            validation.isValid = false
          }
        }
      } catch (error) {
        set(validation.errors, 'generic', error.message)
        validation.isValid = false
        console.error(error)
      }
      return validation
    }, { isValid: true, errors: {} })
  }
}

export class FormData extends FieldProps {
  fields: Array<FormFields>

  constructor(fields: Array<FormFields>) {
    super()
    this.fields = fields
  }

  toJSON(data: object, options = { includeAll: false, strict: false, changedAttributes: {} }) {
    let fields = [...this.fields]
    let {
      strict,
      includeAll,
      changedAttributes = {}
    } = options
    if (strict) {
      let fieldKeys = Object.keys(changedAttributes)
      fields = fields.filter((field) => fieldKeys.includes(field.name))
    }
    return fields.reduce((formdata, field) => {
      let {
        name,
        editable = true,
      } = field

      let hidden = this._isHiddenField(field, data)
      if ((editable && !hidden) || includeAll) {
        let value = get(data, name)
        let previousValue = get(data, `__previous_${name}`)
        let field_value = this._getFieldValue(field, value)

        if (!strict || !isEqual(value, previousValue)) {
          set(formdata, name, field_value)
        }
      }

      return formdata
    }, {})
  }
}
