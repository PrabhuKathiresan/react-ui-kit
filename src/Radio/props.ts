export interface InputProps {
  id?: any;
  name?: any;
  value?: any;
  checked?: boolean;
  className?: any;
  disabled?: boolean;
}

export interface RadioProps extends InputProps {
  label: any;
  onChange: Function; 
}

export interface Radio {
  label: any;
  value: any;
}

export interface RadioGroupProps {
  label?: any;
  required?: boolean;
  onChange: Function;
  value: any;
  options: Array<Radio>;
  variant: 'row' | 'column';
}
