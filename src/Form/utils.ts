import get from 'lodash.get'
import set from 'lodash.set'
import { isFunction } from '../utils'
import { FormFields } from './props'

interface FieldRules {
  name: string;
  method?: any;
  message?: any;
  validationProps: object,
  formatter?: Function,
  ctx?: any
}

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const getValue = (v: any, o: any) => String(o.accessor ? (v[o.accessor] || '') : v).trim().toString();

export const validators = {
  isEmail: (value = '', options: any) => {
    const text = getValue(value, options);
    if (options.allowBlank && !text) {
      return true;
    }
    return emailRegex.test(text);
  },
  isRequired: (value = '', options: any) => {
    const text = getValue(value, options);
    return typeof text !== 'undefined' && text !== '';
  },
  customValidation: (value = '', options: any) => {
    const text = getValue(value, options);
    if (options.allowBlank && !text) {
      return true;
    }
    if (options.maxLength) {
      return (text && text.length === options.maxLength);
    }
    return false;
  },
  isNumber: (value = '', options: any) => {
    const number = getValue(value, options);
    if (options.allowBlank && (typeof number === 'undefined' || number === '')) {
      return true;
    }
    const _number = parseFloat(number);
    if (options.min && _number < options.min) {
      return false;
    }
    if (options.max && _number > options.max) {
      return false;
    }
    return true;
  }
}

const MULTI_VALUE_COMPONENTS = ['Checkbox.Group']

export const isArrayField = (component: string, props: any) => {
  return (
    MULTI_VALUE_COMPONENTS.includes(component) ||
    (component === 'Select' && Boolean(props.multiple))
  )
}

export class FormValidation {
  fields: Array<FormFields>
  rules: Array<FieldRules>
  constructor(fields: Array<FormFields>) {
    this.fields = fields
    this.constructRules(fields)
  }

  constructRules(fields: Array<FormFields>) {
    this.rules = fields.reduce((rules: Array<FieldRules>, field) => {
      let {
        name,
        requiredIf,
        errorMessage,
        label = '',
        validationProps = {},
        isEmail,
        isNumber,
        isBoolean,
        isArray,
        validation,
        type,
        dependencyCheck,
        required,
        editable = true,
        hidden = false,
        hiddenIf,
        component = 'TextInput',
        componentProps
      } = field
      isBoolean = isBoolean || component === 'Checkbox'
      isArray = isArray || isArrayField(component, componentProps)
      isEmail = isEmail || type === 'email'
      isNumber = isNumber || type === 'number'
      if (required) {
        rules.push({
          name,
          method: 'isRequired',
          message: errorMessage || `${label || name} is required`,
          validationProps: { ...validationProps },
          ctx: {
            editable,
            hidden,
            hiddenIf
          }
        })
      }
      if (requiredIf && isFunction(requiredIf)) {
        rules.push({
          name,
          method: requiredIf,
          message: errorMessage || `${label || name} is required`,
          validationProps: { ...validationProps },
          ctx: {
            editable,
            hidden,
            hiddenIf
          }
        })
      }
      if (isEmail) {
        rules.push({
          name,
          method: 'isEmail',
          validationProps: { ...validationProps },
          message: errorMessage || `Please enter valid ${label || name}`,
          ctx: {
            editable,
            hidden,
            hiddenIf
          }
        });
      }
      if (validation) {
        rules.push({
          name,
          method: 'customValidation',
          validationProps: { ...validationProps },
          message: errorMessage || `Please enter valid ${label || name}`,
          ctx: {
            editable,
            hidden,
            hiddenIf
          }
        });
      }
      if (isNumber) {
        let { min, max } = field
        rules.push({
          name,
          method: 'isNumber',
          validationProps: { ...validationProps, min, max },
          message: errorMessage || `${label || name} must be ${min ? `greater than ${min} ${max ? 'and' : ''}` : ''}${max ? ` lesser than ${max}` : ''}`,
          ctx: {
            editable,
            hidden,
            hiddenIf
          }
        });
      }
      if (dependencyCheck) {
        rules.push({
          name,
          method: dependencyCheck.validate,
          validationProps: { ...validationProps },
          message: dependencyCheck.errorMessage,
          ctx: {
            editable,
            hidden,
            hiddenIf
          }
        });
      }
      return rules
    }, [])
  }

  validate(data: object) {
    let validation: any = this.rules.reduce((validation, rule) => {
      try {
        let { name, method, validationProps, message, ctx } = rule
        let { editable, hidden, hiddenIf } = ctx;
        hidden = hiddenIf && isFunction(hiddenIf) ? hiddenIf(data) : Boolean(hidden)
        let validField = editable && !hidden
        if (validField) {
          let value = get(data, name)
          let validation_method = typeof method === 'string' ? validators[method] : method;

          if (isFunction(validation_method) && !validation_method(value, validationProps, data)) {
            set(validation.errors, name, message)
            validation.isValid = false;
          }
        }
      } catch (error) {
        set(validation.errors, 'generic', error.message)
        validation.isValid = false;
        console.error(error)
      }
      return validation
    }, { isValid: true, errors: {} })

    return validation;
  }
}

export class FormData {
  fields: Array<FormFields>

  constructor(fields: Array<FormFields>) {
    this.fields = fields
  }

  toJSON(data: object, includeAll = false) {
    return this.fields.reduce((formdata, field) => {
      let {
        name,
        isEmail,
        isNumber,
        isBoolean,
        isArray,
        type,
        formatter,
        component = 'TextInput',
        componentProps,
        editable = true,
        hidden,
        hiddenIf
      } = field

      hidden = hiddenIf && isFunction(hiddenIf) ? hiddenIf(data) : Boolean(hidden)
      if ((editable && !hidden) || includeAll) {
        isBoolean = isBoolean || component === 'Checkbox'
        isArray = isArray || isArrayField(component, componentProps)
        isEmail = isEmail || type === 'email'
        isNumber = isNumber || type === 'number'

        let value = get(data, name)
        let field_value: any = value
        if (isBoolean) {
          field_value = Boolean(value)
        }
        if (isNumber) {
          field_value = (typeof value !== 'undefined' && value !== null) ? parseFloat(value) : ''
        }
        if (isArray) {
          field_value = Array.isArray(value) ? value : []
        }

        field_value = formatter && isFunction(formatter) ? formatter(field_value) : field_value

        set(formdata, name, field_value)
      }

      return formdata
    }, {})
  }
}
