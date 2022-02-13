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
import { isDefined, isEqual, isFunction, noop } from '../utils'
import { FormFields, FormProps, FormState, AttributesType } from './props'

const SERVICE_METHOD_NOT_AVAILABLE = 'Service method is not configured'

export default class Form extends Component<FormProps, FormState> {
  fieldsHash: any
  _changedAttributes: any = {}
  constructor(props: FormProps) {
    super(props)
    let { fields, data } = props
    this.state = {
      formData: new FormData(data, fields),
      errors: {},
      genericError: null,
      submitting: false,
      dirty: false,
      startValidate: false
    }
    this.fieldsHash = this.props.fields.reduce((hash, field) => {
      hash[field.name] = { ...field }
      return hash
    }, {})
  }

  get formData() {
    return this.state.formData;
  }

  get data() {
    return this.formData.data;
  }

  get changedAttributes(): AttributesType {
    return this.formData.changedAttributes();
  }

  get dirty(): boolean {
    return this.formData.hasDirtyAttributes();
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
        formData,
        dirty: false
      })
    }
  }

  serialize = (options: any = {}) => {
    return this.formData.serialize(options);
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.setState({ startValidate: true })
    if (!this.isValid) {
      let { strict = false, t } = this.props
      let {
        errors,
        genericError
      } = this.formData.validate({ strict }, t)
      return this.setState({ errors, genericError });
    }
    this.setState({ errors: {}, genericError: null })
    let data = this.serialize()
    let { onSubmit, constructParams } = this.props
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
        .finally(() => this.setState({ submitting: false, startValidate: false }))
    }

    onError(SERVICE_METHOD_NOT_AVAILABLE)
    this.setState({ genericError: SERVICE_METHOD_NOT_AVAILABLE })
  }

  handleInputChange = (name: string, value: any) => {
    let updates = this.beforeUpdate({ [name]: value })
    let formData = this.formData?.updateAttributes(updates)
    console.log(formData)
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
    this.handleInputChange(name, [...values]);
  }

  beforeUpdate = (updates: object) => {
    if (this.props.beforeUpdate) {
      updates = this.props.beforeUpdate(updates) || updates
    }

    return updates;
  }

  renderField = (field: FormFields) => {
    let { errors } = this.state
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

    if (hiddenIf(this.data)) return null

    let error = get(errors, name)

    disabled = disabledIf(this.data) || disabled

    let inputProps: any = {
      ...restProps,
      ...componentProps,
      disabled,
      required,
      label,
      type,
      name,
      id: name,
      value: get(this.data, name),
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
        inputProps.onKeyDown = this.handleKeyDown
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
        inputProps.onKeyDown = this.handleKeyDown
        break
      case 'TextInput':
      default:
        inputProps.onKeyDown = this.handleKeyDown
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
