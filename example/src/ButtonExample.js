import React, { useState } from 'react'
import { Button, ButtonGroup, Radio, Checkbox, ActionContainer } from '@pk-design/react-ui-kit'

let btnSize = ['tiny', 'small', 'default', 'medium', 'large'];
let themes = ['primary', 'danger', 'warning', 'success', 'default'];
let variants = ['plain', 'outlined', 'filled'];
let iconOptions = [
  { label: 'No icon', value: 'noIcon' },
  { label: 'Show only icon', value: 'iconOnly' },
  { label: 'Icon and text', value: 'textPlusIcon' }
];
let showText = ['noIcon', 'textPlusIcon'];
let iconSizeMap = {
  tiny: 14,
  small: 16,
  default: 18,
  medium: 20,
  large: 24
}

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
    label: 'New invoice',
    onClick: () => {},
    type: 'button',
    extraProps: {
      icon: { left: <i className='material-icons-outlined' style={{ fontSize: iconSizeMap.default }}>add_circle</i> }
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
  let [btnState, setBtnState] = useState({ size: 'default', theme: 'primary', variant: 'filled', text: '', outlined: '' });
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
            label: 'New invoice',
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
    </>
  )
}
