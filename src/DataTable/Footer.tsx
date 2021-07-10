import React, { useState } from 'react';
import cx from 'classnames';
import { BasicSelect } from '../Select';
import Pager from './Pager';
import RefreshIcon from '../icons/refresh-icon';
import ChevronUp from '../icons/chevron-up';

interface PaginationProps {
  currentPage: number;
  limit: number;
  options: Array<number>
}

interface FooterProps {
  paginationOptions: PaginationProps;
  setPaginationLimit: Function;
  refreshTable: Function;
  paginate: boolean;
  height: number | string;
  itemsCount: number;
  gotoNextPage: Function;
  gotoPreviousPage: Function;
  id: string;
  hideFooterText: boolean;
}

export default function Footer(props: FooterProps) {
  let {
    paginationOptions,
    setPaginationLimit,
    refreshTable,
    paginationOptions: { options, limit },
    paginate,
    height,
    itemsCount,
    id,
    hideFooterText
  } = props
  let [pageLimit, setPageLimit] = useState([
    {
      name: `${limit}`,
      key: `${limit}`,
      value: limit
    }
  ])

  let dropdownOptions = options.map(option => ({
    name: `${option}`,
    key: `${option}`,
    value: option
  }))

  let handlePageLimitChange = (selected: any) => {
    setPageLimit(selected)
    let [opt] = selected
    setPaginationLimit(opt.value)
  }

  return (
    <div className='ui-kit-table-footer' style={{ height }}>
      <div className='ui-kit-table-page-info'>

        {
          paginate ? (
            <div className='d-flex-justify-center-align-center'>
              <div className='d-flex-justify-center-align-center mr-16'>
                <span className={cx('ui-kit-hide-md mr-16', { 'ui-kit-hide': hideFooterText })}>
                  Rows per page
                </span>
                <BasicSelect
                  options={dropdownOptions}
                  selected={pageLimit}
                  onChange={(opt: any) => handlePageLimitChange(opt)}
                  labelKey='name'
                  id={`${id}-page-limit-select`}
                  dropup
                  icons={{
                    right: <ChevronUp width='12' height='12' />
                  }}
                  width={64}
                  animate={false}
                  closeOnOutsideClick
                  containerClass='mb-0 w-auto'
                  height={28}
                  textOnly
                  inputClass='text-center pl-4'
                  size='sm'
                />
              </div>
              <Pager
                itemsCount={itemsCount}
                paginationOptions={paginationOptions}
                gotoNextPage={() => props.gotoNextPage(itemsCount)}
                gotoPreviousPage={() => props.gotoPreviousPage(itemsCount)}
                hideFooterText={hideFooterText}
              />
            </div>
          ) :
          (
            <div>
              Displaying 
              {' '}
              {itemsCount}
              {' '}
              records
            </div>
          ) 
        }
      </div>
      <div role='button' tabIndex={0} onClick={(e) => refreshTable(e)} className='ui-kit-table-icon d-flex-justify-center-align-center ui-kit-icon-large icon-clickable'>
        <RefreshIcon />
      </div>
    </div>
  );
}
