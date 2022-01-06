import React, { CSSProperties } from 'react'
import cx from 'classnames'
import { CarouselItemProps } from './props'

interface itemProps {
  activeIndex: number
  itemClass?: string
  animate?: boolean
  is3D?: boolean
}

export default function CarouselItem(itemProps: CarouselItemProps & itemProps) {
  let {
    renderer,
    activeIndex,
    itemClass = '',
    contentWrapperClass = '',
    animate = true,
    backgroundImage = '',
    maskImage = '',
    edgeSpace = 0,
    is3D,
    itemSpace,
    ...props
  } = itemProps

  if (typeof itemSpace === 'number') itemSpace = `${itemSpace}px`

  let { index = -1 } = props

  let get3dStyle = (): CSSProperties => {
    let x: any
    let y: any = 0
    let z: any = 0
    let zIndex = 20
    let scale = .85
    let rotateY = '0deg'
    if (index === activeIndex) {
      x = 0
      zIndex = 10
      scale = 1
    } else if (index < activeIndex) {
      x = '-100%'
      rotateY = '40deg'
    } else {
      x = '100%'
      rotateY = '-40deg'
    }
    let style: CSSProperties = {
      transform: `translate3d(${x}, ${y}, ${z}) scale(${scale}) rotateY(${rotateY}) perspective(1200px)`,
      zIndex,
      left: itemSpace,
      right: itemSpace,
      top: itemSpace,
      bottom: itemSpace
    }

    return style
  }

  let getStyle = (): CSSProperties => {
    let style: CSSProperties
    if (is3D) {
      style = get3dStyle()
    } else {
      let x: any
      let zIndex = 6
      if (index === activeIndex) {
        x = 0
        zIndex = 10
      } else if (index < activeIndex) {
        x = `calc(-100% - ${itemSpace})`
      } else {
        x = `calc(100% + ${itemSpace})`
      }
      style = {
        transform: `translateX(${x})`,
        zIndex
      }
    }

    if (backgroundImage) {
      style.backgroundImage = `url(${backgroundImage})`
      style.backgroundSize = 'cover'
    }

    if (!animate) style.transition = 'none'

    return style
  }

  let getBgMaskStyle = () => {
    return {
      backgroundImage: `url(${maskImage})`,
      backgroundSize: 'cover'
    }
  }

  return (
    <div className={cx('ui-kit-carousel--item', itemClass, contentWrapperClass)} style={{ ...getStyle() }}>
      {
        renderer ? renderer(props) : (
          <>{props.content}</>
        )
      }
      {
        maskImage && <div className='ui-kit-carousel--item-mask full-absolute z-index--1' style={{ ...getBgMaskStyle() }} />
      }
    </div>
  )
}
