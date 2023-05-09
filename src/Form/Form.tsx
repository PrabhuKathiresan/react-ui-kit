import React, { Component, Fragment } from 'react'
import cx from 'classnames'
import get from 'lodash.get'
import isEmpty from 'is-empty'
import Button from '../Button'
import TextInput from '../TextInput'
import DatePicker from '../DatePicker'
import MonthPicker from '../MonthPicker'
import { BasicSelect } from '../Select'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import Alert from '../Alert'
import FormData from './form-data'
import { isGroupField, isNestedField, noopWithReturn, parseTranslationOptions } from './utils'
import { isDefined, isEqual, isFunction, noop } from '../utils'
import { FormFields, FormProps, FormState, AttributesType } from './props'

const SERVICE_METHOD_NOT_AVAILABLE = 'Service method is not configured'

export default class Form extends Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props)
    let {
      fields,
      data,
      abortEarly = true,
      t,
      idField,
      stripUnchanged,
      ignoreDefaultTranslationOption
    } = props
    this.state = {
      formData: new FormData(data, fields, {
        abortEarly,
        t,
        idField,
        stripUnchanged,
        ignoreDefaultTranslationOption
      }),
      errors: {},
      genericError: null,
      submitting: false,
      dirty: false,
      startValidate: false
    }
  }

  get t() {
    let { t = noopWithReturn } = this.props
    return t
  }

  get hasTranslation() {
    return !isEmpty(this.t)
  }

  get formData() {
    return this.state.formData
  }

  get data() {
    return this.formData.data
  }

  get isNew() {
    return this.formData.isNew
  }

  get _id() {
    return this.formData._id
  }

  get changedAttributes(): AttributesType {
    return this.formData.changedAttributes()
  }

  get dirty(): boolean {
    return this.formData.hasDirtyAttributes()
  }

  get isValid(): boolean {
    return this.formData.isValid
  }

  get disableSubmit(): boolean {
    let {
      submitOnlyIfValid = false
    } = this.props
    return this.processingForm || !this.dirty || (submitOnlyIfValid && !this.isValid)
  }

  get processingForm(): boolean {
    let { submitting } = this.state
    let { loading, disabled } = this.props
    return Boolean(loading || submitting || disabled)
  }

  componentDidUpdate(prevProps: FormProps) {
    let { data } = this.props
    if (!isEqual(prevProps.data, data)) {
      let formData = this.formData.update(data)
      this.setState({
        formData
      })
    }
  }

  serialize = () => {
    return this.formData.serialize({ stripUnknown: true })
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.setState({ startValidate: true })
    if (!this.isValid) {
      let {
        errors,
        genericError
      } = this.formData.validate()
      return this.setState({ errors, genericError })
    }
    this.setState({ errors: {}, genericError: null })
    let data = this.serialize()
    let { onSubmit, constructParams } = this.props
    if (typeof constructParams === 'function') data = constructParams(data)
    if (onSubmit && isFunction(onSubmit)) {
      return onSubmit(data, {
        data: this.formData.data,
        _id: this.formData._id
      })
    }

    let {
      service = {},
      createMethod = 'create',
      updateMethod = 'update',
      onSuccess = noop,
      onError = noop
    } = this.props

    let serviceMethod, params
    if (this.isNew) {
      serviceMethod = service[createMethod]
      params = [data]
    } else {
      serviceMethod = service[updateMethod]
      params = [this._id, data]
    }

    if (serviceMethod && isFunction(serviceMethod)) {
      this.setState({ submitting: true })

      return serviceMethod(...params)
        .then((response: any) => onSuccess(response))
        .catch((error: any) => onError(error.message))
        .finally(() => this.setState({ submitting: false, startValidate: false }))
    }

    onError(SERVICE_METHOD_NOT_AVAILABLE)
    this.setState({ genericError: SERVICE_METHOD_NOT_AVAILABLE })
  }

  handleInputChange = (name: string, value: any) => {
    let updates = this.beforeUpdate({ [name]: value })
    let formData = this.formData?.updateAttributes(updates)
    this.setState({ formData })
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  handleCheckboxChange = (name: string, e: any) => {
    let { value } = e.target
    let values = get(this.data, name)
    let index = values.indexOf(value)
    index !== -1 ? values.splice(index, 1) : values.push(value)
    this.handleInputChange(name, [...values])
  }

  beforeUpdate = (updates: object) => {
    if (this.props.beforeUpdate) {
      updates = this.props.beforeUpdate(updates, this.formData.data) || updates
    }

    return updates
  }

  renderField = (field: FormFields, parentKey: string = '') => {
    let { name: formName } = this.props
    let { errors } = this.state
    let {
      type = 'text',
      component = 'TextInput',
      componentProps = {},
      disabled = false,
      required = false,
      disabledIf = () => false,
      hiddenIf = () => false,
      label,
      placeholder = componentProps.placeholder,
      message = componentProps.message,
      name,
      maxLength,
      customComponent = null,
      transform,
      errorMessage,
      translate,
      translateOptions = {},
      ...restProps
    } = field

    if (this.hasTranslation) {
      if (!this.props.ignoreDefaultTranslationOption) {
        translateOptions = { entity: label, ...translateOptions }
      }
      translateOptions = parseTranslationOptions(translateOptions, this.t)
      if (label) label = this.t(label, translateOptions)
      if (placeholder) placeholder = this.t(placeholder, translateOptions)
      if (message) message = this.t(message, translateOptions);
    }

    let customOptions = { _id: this._id, isNew: this.isNew }

    if (hiddenIf(this.data, customOptions)) return null

    name = parentKey ? `${parentKey}.${name}` : name

    let error = get(errors, name)

    disabled = disabledIf(this.data, customOptions) || disabled

    let inputProps: any = {
      ...restProps,
      ...componentProps,
      disabled,
      required,
      label,
      placeholder,
      type,
      name: `${formName}[${name}]`,
      id: name,
      value: get(this.data, name),
      onChange: (e: any) => {
        let { value } = e.target
        if (value && type === 'number') value = parseFloat(value)
        return this.handleInputChange(name, value)
      },
      error
    }

    let FieldComponent: any = TextInput

    switch (component) {
      case 'TextArea':
        let charLeft = maxLength && (isEmpty(inputProps.value) ? maxLength : maxLength - inputProps.value.length)
        inputProps.maxLength = maxLength
        inputProps.charLeft = charLeft
        inputProps.component = 'textarea'
        inputProps.onKeyDown = this.handleKeyDown
        break
      case 'Select':
        inputProps.labelKey = inputProps.labelKey || 'name'
        inputProps.closeOnOutsideClick = isDefined(inputProps.closeOnOutsideClick) ? inputProps.closeOnOutsideClick : true
        inputProps.selected = Array.isArray(inputProps.value) ? inputProps.value : inputProps.value ? [inputProps.value] : []
        inputProps.onChange = (s: Array<any>) => {
          if (inputProps.multiple) return this.handleInputChange(name, s)
          return this.handleInputChange(name, s[0])
        }
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
        inputProps.onKeyDown = this.handleKeyDown
        break
      case 'TextInput':
      default:
        inputProps.onKeyDown = this.handleKeyDown
        break
    }

    return <FieldComponent {...inputProps} />
  }

  renderFormFields = (fields: Array<FormFields>, parentKey: string = '') => {
    return fields.map((field) => {
      let { name } = field;
      if (isGroupField(field)) {
        let {
          fields: groupFields = [],
          groupTitle,
          groupType = 'column',
          groupClass = ''
        } = field; // nested field props
        return (
          <div className={cx('form-fields-groupped', `groupped-${groupType}`, groupClass)} key={name}>
            {groupTitle && <label className='text-secondary text-bold mb-8'>{groupTitle}</label>}
            {this.renderFormFields(groupFields, isNestedField(field) ? name : '')}
          </div>
        )
      }
      return (
        <Fragment key={name}>
          {
            this.renderField(field, parentKey)
          }
        </Fragment>
      )
    })
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
      loadingText,
      extra = null,
    } = this.props
    let { genericError } = this.state

    let renderableFields = fields.filter(f => !f.hidden)
    return (
      <>
        {
          genericError && <Alert type='error' className='mb-16' dismissable onClose={() => this.setState({ genericError: null })}>{genericError}</Alert>
        }
        <form name={name} data-testid={name} noValidate className={cx('ui-kit-form', { 'form-with-fixed-action': stickyFooter })} onSubmit={this.handleSubmit}>
          <div className='form-fields'>
            {this.renderFormFields(renderableFields)}
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
              disabled={this.disableSubmit}
              loading={this.processingForm}
              loadingText={loadingText}
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
