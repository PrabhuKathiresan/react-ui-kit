
import React from 'react';
// import { ToastContainerProps } from './props';

interface PositionProps {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  width?: number | string;
  dropup?: boolean;
}

interface MenuContainerProps {
  position: PositionProps;
  children: any;
  dropup: boolean;
  [k: string]: any;
}

const Container = ({
  position,
  children,
  ...props
}: MenuContainerProps, ref: any) => {
  let { top, bottom, left, dropup } = position
  let style: React.CSSProperties = {
    boxSizing: 'border-box',
    maxHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'fixed',
    zIndex: 1000,
    margin: dropup ? '-16px -16px 0' : '0 -16px -16px',
    top,
    left,
    bottom
  }
  return (
    <div
      className="ui-kit-menu__container"
      style={style}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
}

export const MenuContainer = React.forwardRef(Container)
