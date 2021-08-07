import React, { Component, Fragment } from 'react'
import cx from 'classnames'
import get from 'lodash.get'
import set from 'lodash.set'
import isEmpty from 'is-empty'
import Button from '../Button'
import TextInput from '../TextInput'
import DatePicker from '../DatePicker'
import MonthPicker from '../MonthPicker'
import { BasicSelect } from '../Select'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import Alert from '../Alert'
import { isDefined, isEqual, isFunction, noop } from '../utils'
import { FormFields, FormProps, FormState } from './props'
import { FormValidation, FormData, isDateField } from './utils'

const MULTI_VALUE_FIELDS = ['Select', 'Checkbox.Group']
const SERVICE_METHOD_NOT_AVAILABLE = 'Service method is not configured'

const getFormData = (props: FormProps) => {
  let { fields, data } = props
  return fields.reduce((formData, field) => {
    let { name, getter, component = 'TextInput' } = field
    let value = getter && isFunction(getter) ? getter(data) : get(data, name)
    let defaultValue: any = ''
    if (MULTI_VALUE_FIELDS.includes(component)) {
      if (value && !Array.isArray(value)) {
        value = [value]
      } else {
        value = []
      }
      defaultValue = []
    }
    if (isDateField(component)) {
      value = value instanceof Date ? value : new Date()
    }
    set(formData, name, value || defaultValue)
    set(formData, `__previous_${name}`, value || defaultValue)
    return formData
  }, {})
}

export default class Form extends Component<FormProps, FormState> {
  formValidation: FormValidation
  fieldsHash: any
  _changedAttributes: any = {}
  constructor(props: FormProps) {
    super(props)
    this.state = {
      formData: getFormData(this.props),
      errors: {},
      genericError: null,
      submitting: false,
      dirty: false
    }
    this.fieldsHash = this.props.fields.reduce((hash, field) => {
      hash[field.name] = { ...field }
      return hash
    }, {})
    this.formValidation = new FormValidation(this.props.fields)
  }

  componentDidUpdate(prevProps: FormProps) {
    if (!isEqual(prevProps.data, this.props.data)) {
      this.setState({
        formData: getFormData(this.props),
        dirty: false
      })
    }
  }

  getNormalizedData = (includeAll: boolean, strict: boolean) => {
    let { formData } = this.state
    let { fields } = this.props

    return new FormData(fields).toJSON(formData, {
      includeAll,
      strict,
      changedAttributes: this._changedAttributes
    })
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let formdata = this.getNormalizedData(true, false)
    let { customValidation } = this.props
    let validation = typeof customValidation === 'function' ? customValidation(formdata) : this.formValidation.validate(formdata)

    if (!validation.isValid) return this.setState({ errors: validation.errors, genericError: validation.genericError || null })

    this.setState({ errors: {}, genericError: null })

    let { onSubmit, strict = false, constructParams } = this.props
    let data = this.getNormalizedData(false, strict)

    if (typeof constructParams === 'function') data = constructParams(data)

    if (onSubmit && isFunction(onSubmit)) {
      return onSubmit(data)
    }

    let {
      service = {},
      isNewForm,
      createMethod = 'create',
      updateMethod = 'update',
      dataId,
      onSuccess = noop,
      onError = noop
    } = this.props

    let serviceMethod, params
    if (isNewForm) {
      serviceMethod = service[createMethod]
      params = [data]
    } else {
      serviceMethod = service[updateMethod]
      params = [dataId, data]
    }

    if (serviceMethod && isFunction(serviceMethod)) {
      this.setState({ submitting: true })

      return serviceMethod(...params)
        .then((response: any) => onSuccess(response))
        .catch((error: any) => onError(error.message))
        .finally(() => this.setState({ submitting: false }))
    }

    onError(SERVICE_METHOD_NOT_AVAILABLE)
    this.setState({ genericError: SERVICE_METHOD_NOT_AVAILABLE })
  }

  handleInputChange = (name: string, value: any) => {
    this.setState((state: FormState) => {
      let { formData } = state
      set(formData, name, value)
      return { formData: { ...formData } }
    }, () => this.afterChange(name))
  }

  handleCheckboxChange = (name: string, e: any) => {
    this.setState((state: FormState) => {
      let { formData } = state
      let { value } = e.target
      let values = get(formData, name)
      let index = values.indexOf(value)
      index !== -1 ? values.splice(index, 1) : values.push(value)
      set(formData, name, [...values])
      return { formData: { ...formData } }
    }, () => this.afterChange(name))
  }

  afterChange = (fieldName: any) => {
    let field = this.fieldsHash[fieldName]
    if (isFunction(field.onInputChange)) {
      let normalizedData = this.getNormalizedData(true, false)
      let updates = field.onInputChange(normalizedData)
      let { type, ...data } = updates
      if (type === 'update') {
        this.setState((state: FormState) => {
          let _formData = state.formData
          Object.keys(data).forEach(key => {
            set(_formData, key, data[key])
          })
          return { formData: { ..._formData } }
        })
      }
    }
    let { formData } = this.state
    if (this._changedAttributes[fieldName]) {
      let [previousValue] = this._changedAttributes[fieldName]
      let currentValue = get(formData, fieldName)
      if (isEqual(previousValue, currentValue)) delete this._changedAttributes[fieldName]
      else this._changedAttributes[fieldName] = [previousValue, currentValue]
    } else {
      let previousValue = get(formData, `__previous_${fieldName}`)
      let currentValue = get(formData, fieldName)
      if (!isEqual(previousValue, currentValue)) {
        this._changedAttributes = {
          ...this._changedAttributes,
          [fieldName]: [previousValue, currentValue]
        }
      }
    }
    this.setState({ dirty: !isEmpty(this._changedAttributes) })
  }

