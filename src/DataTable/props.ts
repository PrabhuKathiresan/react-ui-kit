export interface PaginationOption {
  currentPage: number;
  limit: number;
  options: Array<number>;
}

export interface SortedColumn {
  name: string;
  property: string | Function;
  direction: 'ASC' | 'DESC';
}

export interface ColumnProps {
  name?: string;
  accessor?: string | Function;
  useSort?: string;
  useFilter?: string;
  width?: number;
  sortable?: boolean;
  type?: string;
  filterable?: boolean;
  hidden?: boolean;
  hideDisabled?: boolean;
  selectColumn?: boolean;
  selectionColumn?: boolean;
  selected?: Function;
  [k: string]: any;
}

export interface ColumnItemProps {
  selected: boolean;
  name: string;
  disabled?: boolean;
  onClick: Function;
}

export interface TableProps {
  width?: number | string;
  height?: number | string;
  paginate?: boolean;
  paginationOptions?: PaginationOption;
  columns: Array<ColumnProps>;
  defaultSortedColumns?: Array<SortedColumn>;
  selected?: Array<any>;
  onSelect?: Function;
  onSelectAll?: Function;
  clearSelection?: Function;
  data: Array<object>;
  headerHeight?: number;
  footerHeight?: number;
  loading?: boolean;
  showColumnSelection?: boolean;
  onColumnChange?: Function;
  emptyText?: string;
  emptyIcon?: any;
  selectable?: boolean;
  fixedWidth?: boolean;
  variant?: 'striped' | 'bordered' | 'borderless';
  onRefresh?: Function;
  toggleRowSelect?: Function;
  async?: boolean;
  filters?: Array<any>;
  id: string;
  hideFooterText?: boolean;
  headerBorderless?: boolean;
  columnSelectionIcon?: any;
}

export interface TableState {
  paginate: boolean;
  paginationOptions: PaginationOption;
  sortedColumns: Array<SortedColumn>;
  showSettings: boolean;
  selectedPages: object;
  partiallySelectedPages: object;
  selectAll?: boolean;
}

export interface InternalTableState {
  paginate?: boolean;
  paginationOptions?: PaginationOption;
  sortedColumns?: Array<SortedColumn>;
  showSettings?: boolean;
  selectedPages?: object;
  partiallySelectedPages?: object
  sortColumn: Function;
  getSelectedState: Function;
  toggleColumnSettings: Function;
  toggleSelectAll: Function;
}

export interface SelectColumnProps {
  selected: string | boolean;
  header: boolean;
  onChange: Function;
}

export interface SortedColumnProps {
  sortedColumns: Array<SortedColumn>;
  column: ColumnProps;
}

export interface AsyncTableState {
  data?: Array<any>;
  total?: number;
  loading?: boolean;
  progressing?: boolean;
  paginate?: boolean;
  paginationOptions: PaginationOption;
  sortedColumns?: Array<SortedColumn>;
  selected?: Array<any>;
  selectAll?: boolean;
  showSettings?: boolean;
}

export interface AsyncProps extends TableProps {
  loadingHandler?: Function;
  additionalParams?: object;
  showProgress?: boolean;
  service: {
    get: Function;
  }
}

export interface ServiceResponseProps {
  data: Array<any>;
  total: number;
}
