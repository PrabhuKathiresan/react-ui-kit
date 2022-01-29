export type AccordionType = 'default' | 'spacious'
export type AccordionVariant = 'bordered' | 'plain'

export interface AccordionContent {
  content?: any
  open?: boolean
  isLast?: boolean
}

export interface AccordionItem extends AccordionContent {
  id?: any
  name: string
}

export interface AccordionItemProps extends AccordionItem {
  onClick: Function
  index: number
  activeIndex: Array<number>
  total: number
  type?: AccordionType
  variant?: AccordionVariant
  icon?: any
  activeIcon?: any
  iconPlacement?: 'start' | 'end'
  transitionDuration: number
}

export interface AccordionProps {
  items: Array<AccordionItem>
  defaultFirstItemOpen?: boolean
  wrapperClass: string
  multiple?: boolean
  keepOpen?: boolean
  type?: AccordionType
  variant?: AccordionVariant
  icon?: any
  activeIcon?: any
  iconPlacement?: 'start' | 'end'
  transitionDuration?: number
}
