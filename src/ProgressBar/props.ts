declare type ProgessBarType = 'primary' | 'success' | 'warning' | 'danger'
declare type ProgessBarSize = 'small' | 'default' | 'large'

export interface ProgressBarProps {
  max?: number;
  value: number;
  type?: ProgessBarType;
  size?: ProgessBarSize;
}
