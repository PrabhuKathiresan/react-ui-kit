export const MULTI_VALUE_FIELDS = ['Select', 'Checkbox.Group']
export const BOOLEAN_FIELDS = ['Checkbox']
export const emailRegex = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isDateField = (component: string = '', type: string = '') => 
  ['MonthPicker', 'DatePicker'].includes(component) || ['date', 'datetime'].includes(type)

export const isBooleanField = (component: string = '', type: string = '') => {
  return BOOLEAN_FIELDS.includes(component) || ['boolean', 'bool'].includes(type)
}

export const isSelectField = (component: string = '', multiple: boolean = false) => (component === 'Select' && !multiple)

export const isMultiValueField = (component: string = '', multiple: boolean = false) => {
  return MULTI_VALUE_FIELDS.includes(component) && !isSelectField(component, multiple);
}
