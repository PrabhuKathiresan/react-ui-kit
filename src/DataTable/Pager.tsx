import React from 'react'
import cx from 'classnames'
import NextIcon from '../icons/next'
import PreviousIcon from '../icons/previous'
import { noop } from '../utils'

const Pager = ({
  paginationOptions = { currentPage: 1, limit: 10 },
  itemsCount = 0,
  gotoPreviousPage = noop,
  gotoNextPage = noop,
  hideFooterText = false
}) => {
  const {
    currentPage,
    limit,
  } = paginationOptions

  const lastPage = itemsCount === 0 ? 1 : Math.ceil(itemsCount / limit)

  const startingRecord = () => {
    if (itemsCount === 0) {
      return 0
    }
    return ((Math.max(currentPage, 1) - 1) * limit) + 1
  }

  const endingRecord = () => Math.min((currentPage * Math.min(limit, itemsCount)), itemsCount)
  return (
    <div className='ui-kit-table-pagination'>
      <div className={cx('ui-kit-table-pagination-item ui-kit-hide-md', { 'ui-kit-hide': hideFooterText })}>
        Displaying
        {' '}
        {startingRecord()}
        {' '}
        -
        {' '}
        {endingRecord()}
        {' '}
        of
        {' '}
        {itemsCount}
        {' '}
        records
      </div>
      <div className={cx('ui-kit-table-pagination-item ui-kit-display-md', { 'ui-kit-display': hideFooterText })}>
        <span>
          {startingRecord()}
          {' '}
          - 
          {' '}
          {endingRecord()}
          {' of '}
          {itemsCount}
          {' '}
          records
        </span>
      </div>
      <div className='ui-kit-table-pagination-item'>
        <span className={`ui-kit-table-icon d-flex-justify-center-align-center ui-kit-icon-large ui-kit-pager-icon icon-clickable ${currentPage <= 1 ? 'ui-kit-pager-disabled' : ''}`} onClick={gotoPreviousPage}>
          <PreviousIcon width={20} height={20} />
        </span>
        <span className={`ui-kit-table-icon d-flex-justify-center-align-center ui-kit-icon-large ui-kit-pager-icon icon-clickable ${lastPage === currentPage ? 'ui-kit-pager-disabled' : ''}`} onClick={gotoNextPage}>
          <NextIcon width={20} height={20} />
        </span>
      </div>
    </div>
  )
}

export default Pager
