import { PaginationOption } from './props'

export const DEFAULT_HEADER_HEIGHT = 48
export const DEFAULT_FOOTER_HEIGHT = 48

export const defaultColumnWidth = 120

export const defaultPaginationOptions = () => ({
  currentPage: 1,
  limit: 25,
  options: [10, 25, 50, 100]
})

export const getPaginationOptions = (options?: PaginationOption) => ({
  ...defaultPaginationOptions(),
  ...options
})
