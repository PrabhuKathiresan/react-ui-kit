/* eslint-disable no-unused-vars */
import React from 'react'
import { Accordion } from '@pk-design/react-ui-kit'
import AppCode from './AppCode'
import PropsTable from './PropsTable'

const accordionItems = [
  {
    id: '1',
    name: 'Keep everyone up-to-date with email notifications',
    content: <p>Set up automatic emails to notify your agents and customers of any changes to their tickets.</p>
  },
  {
    id: '2',
    name: 'Access relevant customer information with CRM apps',
    content: <p>Display relevant customer information from CRM tools like Salesforce, Highrise, and Freshsales in Freshdesk, so agents have the most context about their customers.</p>
  },
  {
    id: '3',
    name: 'Monitor agent time spent on tickets using time tracking apps',
    content: <p>Apps such as Xero, Quickbooks, and WorkflowMax will help you track the time agents spend on tickets and attach billable hours to them.</p>
  },
  {
    id: '4',
    name: 'Sort incoming tickets using automation',
    content: <p>Learn how to use automations to analyze tickets as they come in, categorize, prioritize and route incoming tickets to the right group or agent.</p>
  },
  {
    id: '5',
    name: 'Automate follow-ups using time triggers',
    content: <p>Set up reminders, and automate escalations using time triggers so your team focuses on the right tickets and resolves them faster. You can also automate periodic checks on tickets to ensure agents follow up on them.</p>
  },
  {
    id: '6',
    name: 'Set resolution targets with SLA',
    content: <p>Define service levels for tickets with different priorities. Set expectations with customers on how it takes to resolve their issues.</p>
  },
];

export default function AccordionComponent() {
  const docItem = [
    {
      id: 'default',
      name: 'Default Accordion',
      content: (
        <div className='row'>
          <div className='col-xl-4 col-lg-6 col-md-6'>
            <Accordion
              items={accordionItems}
              icon={<i className='material-icons-outlined text-big'>add</i>}
              activeIcon={<i className='material-icons-outlined text-big'>remove</i>}
            />
          </div>
          <div className='col-xl-8 col-lg-6 col-md-6'>
            <p>Usage</p>
            <AppCode code={
            `
              import { Accordion } from '@pk-design/react-ui-kit';
              // on render
              <Accordion items={accordionItems} icon='+' activeIcon='-' />
            `
          } />
          </div>
        </div>
      )
    },
    {
      id: 'spacious',
      name: 'Spacious Accordion',
      content: (
        <div className='row'>
          <div className='col-xl-4 col-lg-6 col-md-6'>
            <Accordion items={accordionItems} type='spacious' />
          </div>
          <div className='col-xl-8 col-lg-6 col-md-6'>
            <p>Usage</p>
            <AppCode code={
            `
              import { Accordion } from '@pk-design/react-ui-kit';
              // on render
              <Accordion items={accordionItems} type='spacious' />
            `
          } />
          </div>
        </div>
      )
    },
    {
      id: 'multiple',
      name: 'Multiple Accordion',
      content: (
        <div className='row'>
          <div className='col-xl-4 col-lg-6 col-md-6'>
            <Accordion items={accordionItems} type='spacious' iconPlacement='start' multiple />
          </div>
          <div className='col-xl-8 col-lg-6 col-md-6'>
            <p>Usage</p>
            <AppCode code={
            `
              import { Accordion } from '@pk-design/react-ui-kit';
              // on render
              <Accordion items={accordionItems} type='spacious' iconPlacement='start' multiple />
            `
          } />
          </div>
        </div>
      )
    }
  ]
  return (
    <>
      <div className='mb-16 col-12'>
        <Accordion
          defaultFirstItemOpen
          items={docItem}
          type='spacious'
          variant='plain'
          multiple
          icon={<i className='material-icons-outlined text-big'>chevron_right</i>}
          activeIcon={<i className='material-icons-outlined text-big'>expand_more</i>}
          iconPlacement='start'
        />
      </div>
    </>
  )
}
