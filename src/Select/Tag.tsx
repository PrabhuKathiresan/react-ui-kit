import React from 'react'
import cx from 'classnames'
import Close from '../icons/close'

interface TagProps {
  children: any,
  closeable?: boolean,
  onClose?: Function,
  id: any,
  disabled?: boolean
}

const Tag = (props: TagProps) => {
  let { children, closeable, onClose, id, disabled } = props;
  return (
    <span className={cx('ui-kit-select--tag', { 'ui-kit-select--tag-disabled': disabled })} data-testid={id}>
      <span className={cx('ui-kit-select--tag_text', { closeable })}>{children}</span>
      {
        closeable && (
        <span role='button' tabIndex={-1} className='ui-kit-select--tag_close' onClick={() => onClose && onClose()}>
          <Close />
        </span>
      )}
    </span>
  )
}

export default Tag;
