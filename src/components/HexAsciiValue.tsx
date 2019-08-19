import React, {
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import joinClassNames from 'classnames';

import {
  HexEditorClassNames,
  SetSelectionBoundaryCallback,
  SetSelectionRangeCallback,
} from '../types';
import { EDIT_MODE_ASCII } from '../constants';
import { byteToAscii } from '../utils';


interface Props {
  className?: string,
  classNames?: HexEditorClassNames,
  columnIndex?: number,
  formatValue?: (value: number) => string,
  isCursor?: boolean,
  isEditing?: boolean,
  isSelected?: boolean,
  isSelectionCursor?: boolean,
  isSelectionEnd?: boolean,
  isSelectionStart?: boolean,
  offset?: number,
  rowIndex?: number,
  setSelectionEnd?: SetSelectionBoundaryCallback,
  setSelectionRange?: SetSelectionRangeCallback,
  setSelectionStart?: SetSelectionBoundaryCallback,
  style?: React.CSSProperties,
  value?: number | null,
};

const HexByteAscii = forwardRef(({
  className,
  classNames = {},
  formatValue = byteToAscii,
  isCursor,
  isSelected,
  isSelectionCursor,
  isSelectionEnd,
  isSelectionStart,
  offset = 0,
  setSelectionEnd,
  setSelectionRange,
  setSelectionStart,
  style,
  value = 0x00,
}: Props, ref: React.Ref<HTMLDivElement>) => {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (isCursor || isSelectionCursor) {
      setHighlight(true);
      const interval = setInterval(() => {
        setHighlight(prevHighlight => !prevHighlight);
      }, 250);
      return () => {
        clearInterval(interval);
      };
    } else {
      setHighlight(false);
    }
  }, [isCursor, isSelectionCursor]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (setSelectionStart && e.button === 0) {
      if (e.shiftKey) {
        e.preventDefault();
      } else {
        setSelectionStart(offset, EDIT_MODE_ASCII, e);
      }
    }
  }, [offset, setSelectionStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (setSelectionEnd) {
      setSelectionEnd(offset, EDIT_MODE_ASCII, e);
    }
  }, [offset, setSelectionEnd]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (setSelectionRange) {
      if (e.shiftKey) {
        setSelectionRange(null, offset, null, true);
      } else {
        setSelectionRange(offset, null, null, true);
      }
    }
  }, [offset, setSelectionRange]);

  const handleDoubleClick = useCallback(() => {
    if (setSelectionRange) {
      setSelectionRange(offset, offset + 1, null, true);
    }
  }, [offset, setSelectionRange]);

  return (
    <div
      className={joinClassNames(
        className,
        {
          [classNames.cursor || '']: isCursor,
          [classNames.highlight || '']: highlight,
          [classNames.invalid || '']: value == null,
          [classNames.selection || '']: isSelected,
          [classNames.selectionCursor || '']: isSelectionCursor,
          [classNames.selectionEnd || '']: isSelectionEnd,
          [classNames.selectionStart || '']: isSelectionStart,
        },
      )}
      data-offset={offset}
      onClick={setSelectionRange && handleClick}
      onDoubleClick={setSelectionRange && handleDoubleClick}
      onMouseDown={setSelectionStart && handleMouseDown}
      onMouseMove={setSelectionEnd && handleMouseMove}
      ref={ref}
      style={style}
    >
      <span style={{ position :'absolute' }}>
        {value != null ? formatValue(value) : value}
      </span>
      &nbsp;
    </div>
  );
});

export default React.memo(HexByteAscii);
