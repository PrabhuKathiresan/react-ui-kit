import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Tabs, TextInput } from '@pk-design/react-ui-kit'
import { times } from 'lodash'

const disabledTabs = [1, 4];
const TABS = []
const tabItem = (i) => ({
  id: i,
  header: `Tab ${i + 1}`,
  content: `Content for tab ${i + 1}`,
  disabled: disabledTabs.includes(i)
})
times(8, (i) => {
  TABS.push(tabItem(i))
})

export default function TabsComponent() {
  const [tabs, setTabs] = useState([...TABS])
  const [hideTab, setHideTab] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const addTab = () => {
    let i = tabs.length
    setTabs([...tabs, tabItem(i)])
  }

  useEffect(() => {
    const index = 1
    const _tabs = JSON.parse(JSON.stringify(tabs))
    _tabs[index].hidden = hideTab
    setTabs([..._tabs])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideTab])
  
  return (
    <div className='row'>
      <h4>Tabs</h4>
      <hr />
      <div className='row gx-4 gy-2'>
        <div className='col-lg-8'>
          <h6>Basic tabs</h6>
          <br />
          <div className='mb-24'>
            <TextInput
              type='number'
              value={activeTab}
              label='Active tab'
              min={0}
              max={(tabs.length - 1)}
              onChange={e => setActiveTab(parseInt(e.target.value))}
            />
            <Button className='mb-16' onClick={() => addTab()}>Add Tab</Button>
            <br />
            <Checkbox checked={hideTab} name='hide-tab' onChange={e => setHideTab(e.target.checked)}>Hide Tab 2</Checkbox>
          </div>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  )
}
