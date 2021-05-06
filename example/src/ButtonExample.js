/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Button } from '@pk-design/react-ui-kit'

export default function ButtonExample() {
  return (
    <div className='mb-16 col-lg-4'>
      <h4>Buttons</h4>
      <hr />
      <div className='example-btn-block mb-16'>
        <h6 className='mb-16'>Variants</h6>
        <Button>
          Default button
        </Button>
        <Button theme='primary'>
          Primary button
        </Button>
        <Button theme='secondary'>
          Secondary button
        </Button>
        <Button plain>
          Plain button
        </Button>
        <a onClick={() => { }} className='ui-btn as-link' href='#'>Anchor Link</a>
        <Button disabled>Disabled button</Button>
        <Button theme='primary' disabled>Disabled button</Button>
        <Button theme='secondary' disabled>Disabled button</Button>
        <Button block>Block button</Button>
      </div>
      <div className='example-btn-block mb-16'>
        <h6 className='mb-16'>Sizes</h6>
        <Button theme='primary' tiny>
          Tiny
        </Button>
        <Button theme='primary' small>
          Small
        </Button>
        <Button theme='primary'>
          Default
        </Button>
        <Button theme='primary' large>
          Large
        </Button>
      </div>
    </div>
  )
}
