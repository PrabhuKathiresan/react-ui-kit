import React, { useState } from 'react'
import {
  Button, ButtonGroup, Radio,
  Checkbox, ActionContainer, Select, TextInput
} from '@pk-design/react-ui-kit'
import { Link } from 'react-router-dom'
import AppCode from './AppCode';
import PropsTable from './PropsTable';
import { find } from 'lodash';

const { BasicSelect } = Select;
export const iconSizeMap = {
  tiny: 14,
  small: 16,
  default: 18,
  medium: 20,
  large: 24
}
const HINT_POSITION = [
  {
    name: 'Left',
    key: 'left'
  },
  {
    name: 'Right',
    key: 'right'
  },
  {
    name: 'Top',
    key: 'top'
  },
  {
    name: 'Bottom',
    key: 'bottom'
  }
]

const buttonProps = [
  {
    name: 'loading',
    description: 'Disables button and shows loader icon',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'loadingText',
    description: 'Content to show while displaying',
    type: 'string',
    default: 'null'
  },
  {
    name: 'disabled',
    description: 'Disables the button',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'className',
    description: 'Button classname',
    type: 'string',
    default: ''
  },
  {
    name: 'theme',
    description: 'Button theme',
    type: 'sting',
    default: 'default',
    options: `'primary' | 'danger' | 'success' | 'warning' | 'default'`
  },
  {
    name: 'variant',
    description: 'Button variant',
    type: 'string',
    default: `filled if theme is not default else null`,
    options: `'plain' | 'outlined' | 'filled'`
  },
  {
    name: 'size',
    description: 'Button size',
    type: 'string',
    default: 'default',
    options: `'tiny' | 'small' | 'default' | 'medium' | 'large'`
  },
  {
    name: 'block',
    description: 'Is block button (will take all available space of the parent)',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'bold',
    description: 'Button font weight bold',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'iconOnly',
    description: 'Does button contains only icon',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'raised',
    description: 'Raised button',
    type: 'boolean',
    default: 'false'
  },
  {
    name: 'iconTheme',
    description: 'Disables the button',
    type: 'string',
    default: '',
    options: `'primary' | 'danger' | 'warning'`
  },
  {
    name: 'icon',
    description: 'Icon to be displayed on button',
    type: '{}',
    default: '{}',
    options: `
      {
        left: 'Left icon',
        right: 'Right icon'
      }
    `
  }
]

const buttonGroupProps = [
  {
    name: 'containerClass',
    description: 'Button group container class',
    type: 'string',
    default: ''
  },
  {
    name: 'theme',
    description: 'Button theme',
    type: 'sting',
    default: 'default',
    options: `'primary' | 'danger' | 'success' | 'warning' | 'default'`
  },
  {
    name: 'variant',
    description: 'Button variant',
    type: 'string',
    default: `filled if theme is not default else null`,
    options: `'plain' | 'outlined' | 'filled'`
  },
  {
    name: 'size',
    description: 'Button size',
    type: 'string',
    default: 'default',
    options: `'tiny' | 'small' | 'default' | 'medium' | 'large'`
  },
  {
    name: 'justify',
    description: 'Horizontal button alignments',
    type: 'string',
    default: 'left',
    options: `'right' | 'left' | 'center'`
  },
  {
    name: 'align',
    description: 'Vertical button alignments',
    type: 'string',
    default: 'center',
    options: `'top' | 'bottom' | 'center'`
  },
  {
    name: 'gap',
    description: 'Horizontal button spacing',
    type: 'string',
    default: '',
    options: `'small' | 'medium' | 'large'`
  },
  {
    name: 'verticalSpacing',
    description: 'Vertical button spacing',
    type: 'string',
    default: '',
    options: `'top' | 'bottom' | 'both'`
  },
  {
    name: 'actions',
    description: 'List of action button to be displayed',
    type: 'Array of ButtonGroupActionProps',
    default: '[]'
  }
]

