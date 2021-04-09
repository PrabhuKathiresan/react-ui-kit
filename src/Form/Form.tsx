import React, { Component } from 'react'
import cx from 'classnames'
import get from 'lodash.get'
import set from 'lodash.set'
import isEmpty from 'is-empty'
import Button from '../Button'
import TextInput from '../TextInput'
import Select from '../Select'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import { isDefined, isFunction } from '../utils'
import { FormFields, FormProps, FormState } from './props'
import { FormValidation, FormData } from './utils'

const MULTI_VALUE_FIELDS = ['Select', 'Checkbox.Group']

const getFormData = (props: FormProps) => {
  let { fields, data } = props
  return fields.reduce((formData, field) => {
    let { name, getter, component = 'TextInput' } = field
    let value = getter && isFunction(getter) ? getter(data) : get(data, name)
    let defaultValue: any = ''
    if (MULTI_VALUE_FIELDS.includes(component)) {
      value = value ? [value] : []
      defaultValue = []
    }
    set(formData, name, value || defaultValue)
    return formData
  }, {})
}

export default class Form extends Component<FormProps, FormState> {
  formValidation: FormValidation
  fieldsHash: any
  constructor(props: FormProps) {
    super(props)
    this.state = {
      formData: getFormData(this.props),
      errors: {}
    }
    this.fieldsHash = this.props.fields.reduce((hash, field) => {
      hash[field.name] = { ...field }
      return hash
    }, {})
    this.formValidation = new FormValidation(this.props.fields)
  }

  getNormalizedData = () => {
    let { formData } = this.state
    let { fields } = this.props

    return new FormData(fields).toJSON(formData)
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let data = this.getNormalizedData()
    let validation = this.formValidation.validate(data)
    if (!validation.isValid) return this.setState({ errors: validation.errors })

    this.setState({ errors: {} })
    this.props.onSubmit(data)
  }

  handleInputChange = (name: string, value: any) => {
    this.setState((state: FormState) => {
      let { formData } = state
      set(formData, name, value)
      return { formData: { ...formData } }
    }, () => {
      let field = this.fieldsHash[name]
      if (isFunction(field.onInputChange)) {
        let normalizedData = this.getNormalizedData()
        let updates = field.onInputChange(normalizedData)
        let { type, ...data } = updates
        if (type === 'update') {
          this.setState((state: FormState) => {
            let { formData } = state
            Object.keys(data).forEach(key => {
              set(formData, key, data[key])
            })
            return { formData: { ...formData } }
          })
        }
      }
    })
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
    })
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
      ...restProps
    } = field

    let data = this.getNormalizedData()
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

    let Component: any = TextInput

    switch (component) {
      case 'TextArea':
        let charLeft = maxLength && (isEmpty(inputProps.value) ? maxLength : maxLength - inputProps.value.length);
        inputProps.maxLength = maxLength
        inputProps.charLeft = charLeft
        inputProps.component = 'textarea'
        break;
      case 'Select':
        inputProps.labelKey = inputProps.labelKey || 'name'
        inputProps.closeOnOutsideClick = isDefined(inputProps.closeOnOutsideClick) ? inputProps.closeOnOutsideClick : true
        inputProps.selected = inputProps.value
        inputProps.onChange = (s: Array<any>) => this.handleInputChange(name, s)
        inputProps.container = 'body'
        delete inputProps.value
        Component = Select
        break;
      case 'Radio':
        Component = Radio
        break;
      case 'Radio.Group':
        Component = Radio.Group
        break;
      case 'Checkbox':
        inputProps.type = 'checkbox'
        inputProps.className = inputProps.className || 'mb-16'
        inputProps.checked = Boolean(inputProps.value)
        delete inputProps.value
        inputProps.onChange = (e: any) => this.handleInputChange(name, e.target.checked)
        Component = Checkbox
        break;
      case 'Checkbox.Group':
        inputProps.onChange = (e: any) => this.handleCheckboxChange(name, e)
        Component = Checkbox.Group
        break;
      case 'TextInput':
      default:
        break;
    }

    return <Component {...inputProps} />
  }

  render() {
    let { fields, stickyFooter } = this.props

    let renderableFields = fields.filter(f => !f.hidden)
    return (
      <>
        <form className={cx('ui-kit-form', { 'form-with-fixed-action': stickyFooter })} onSubmit={this.handleSubmit}>
          <div className='form-fields'>
            {
              renderableFields.map(field => (
                <div key={field.name}>
                  {
                    this.renderField(field)
                  }
                </div>
              ))
            }
          </div>
          <div className={cx('form-action-button', { 'sticky-footer': stickyFooter })}>
            <Button type='submit'>Submit</Button>
          </div>
        </form>
      </>
    )
  }
}
