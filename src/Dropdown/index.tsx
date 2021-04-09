import React, { useState, useImperativeHandle, useEffect, useRef } from 'react';
import cx from 'classnames';
import { DropdownProps, DropdownPosition, OptionItem } from './props';
import Button from '../Button';
import { uniqueId, noop } from '../utils';

const Dropdown = (props: DropdownProps, ref: any) => {
  let {
    options = [], onClick, additionalClass = '', loading = false,
    dropdownClass = '', textContent, icon = {}, children, hasTriggerComponent, id = uniqueId(),
    position = 'right', additionalTriggerClass = '', size = 'sm', offsetTop = 0
  } = props;

  let dropdownOptions = options.filter((option) => !option.hidden);

  let [init, setInit] = useState<boolean>(false);
  let __dropdownActive = useRef<boolean>(true);
  let [open, setOpen] = useState<boolean>(false);
  let [closing, setClosing] = useState<boolean>(false);
  let dropdown = useRef<HTMLUListElement | null>(null);
  let trigger = useRef<HTMLDivElement | null>(null);
  let [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({});

  useEffect(() => {
    return () => {
      __dropdownActive.current = false;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      closeDropdown() {
        if (__dropdownActive.current) {
          setOpen(false);
        }
      }
    }),
    []
  );

  let getRelativePosition = () => {
    if (!trigger.current) return {};
    let rect = trigger.current.getBoundingClientRect();
    let pos: DropdownPosition = {};
    if (position === 'right') {
      pos.right = window.innerWidth - rect.right;
    }
    if (position === 'left') {
      pos.left = rect.left;
    }
    return {
      ...pos,
      top: rect.bottom + 2 + offsetTop
    };
  };

  let toggleDropdown = () => {
    setInit(true);
    setDropdownPosition(getRelativePosition());
    if (!open) {
      addEvtListerner();
    } else {
      removeEvtListener();
    }
    setOpen(!open);
    setClosing(false);
  };

  let closeDropdown = () => {
    if (__dropdownActive.current) {
      setClosing(true);
      setTimeout(() => {
        setOpen(false);
      }, 200);
    }
  };

  let addEvtListerner = () => {
    document.addEventListener('click', handleClickEvt, false);
  };

  let removeEvtListener = () => {
    document.removeEventListener('click', handleClickEvt, false);
  };

  let handleClickEvt = (e: Event) => {
    if (
      dropdown.current &&
      trigger.current &&
      (e.target instanceof HTMLElement || e.target instanceof SVGElement) &&
      !dropdown.current.contains(e.target) &&
      !trigger.current.contains(e.target)
    ) {
      closeDropdown();
    }
  };

  let onMenuClick = (option: OptionItem) => {
    typeof onClick === 'function' && onClick(option);
    setOpen(false);
  };

  return (
    <div data-testid={id} className={cx('ui-dropdown', additionalClass)} ref={ref}>
      <div className='ui-dropdown__trigger'>
        {
          hasTriggerComponent ?
            <div ref={trigger} data-testid={`${id}-trigger`} onClick={toggleDropdown} className='cursor-pointer'>
              {textContent}
            </div>
            :
            <Button
              className={additionalTriggerClass}
              icon={icon}
              onClick={toggleDropdown}
              ref={trigger}
              aria-haspopup='true'
              aria-controls='dropdown'
              loading={loading}
              data-testid={`${id}-trigger`}
            >
              {textContent}
            </Button>

        }
      </div>
      {
        open && (
          dropdownOptions && dropdownOptions.length ?
            (<ul style={{ ...dropdownPosition }} data-testid={`${id}-dropdown`} className={cx('ui-dropdown__wrapper', dropdownClass, `dropdown--${size}`, { 'open': open && !closing, 'hidden': closing, 'd-none': !init })} ref={dropdown}>
              {
                dropdownOptions.map((option) => (
                  <li data-testid={option.key} className={cx('dropdown-item cursor-pointer', { 'dropdown-item-disabled': option.disabled })} onClick={option.disabled ? noop : () => onMenuClick(option)} key={option.key}>
                    {
                      <span>{option.name}</span>
                    }
                  </li>
                ))
              }
            </ul>)
            :
            <ul style={{ ...dropdownPosition }} data-testid={`${id}-dropdown`} className={cx('ui-dropdown__wrapper', dropdownClass, `dropdown--${size}`, { 'open': open && !closing, 'hidden': closing, 'd-none': !init })} ref={dropdown}>
              {children}
            </ul>
        )
      }
    </div>
  );
};

export default React.forwardRef(Dropdown);
