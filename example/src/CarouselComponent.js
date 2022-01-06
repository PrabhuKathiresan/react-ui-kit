import React from 'react'
import { Carousel } from '@pk-design/react-ui-kit'

const CarouselItems = [
  {
    id: '1',
    content: (
      <>
        <h1>Title 1</h1>
        <p>Content 1</p>
      </>
    ),
    backgroundImage: 'https://splidejs.com/images/slides/general/01.jpg',
    contentWrapperClass: 'text-white shadow border-radius'
  },
  {
    id: '2',
    content: (
      <>
        <h1>Title 2</h1>
        <p>Content 2</p>
      </>
    ),
    backgroundImage: 'https://splidejs.com/images/slides/general/08.jpg',
    contentWrapperClass: 'text-white shadow border-radius'
  },
  {
    id: '3',
    content: (
      <>
        <h1>Title 3</h1>
        <p>Content 3</p>
      </>
    ),
    backgroundImage: 'https://splidejs.com/images/slides/general/03.jpg',
    contentWrapperClass: 'text-white shadow border-radius'
  },
  {
    id: '4',
    content: (
      <>
        <h1>Title 4</h1>
        <p>Content 4</p>
      </>
    ),
    backgroundImage: 'https://splidejs.com/images/slides/general/04.jpg',
    contentWrapperClass: 'text-white shadow border-radius'
  },
  {
    id: '5',
    content: (
      <>
        <h1>Title 5</h1>
        <p>Content 5</p>
      </>
    ),
    backgroundImage: 'https://splidejs.com/images/slides/general/05.jpg',
    contentWrapperClass: 'text-white shadow border-radius'
  }
]

export default function CarouselComponent() {
  return (
    <>
      <div className='mb-24 col-xl-10'>
        <h4>Carousel</h4>
        <br />
        <Carousel
          items={CarouselItems}
          controls
          itemClass='element-flex justify-center align-center flex-column'
          height={400}
          width='100%'
          edgeSpace={60}
          containerClass='border-radius'
          itemSpace={20}
          indicators
          autoPlay
        />
      </div>

      <div className='mb-24 col-xl-10'>
        <h4>Carousel 3D effect</h4>
        <br />
        <Carousel
          items={CarouselItems}
          controls
          itemClass='element-flex justify-center align-center flex-column'
          height={400}
          width='100%'
          edgeSpace={60}
          itemSpace={20}
          transitionType='3d'
        />
      </div>

      <div className='mb-24 col-xl-10'>
        <h4>Carousel (with no items)</h4>
        <br />
        <Carousel
          items={[]}
          controls
          itemClass='element-flex justify-center align-center flex-column'
          height={400}
          width='100%'
          edgeSpace={60}
          itemSpace={20}
          transitionType='3d'
          containerClass='border border-radius'
        />
      </div>

      <div className='mb-24 col-xl-10'>
        <h4>Carousel (with just one item)</h4>
        <br />
        <Carousel
          items={[CarouselItems[1]]}
          controls
          indicators
          autoPlay
          itemClass='element-flex justify-center align-center flex-column'
          height={400}
          width='100%'
          edgeSpace={60}
          itemSpace={20}
          transitionType='3d'
        />
      </div>
    </>
  )
}