  renderField = (field: FormFields) => {
    let { formData, errors } = this.state
    let {
      type = 'text',
      component = 'TextInput',
      componentProps = {},
      disabled = false,
      required = false,
      requiredIf = () => false,
      disabledIf = () => false,
      hiddenIf = () => false,
      label,
      name,
      maxLength,
      dependencyCheck,
      formatter,
      validation,
      validationProps = {},
      customComponent = null,
      ...restProps
    } = field

    let data = this.getNormalizedData(true, false)
    if (hiddenIf(data)) return null

    let error = get(errors, name)

    disabled = disabledIf(data) || disabled

    let inputProps: any = {
      ...restProps,
      ...componentProps,
      disabled,
      required,
      label,
      type,
      name,
      id: name,
      value: get(formData, name),
      onChange: (e: any) => this.handleInputChange(name, e.target.value),
      error
    }

    let FieldComponent: any = TextInput

    switch (component) {
      case 'TextArea':
        let charLeft = maxLength && (isEmpty(inputProps.value) ? maxLength : maxLength - inputProps.value.length)
        inputProps.maxLength = maxLength
        inputProps.charLeft = charLeft
        inputProps.component = 'textarea'
        break
      case 'Select':
        inputProps.labelKey = inputProps.labelKey || 'name'
        inputProps.closeOnOutsideClick = isDefined(inputProps.closeOnOutsideClick) ? inputProps.closeOnOutsideClick : true
        inputProps.selected = inputProps.value
        inputProps.onChange = (s: Array<any>) => this.handleInputChange(name, s)
        inputProps.container = 'body'
        delete inputProps.value
        FieldComponent = BasicSelect
        break
      case 'Radio':
        FieldComponent = Radio
        break
      case 'Radio.Group':
        FieldComponent = Radio.Group
        break
      case 'Checkbox':
        inputProps.type = 'checkbox'
        inputProps.className = inputProps.className || 'mb-16'
        inputProps.checked = Boolean(inputProps.value)
        delete inputProps.value
        inputProps.onChange = (e: any) => this.handleInputChange(name, e.target.checked)
        FieldComponent = Checkbox
        break
      case 'Checkbox.Group':
        inputProps.onChange = (e: any) => this.handleCheckboxChange(name, e)
        FieldComponent = Checkbox.Group
        break
      case 'DatePicker':
        inputProps.onChange = (date: any) => this.handleInputChange(name, date)
        inputProps.container = 'body'
        FieldComponent = DatePicker
        break
      case 'MonthPicker':
        inputProps.onChange = (date: any) => this.handleInputChange(name, date)
        inputProps.container = 'body'
        FieldComponent = MonthPicker
        break
      case 'Custom':
        FieldComponent = customComponent
        inputProps.onChange = (value: any) => this.handleInputChange(name, value)
        break
      case 'TextInput':
      default:
        break
    }

    return <FieldComponent {...inputProps} />
  }

  render() {
    let {
      fields,
      stickyFooter,
      submitBtnText = 'Submit',
      submitBtnIcon = {},
      showCancelBtn = false,
      cancelBtnText = 'Cancel',
      cancelBtnIcon = {},
      onCancel = noop,
      name,
      disabled,
      loading,
      extra = null
    } = this.props
    let {
      submitting,
      dirty,
      genericError
    } = this.state

    let renderableFields = fields.filter(f => !f.hidden)
    let disableSubmit = disabled || loading || submitting || !dirty
    return (
      <>
        {
          genericError && <Alert type='error' className='mb-16' dismissable onClose={() => this.setState({ genericError: null })}>{genericError}</Alert>
        }
        <form name={name} data-testid={name} noValidate className={cx('ui-kit-form', { 'form-with-fixed-action': stickyFooter })} onSubmit={this.handleSubmit}>
          <div className='form-fields'>
            {
              renderableFields.map(field => (
                <Fragment key={field.name}>
                  {
                    this.renderField(field)
                  }
                </Fragment>
              ))
            }
          </div>
          {extra}
          <div className={cx('form-action-button', { 'sticky-footer': stickyFooter })}>
            {
              showCancelBtn && (
                <Button
                  type='button'
                  className='mr-16'
                  icon={cancelBtnIcon}
                  onClick={() => onCancel()}
                  data-testid={`cancel-${name}`}
                  tabIndex={-1}
                >
                  {cancelBtnText}
                </Button>
              )
            }
            <Button
              theme='primary'
              type='submit'
              icon={submitBtnIcon}
              disabled={disableSubmit}
              data-testid={`submit-${name}`}
            >
              {submitBtnText}
            </Button>
          </div>
        </form>
      </>
    )
  }
}
