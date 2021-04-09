export interface FormFields {
  name: string;
  label?: string;
  getter?: Function;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  component?: 'TextInput' | 'TextArea' | 'Checkbox' | 'Checkbox.Group' | 'Select' | 'Radio' | 'Radio.Group';
  componentProps?: object;
  disabledIf?: Function;
  requiredIf?: Function;
  hiddenIf?: Function;
  onInputChange?: Function;
  validation?: Function;
  formatter?: Function;
  [k: string]: any
}

export interface FormState {
  formData?: any;
  errors?: object;
}

export interface FormProps {
  onSubmit: Function;
  fields: Array<FormFields>;
  data: object;
  stickyFooter?: boolean;
  loading?: boolean;
  disabled?: boolean;
  isNewForm?: boolean;
}
