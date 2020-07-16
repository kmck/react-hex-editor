import React, {
  forwardRef,
  memo,
  useCallback,
} from 'react';
import joinClassNames from 'classnames';

import {
  HexEditorClassNames,
  SelectionDirectionType,
  SetSelectionBoundaryCallback,
} from '../types';
import {
  EDIT_MODE_HEX,
  EMPTY_CLASSNAMES,
} from '../constants';

interface Props {
  className?: string,
  classNames?: HexEditorClassNames,
  columnIndex?: number,
  isCursor?: boolean,
  isCurrentColumn?: boolean,
  isCurrentRow?: boolean,
  isEditing?: boolean,
  isSelected?: boolean,
  isSelectionCursor?: boolean,
  isSelectionEnd?: boolean,
  isSelectionStart?: boolean,
  offset?: number,
  rowIndex?: number,
  setSelectionEnd?: SetSelectionBoundaryCallback,
  setSelectionRange?: (
    start: number | null,
    end?: number | null,
    direction?: SelectionDirectionType | null,
    takeFocus?: boolean,
  ) => void,
  setSelectionStart?: SetSelectionBoundaryCallback,
  style?: React.CSSProperties,
  value?: number | null,
};

const HexByte = ({
  className,
  classNames = EMPTY_CLASSNAMES,
  columnIndex,
  isCursor,
  isCurrentColumn,
  isCurrentRow,
  isEditing,
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
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (setSelectionStart && e.button === 0 && !e.ctrlKey) {
      if (e.shiftKey) {
        e.preventDefault();
      } else {
        setSelectionStart(offset, EDIT_MODE_HEX, e);
      }
    }
  }, [offset, setSelectionStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (setSelectionEnd) {
      setSelectionEnd(offset, EDIT_MODE_HEX, e);
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
          [classNames.currentColumn || '']: isCurrentColumn,
          [classNames.currentRow || '']: isCurrentRow,
          [classNames.cursor || '']: isCursor,
          [classNames.cursorHigh || '']: isCursor && !isEditing,
          [classNames.cursorLow || '']: isCursor && isEditing,
          [classNames.even || '']: columnIndex != null && columnIndex % 2 === 0,
          [classNames.highlight || '']: isCursor || isSelectionCursor,
          [classNames.invalid || '']: value == null,
          [classNames.odd || '']: columnIndex != null && columnIndex % 2 === 1,
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
      <span className={classNames.nybbleHigh}>
        {value != null ? (value >>> 4).toString(16) : <>&nbsp;</>}
      </span>
      <span className={classNames.nybbleLow}>
        {value != null ? (value & 0xf).toString(16) : <>&nbsp;</>}
      </span>
    </div>
  );
};

HexByte.displayName = 'HexByte';

export default memo(forwardRef(HexByte));
