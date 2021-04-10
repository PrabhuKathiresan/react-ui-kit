export interface FormFields {
  name: string;
  label?: string;
  getter?: Function;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  type?: string;
  component?: 'TextInput' | 'TextArea' | 'Checkbox' | 'Checkbox.Group' | 'Select' | 'Radio' | 'Radio.Group';
  componentProps?: object;
  disabledIf?: Function;
  requiredIf?: Function;
  hiddenIf?: Function;
  onInputChange?: Function;
  validation?: Function;
  formatter?: Function;
  validationProps?: object;
  editable?: boolean;
  [k: string]: any;
}

export interface FormState {
  formData?: any;
  errors?: object;
  submitting?: boolean;
  dirty?: boolean;
}

export interface IconProps {
  left?: any;
  right?: any;
}

export interface ServiceProps {
  [k: string]: Function;
}

export interface FormProps {
  onSubmit?: Function;
  service?: ServiceProps;
  createMethod?: string;
  updateMethod?: string;
  fields: Array<FormFields>;
  data: object;
  stickyFooter?: boolean;
  loading?: boolean;
  disabled?: boolean;
  isNewForm?: boolean;
  submitBtnText?: string;
  submitBtnIcon?: IconProps;
  showCancelBtn?: boolean;
  cancelBtnText?: string;
  cancelBtnIcon?: IconProps;
  onCancel?: Function;
  name: string;
  dataId?: any;
  onSuccess?: Function;
  onError?: Function;
}
