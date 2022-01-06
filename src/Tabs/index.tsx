import React, { Component, createRef } from 'react'
import cx from 'classnames'
import Dropdown from '../Dropdown'
import MoreHorizontal from '../icons/more-horizontal'
import { TabsProps, TabProps, TabsState, InternalTab } from './props'
import { stringify } from '../utils'

const getActiveIndex = (tabs: Array<TabProps>, activeTab: number | TabProps) => {
  let index: number
  let tab: TabProps
  if (typeof activeTab === 'number') {
    index = activeTab
    tab = tabs[activeTab]
  } else {
    index = tabs.findIndex(tab => tab.id === activeTab.id)
    tab = tabs[index]
  }
  if (!tab || tab.disabled) index = tabs.findIndex(tab => !tab.disabled)
  return index
}

const getIndexedTabs = (tabs: Array<TabProps>): Array<InternalTab> => [...tabs.filter((tab) => !tab.hidden).map((tab, index) => ({ ...tab, index }))]

export default class Tabs extends Component<TabsProps, TabsState> {
  parentRef = createRef<HTMLDivElement>()
  headerRef = createRef<HTMLDivElement>()
  contentRef = createRef<HTMLDivElement>()
  trackerRef = createRef<HTMLDivElement>()
  moreOptionRef = createRef<HTMLLIElement>()
  tabWidths: Array<number> = []
  totaTabWidth: number = 0

  constructor(props: TabsProps) {
    super(props)
    const {
      activeTab,
      tabs
    } = this.props
    const activeIndex = getActiveIndex(tabs, activeTab)
    const indexedTabs = getIndexedTabs(tabs)
    this.state = {
      activeIndex,
      processedTabs: [...indexedTabs],
      overflowTabs: []
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    const { tabs } = this.props
    this.setState({ ...this.getProcessedTabs(tabs) }, this.updateTracker)
  }

  UNSAFE_componentWillReceiveProps(nextProps: TabsProps) {
    let update: any = {}
    const { tabs, activeTab } = nextProps
    if (stringify(tabs) !== stringify(this.props.tabs)) {
      update = { ...update, ...this.getProcessedTabs(tabs) }
    }
    if (activeTab !== this.props.activeTab) {
      const activeIndex = getActiveIndex(tabs, activeTab)
      update = { ...update, activeIndex }
    }
    this.setState({ ...update }, this.updateTracker)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    if (this.parentRef.current) {
      const { tabs } = this.props
      this.setState({ ...this.getProcessedTabs(tabs) }, this.updateTracker)
    }
  }

  updateTracker = () => {
    let left = 0
    let width: any = 'auto'
    const { processedTabs, activeIndex } = this.state
    if (this.trackerRef.current) {
      for (const [index, tab] of processedTabs.entries()) {
        const tabwidth = tab.overflow ? 0 : this.tabWidths[index]
        if (index < activeIndex) {
          left += tabwidth
        }
        if (activeIndex === index) {
          if (tab.overflow) {
            if (this.moreOptionRef.current) {
              width = this.moreOptionRef.current.clientWidth
            }
          } else {
            width = tabwidth
          }
          break
        }
      }
      this.trackerRef.current.style.width = `${width}px`
      this.trackerRef.current.style.marginLeft = `${left}px`
    }
  }

  getProcessedTabs = (tabs: Array<TabProps>) => {
    const indexedTabs = getIndexedTabs(tabs)
    const overflowTabs: Array<TabProps> = []
    const processedTabs: Array<InternalTab> = [...indexedTabs]
    if (this.tabWidths.length && this.headerRef.current) {
      let overflowing = false
      let width = 0
      const totalWidth = this.headerRef.current.clientWidth - 24 // reducing more option width
      for (const [index, tab] of processedTabs.entries()) {
        width += this.tabWidths[index]
        overflowing = width > totalWidth
        if (overflowing) {
          overflowTabs.push({ ...tab })
          tab.overflow = true
        } else {
          tab.overflow = false
        }
      }
    }
    return {
      overflowTabs,
      processedTabs
    }
  }

  _processLazyUpdate = () => {
    const { processedTabs } = this.state
    if (this.tabWidths.length === processedTabs.length) {
      const { tabs } = this.props
      this.setState({ ...this.getProcessedTabs(tabs) }, this.updateTracker)
    }
  }

  changeActiveIndex = (index: number) => {
    this.setState({ activeIndex: index }, this.updateTracker)
  }

  handleDropdownClick = (tab: any) => {
    this.changeActiveIndex(tab.index)
  }

  render() {
    const {
      activeIndex,
      processedTabs,
      overflowTabs = []
    } = this.state
    const activeItem = processedTabs[activeIndex]

    return (
      <div className='ui-kit-tabs' ref={this.parentRef}>
        <div className='ui-kit-tabs-header' ref={this.headerRef}>
          <ul className='ui-kit-tabs-list element-flex mb-16 pa-0'>
            {
              processedTabs.map((tab: InternalTab, index: number) => (
                <li
                  key={tab.id}
                  className={cx('ui-kit-tabs-item px-16 py-8 element-flex-center', {
                    'ui-kit-tabs-item__active': activeItem.id === tab.id,
                    'ui-kit-tabs-item__disabled': tab.disabled,
                    'd-none': tab.overflow
                  })}
                  role='button'
                  aria-disabled={tab.disabled}
                  tabIndex={tab.disabled ? -1 : 0}
                  onClick={() => !tab.disabled && this.changeActiveIndex(index)}
                  ref={liele => {
                    if (!this.tabWidths[index]) {
                      this.tabWidths[index] = liele?.clientWidth || 0
                      this._processLazyUpdate()
                    }
                  }}
                >
                  {tab.header}
                </li>
              ))
            }
            {
              !!overflowTabs.length && (
                <li ref={this.moreOptionRef} className='ui-kit-tabs-item ui-kit-tabs-item__more-icon-container py-8 element-flex-center'>
                  <Dropdown
                    textContent={<MoreHorizontal />}
                    id='tab-overflow'
                    options={overflowTabs.map(tab => ({
                      key: tab.id,
                      name: tab.header,
                      index: tab.index,
                      disabled: tab.disabled
                    }))}
                    onClick={this.handleDropdownClick}
                    offsetTop={10}
                    position='right'
                    variant='plain'
                    triggerSize='small'
                    additionalTriggerClass='ui-kit-tabs-item_more-icon pa-0'
                  />
                </li>
              )
            }
          </ul>
          <div className='ui-kit-tabs-active-tab-indicator position-absolute w-100'>
            <div className='ui-kit-tabs-active-tab-tracker' ref={this.trackerRef} />
          </div>
        </div>
        <div className='ui-kit-tabs-content' ref={this.contentRef}>
          {activeItem.content}
        </div>
      </div>
    )
  }
}
