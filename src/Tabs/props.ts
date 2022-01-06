export interface InternalTab extends TabProps {
  overflow?: boolean
  index?: number
}

export interface TabProps {
  id: any
  header: any
  content: any
  disabled?: boolean
  hidden?: boolean
}

export interface TabsProps {
  tabs: Array<TabProps>
  activeTab: number | TabProps
}

export interface TabsState {
  activeIndex: number
  processedTabs: Array<InternalTab>
  overflowTabs?: Array<InternalTab>
}