const buttonGroupActionProps = [
  {
    name: 'label',
    description: 'Button text/label',
    type: 'any'
  },
  {
    name: 'onClick',
    description: 'On button click',
    type: 'function',
    default: 'noop'
  },
  {
    name: 'type',
    description: 'Type of button to display',
    type: 'string',
    default: 'button',
    options: `'button' | 'dropdown' | 'custom'`
  },
  {
    name: 'component',
    description: 'Component to be rendered',
    type: 'any',
    default: 'button'
  },
  {
    name: 'options',
    description: 'If type is dropdown, this options will be used as dropdown items',
    type: 'Array of dropdown OptionItem',
    default: []
  },
  {
    name: 'dropdownPosition',
    description: 'Position of the dropdown',
    type: 'string',
    default: 'left',
    options: `'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'right' | 'left'`
  },
  {
    name: 'extraProps',
    description: 'Extra props that can be passed to the action component',
    type: 'any',
    default: '{}'
  }
]

let btnSize = ['tiny', 'small', 'default', 'medium', 'large'];
let themes = ['primary', 'danger', 'warning', 'success', 'default'];
let variants = ['plain', 'outlined', 'filled'];
let iconOptions = [
  { label: 'No icon', value: 'noIcon' },
  { label: 'Show only icon', value: 'iconOnly' },
  { label: 'Icon and text', value: 'textPlusIcon' }
];
let showText = ['noIcon', 'textPlusIcon'];

const options = [
  {
    key: 'option1',
    name: 'Action 1'
  },
  {
    key: 'option2',
    name: 'Action 2'
  },
  {
    key: 'option3',
    name: 'Action 3'
  },
  {
    divider: true
  },
  {
    key: 'option4',
    name: 'Another action 1'
  },
  {
    key: 'option5',
    name: 'Another action 2'
  }
]

const ButtonGroupOptions = [
  {
    label: 'New',
    component: Link,
    onClick: () => {},
    type: 'button',
    extraProps: {
      icon: { left: <i className='material-icons-outlined' style={{ fontSize: iconSizeMap.default }}>add_circle</i> },
      'data-testid': 'new-btn',
      to: '/select',
    }
  },
  {
    label: 'Refresh',
    onClick: () => {},
    type: 'button',
    extraProps: {
      icon: { left: <i className='material-icons-outlined' style={{ fontSize: iconSizeMap.default }}>refresh</i> }
    }
  },
  {
    label: 'Filter',
    onClick: () => {},
    type: 'button',
    extraProps: {
      icon: { left: <i className='material-icons-outlined' style={{ fontSize: iconSizeMap.default }}>filter</i> }
    }
  },
  {
    label: <i className='material-icons-outlined' style={{ fontSize: iconSizeMap.default }}>more_vert</i>,
    onClick: () => {},
    type: 'dropdown',
    dropdownPosition: 'right',
    options,
    extraProps: {
      id: 'dropdown',
      offsetTop: 5,
      iconOnly: true
    }
  }
]

