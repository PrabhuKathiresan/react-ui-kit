import React, { CSSProperties, useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import Button from '../Button'
import ChevronUp from '../icons/chevron-up'
import CircleFilled from '../icons/circle-filled'
import CircleOutline from '../icons/circle-outline'
import CarouselItem from './carousel-item'
import { CarouselItemProps, CarouselProps } from './props'
import Timer from '../utils/timer'
import PauseIcon from '../icons/pause-icon'
import PlayIcon from '../icons/play-icon'

export default function Carousel(props: CarouselProps) {
  let {
    items,
    defaultActiveIndex = 0,
    width = 300,
    height = 200,
    itemClass,
    controls = true,
    indicators = false,
    wrapperClass = '',
    containerClass = '',
    edgeSpace = 0,
    itemSpace = '0px',
    transitionType = 'default',
    autoPlay,
    autoPlayInterval = 5000
  } = props
  let [activeIndex, setActiveIndex] = useState<number>(defaultActiveIndex)
  let indexTrackerRef = useRef<number>(defaultActiveIndex)
  let [animate, setAnimate] = useState<boolean>(true)
  let [playing, setPlaying] = useState<boolean>(false)
  let timer = useRef<Timer | null>(null)
  let totalIndex = items.length - 1
  let hasContent = totalIndex >= 0
  let showIndicatorsAndTriggerAutoPlay = indicators && totalIndex >= 1

  let processedItems = items.map((item, index) => ({ ...item, index }))

  let itemsToRender = (): Array<CarouselItemProps> => {
    if (activeIndex === 0) {
      return processedItems.slice(0, 2)
    }
    let start = activeIndex - 1
    let end = Math.min(activeIndex + 2, totalIndex + 1)
    return processedItems.slice(start, end)
  }

  let indicator = (i: number) => i === activeIndex ? <CircleFilled width={12} height={12} /> : <CircleOutline width={12} height={12} />

  let changeCurrentIndex = (i: number, options: any = {}) => {
    let { animate = true, auto = false } = options
    indexTrackerRef.current = i
    if (!auto) timer.current?.restart()
    setAnimate(animate)
    setActiveIndex(i)
  }

  let getInnerStyle = (): CSSProperties => {
    let style: CSSProperties = {
      left: edgeSpace,
      right: edgeSpace
    }
    if (showIndicatorsAndTriggerAutoPlay) style.bottom = 40
    return style
  }

  let handleTimer = () => {
    let currentIndex = indexTrackerRef.current
    let nextIndex = currentIndex + 1
    if (nextIndex > totalIndex) nextIndex = 0
    changeCurrentIndex(nextIndex, { auto: true })
  }

  if (showIndicatorsAndTriggerAutoPlay && !timer.current) {
    timer.current = new Timer({
      callback: handleTimer,
      onStart: () => setPlaying(true),
      onStop: () => setPlaying(false),
      autoStart: true,
      interval: autoPlayInterval
    })
  }

  useEffect(() => {
    return () => timer.current?.stop()
  }, [timer.current])

  let renderContent = () => (
    <>
      <div className={cx('ui-kit-carousel--inner', containerClass)} style={{ ...getInnerStyle() }}>
        {
          itemsToRender().map((carousel: CarouselItemProps) => (
            <CarouselItem
              {...carousel}
              activeIndex={activeIndex}
              itemClass={itemClass}
              animate={animate}
              edgeSpace={edgeSpace}
              is3D={transitionType === '3d'}
              itemSpace={itemSpace}
              key={carousel.index}
            />
          ))
        }
      </div>
      {
        showIndicatorsAndTriggerAutoPlay && (
          <div className='ui-kit-carousel--indicator element-flex-center'>
            {
              items.map((_item, i: number) => (
                <span key={(_item.id || i)} className='mx-4 ui-kit-carousel--indicator-icon' role='button' onClick={() => changeCurrentIndex(i, { animate: false })}>
                  {indicator(i)}
                </span>
              ))
            }
            {
              autoPlay && (
                <>
                  {
                    playing ? (
                      <span className='mx-4 ui-kit-carousel--indicator-icon' role='button' onClick={() => timer.current?.stop()}>
                        <PauseIcon />
                      </span>
                    ) : (
                      <span className='mx-4 ui-kit-carousel--indicator-icon' role='button' onClick={() => timer.current?.start()}>
                        <PlayIcon />
                      </span>
                    )
                  }
                </>
              )
            }
          </div>
        )
      }
      {
        controls && (
          <>
            <Button className='ui-kit-carousel--controls left-control' variant='plain' iconOnly disabled={activeIndex === 0} onClick={() => changeCurrentIndex(activeIndex - 1)}>
              <ChevronUp className='rotate-270' />
            </Button>
            <Button className='ui-kit-carousel--controls right-control' variant='plain' iconOnly disabled={(activeIndex === totalIndex)} onClick={() => changeCurrentIndex(activeIndex + 1)}>
              <ChevronUp className='rotate-90' />
            </Button>
          </>
        )
      }
    </>
  )

  let renderEmptyState = () => (
    <div className={cx('ui-kit-carousel--inner', containerClass)} style={{ ...getInnerStyle() }}>
      <div className='ui-kit-carousel--item element-flex-center flex-column'>
        <div className='ui-kit-empty-state' />
        <p>No slides available</p>
      </div>
    </div>
  )

  return (
    <div className={cx('ui-kit-carousel', wrapperClass)} style={{ width, height }}>
      {hasContent ? renderContent() : renderEmptyState()}
    </div>
  )
}
