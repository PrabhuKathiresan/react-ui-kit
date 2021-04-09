import { Radio as InternalRadio } from './Radio'
import { RadioGroup } from './RadioGroup'
import { RadioProps } from './props'

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<RadioProps> {
  Group: typeof RadioGroup;
}

const Radio = InternalRadio as CompoundedComponent
Radio.Group = RadioGroup

export default Radio