export default function ButtonExample() {
  let [btnState, setBtnState] = useState({ size: 'default', theme: 'primary', variant: 'filled', text: '', outlined: '', hint: '', hintPosition: 'top' });
  let [btnCheckState, setBtnCheckState] = useState({ icon: 'noIcon', iconTheme: '', block: false, raised: false, loading: false, disabled: false })
  let themeOptions = themes.map(theme => ({ label: theme, value: theme }));
  let [showSubAction, setShowSubAction] = useState(false)

  let icon = (
    <i className='material-icons-outlined' style={{ fontSize: iconSizeMap[btnState.size] }}>add_circle</i>
  )

  let mainAction = (
    <div className='w-100 text-center'>
      <Button className='mr-8'>Main action 1</Button>
      <Button className='mr-8'>Main action 2</Button>
      <Button className='mr-8'>Main action 3</Button>
    </div>
  )

  let subAction = (
    <ButtonGroup
      theme='default'
      size='default'
      variant='filled'
      containerClass='w-100'
      justify='center'
      actions={[
        {
          label: 'Sub action 1',
          onClick: () => {},
          type: 'button'
        },
        {
          label: 'Sub action 2',
          onClick: () => {},
          type: 'button'
        },
        {
          label: 'Sub action 3',
          onClick: () => {},
          type: 'button'
        }
      ]}
    />
  )

  let hintPosition = find(HINT_POSITION, { key: btnState.hintPosition });

  return (
    <>
      <div className='mb-16 col-lg-6'>
        <h4>Buttons</h4>
        <hr />
        <div className='mb-40'>
          <div className='mb-8'>
            <label className='mb-8'>Button size</label>
            <Radio.Group
              value={btnState.size}
              onChange={e => setBtnState(_state => ({ ..._state, size: e.target.value }))}
              options={btnSize.map(size => ({ label: size, value: size }))}
            />
          </div>
          <div className='mb-8'>
            <label className='mb-8'>Button theme</label>
            <Radio.Group
              value={btnState.theme}
              onChange={e => setBtnState(_state => ({ ..._state, theme: e.target.value }))}
              options={themeOptions}
            />
          </div>
          <div className='mb-8'>
            <label className='mb-8'>
              Variants
              {Boolean(btnState.variant) && <span className='ml-8' role='button' onClick={() => setBtnState(_state => ({ ..._state, theme: 'plain', variant: '' }))}>clear</span>}
            </label>
            <Radio.Group
              value={btnState.variant}
              onChange={e => setBtnState(_state => {
                let key = e.target.value;
                let update = {
                  variant: key,
                  [key]: 'primary'
                }
                if (key === 'text') {
                  update.theme = 'plain';
                  update.outlined = '';
                } else {
                  update.text = '';
                }
                return { ..._state, ...update }
              })}
              options={variants.map(variant => ({ label: variant, value: variant }))}
            />
          </div>
          <div className='mb-8'>
            <label className='mb-8'>Icon options</label>
            <Radio.Group
              value={btnCheckState.icon}
              onChange={e => setBtnCheckState(_state => ({ ..._state, icon: e.target.value }))}
              options={iconOptions}
            />
          </div>
          <div className='mb-8'>
            <Checkbox id='block' name='block' checked={btnCheckState.block} onChange={e => setBtnCheckState(_state => ({ ..._state, block: e.target.checked }))}>
              Block button
            </Checkbox>
            <Checkbox id='raised' name='raised' checked={btnCheckState.raised} onChange={e => setBtnCheckState(_state => ({ ..._state, raised: e.target.checked }))}>
              Raised button
            </Checkbox>
            <Checkbox id='loading' name='loading' checked={btnCheckState.loading} onChange={e => setBtnCheckState(_state => ({ ..._state, loading: e.target.checked }))}>
              Enable loading
            </Checkbox>
            <Checkbox id='disabled' name='disabled' checked={btnCheckState.disabled} onChange={e => setBtnCheckState(_state => ({ ..._state, disabled: e.target.checked }))}>
              Disable button
            </Checkbox>
          </div>
          <div className='mb-8 d-flex'>
            <TextInput label='Hint text' value={btnState.hint} onChange={(e) => setBtnState((_current) => ({
              ..._current,
              hint: e.target.value
            }))} placeholder='enter hint text' />
            <BasicSelect
              options={[...HINT_POSITION]}
              labelKey='name'
              selected={hintPosition ? [hintPosition] : []}
              onChange={([_position]) => setBtnState((_current) => ({
                ..._current,
                hintPosition: _position.key
              }))}
              label='Hint position'
              containerClass='ml-8'
            />
          </div>
        </div>
        <div className='example-btn-block mb-16'>
          <Button
            {...btnState}
            iconOnly={btnCheckState.icon === 'iconOnly'}
            icon={{ left: btnCheckState.icon === 'textPlusIcon' ? icon : null }}
            iconTheme={btnCheckState.iconTheme}
            block={btnCheckState.block}
            raised={btnCheckState.raised}
            loading={btnCheckState.loading}
            disabled={btnCheckState.disabled}
          >
            {btnCheckState.icon === 'iconOnly' && icon}
            {showText.includes(btnCheckState.icon) && 'Sample button'}
          </Button>
        </div>
      </div>
      <div className='mb-16 col-lg-6'>
        <h4>Button group</h4>
        <hr />
        <ButtonGroup theme='primary' actions={[
          {
            label: 'New',
            onClick: () => {},
            type: 'button'
          },
          {
            label: <i className='material-icons-outlined' style={{ fontSize: iconSizeMap.default }}>more_vert</i>,
            onClick: () => {},
            type: 'button',
            extraProps: {
              iconOnly: true
            }
          },
          {
            type: 'custom',
            component: <Button>Custom button</Button>
          }
        ]} />
        <hr />
        <ButtonGroup theme='primary' actions={ButtonGroupOptions} />
        <hr />
        <ButtonGroup actions={ButtonGroupOptions} verticalSpacing='both' />
        <hr />
        <ButtonGroup actions={ButtonGroupOptions} size='small' variant='plain' theme='danger' verticalSpacing='top' />
        <hr />
        <ButtonGroup gap={'small'} size='small' actions={ButtonGroupOptions} justify='left' verticalSpacing='bottom' />
        <hr />
        <ButtonGroup gap={'small'} size='small' actions={ButtonGroupOptions} justify='left' verticalSpacing='both' />
        <hr />
        <ButtonGroup gap={'medium'} size='default' actions={ButtonGroupOptions} justify='center' />
        <hr />
        <ButtonGroup gap={'large'} size='medium' actions={ButtonGroupOptions} justify='right' />
      </div>
      <div className='mb-16 col-lg-6'>
        <h4>Action container</h4>
        <hr />
        <Button className='mb-24' onClick={() => setShowSubAction(_s => !_s)}>Show {showSubAction ? 'main' : 'sub'} action</Button>
        <ActionContainer
          content={{
            primary: mainAction,
            secondary: subAction
          }}
          showSecondaryAction={showSubAction}
          containerClass='border border-radius px-16'
        />
      </div>
      <div className='mb-16 col-lg-6'>
        <h4>Link as Button</h4>
        <hr />
        <Button
          component={Link}
          to='/select'
          theme='primary'
        >
          Go to select
        </Button>
      </div>
      <div className='mb-16 col-12'>
        <h4>Usage</h4>
        <AppCode code={
          `
            import { Button, ButtonGroup } from '@pk-design/react-ui-kit';
            // on render
            // button
            <Button theme='primary' variant='filled' onClick={() => {}}>Sample button</Button>
            // button group
            <ButtonGroup actions={[
              {
                label: 'New',
                onClick: () => {},
                type: 'button', // no need to provide this as it is the default value
                extraprops: {
                  'data-testid': 'new-btn'
                }
              },
              // use different component
              {
                label: 'Link as button',
                type: 'button',
                component: 'a' // render anchor tag as button
              },
              // use custom component on buttongroup
              {
                label: '',
                type: 'custom',
                component: <button>Custom button</button>
              },
              // render dropdown
              {
                label: 'More',
                type: 'dropdown',
                options: [
                  {
                    key: 'option1',
                    name: 'Action 1'
                  },
                  {
                    key: 'option2',
                    name: 'Action 2'
                  },
                  {
                    key: 'option3',
                    name: 'Action 3'
                  },
                  {
                    divider: true
                  },
                  {
                    key: 'option4',
                    name: 'Another action 1'
                  },
                  {
                    key: 'option5',
                    name: 'Another action 2'
                  }
                ]
              }
            ]} size='small' variant='plain' theme='danger' verticalSpacing='top' />
          `
        } />
      </div>
      <div className='mb-16 col-12'>
        <h4>Props</h4>
        <h6>Button</h6>
        <PropsTable contents={buttonProps} />
        <h6>Button group</h6>
        <PropsTable contents={buttonGroupProps} />
        <h6>Button group action</h6>
        <PropsTable contents={buttonGroupActionProps} />
      </div>
    </>
  )
}
