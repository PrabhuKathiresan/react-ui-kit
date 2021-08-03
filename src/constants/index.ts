import { TooltipDirection } from '../Tooltip/props';

export declare type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited'
export declare type InputSize = 'small' | 'default' | 'large'

export interface InputProps {
  id?: string;
  label?: any;
  labelClass?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: any;
  hintPosition?: TooltipDirection;
  message?: any;
  error?: any;
  placeholder?: string;
  inputSize?: InputSize;
  width?: number | string;
  height?: number | string;
}

export const INPUT_KEY = [
  'id', 'label', 'labelClass', 'required', 'disabled', 'hint',
  'hintPosition', 'message', 'error', 'placeholder', 'inputSize',
  'width', 'height'
]