export interface CarouselItemProps {
  id?: any
  renderer?: Function
  content?: any
  index?: number
  contentWrapperClass?: string
  backgroundImage?: string
  maskImage?: string
  edgeSpace?: number
  itemSpace?: number | string
}

export interface CarouselProps {
  items: Array<CarouselItemProps>
  controls?: boolean
  indicators?: boolean
  defaultActiveIndex?: number
  width?: string | number
  height?: string | number
  itemClass?: string
  wrapperClass?: string
  containerClass?: string
  edgeSpace?: number
  transitionType?: 'default' | '3d'
  itemSpace?: number | string
  autoPlay?: boolean
  autoPlayInterval?: number
}
