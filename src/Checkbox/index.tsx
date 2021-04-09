import InternalCheckbox from './Checkbox'
import CheckboxGroup from './CheckboxGroup'
import { CheckboxProps } from './props'

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>> {
  Group: typeof CheckboxGroup;
}

const Checkbox = InternalCheckbox as CompoundedComponent
Checkbox.Group = CheckboxGroup

export default Checkbox