import React, {
  forwardRef,
  memo,
  useMemo,
} from 'react';
import joinClassNames from 'classnames';
import { areEqual } from 'react-window';

import {
  SelectionDirectionType,
  SetSelectionBoundaryCallback,
  HexEditorClassNames,
  HexEditorInlineStyles,
  ValueFormatter,
} from '../types';

import {
  EMPTY_CLASSNAMES,
  EMPTY_INLINE_STYLES,
  SELECTION_DIRECTION_BACKWARD,
} from '../constants';

import { hasSelection } from '../utils';

import HexOffsetLabel from './HexOffsetLabel';
import HexEditorGutter from './HexEditorGutter';
import HexByteValue from './HexByteValue';
import HexAsciiValue from './HexAsciiValue';

export interface HexEditorRowProps {
  asciiPlaceholder?: string | JSX.Element | null,
  className?: string,
  classNames?: HexEditorClassNames,
  columns?: number,
  cursorColumn?: number,
  cursorOffset?: number,
  cursorRow?: number,
  data?: Uint8Array | number[],
  disabled?: boolean,
  formatOffset?: (offset: number) => string | number,
  formatValue?: ValueFormatter,
  isEditing?: boolean,
  isHeader?: boolean,
  labelOffset?: number | null,
  nonce?: number | string,
  nybbleHigh?: number | null,
  offset?: number,
  rowIndex?: number,
  selectionDirection?: SelectionDirectionType,
  selectionEnd?: number,
  selectionStart?: number,
  setSelectionEnd?: SetSelectionBoundaryCallback,
  setSelectionRange?: (
    start: number | null,
    end?: number | null,
    direction?: SelectionDirectionType | null,
    takeFocus?: boolean,
  ) => void,
  setSelectionStart?: SetSelectionBoundaryCallback,
  showAscii?: boolean,
  showLabel?: boolean,
  style?: React.CSSProperties,
  styles?: HexEditorInlineStyles,
};

function areRowPropsEquivalent(prevProps: HexEditorRowProps, nextProps: HexEditorRowProps) {
  const {
    columns: prevColumns = prevProps.data ? prevProps.data.length : 0,
    cursorOffset: prevCursorOffset,
    cursorRow: prevCursorRow,
    isEditing: prevIsEditing,
    nybbleHigh: prevNybbleHigh,
    offset: prevOffset = 0,
    rowIndex: prevRowIndex,
    selectionEnd: prevSelectionEnd,
    selectionStart: prevSelectionStart,
    ...prevRest
  } = prevProps;
  const {
    columns: nextColumns = nextProps.data ? nextProps.data.length : 0,
    cursorOffset: nextCursorOffset,
    cursorRow: nextCursorRow,
    isEditing: nextIsEditing,
    nybbleHigh: nextNybbleHigh,
    offset: nextOffset = 0,
    rowIndex: nextRowIndex,
    selectionEnd: nextSelectionEnd,
    selectionStart: nextSelectionStart,
    ...nextRest
  } = nextProps;

  // Row, column, or offset has changed
  if (prevRowIndex !== nextRowIndex || prevColumns !== nextColumns || prevOffset !== nextOffset) {
    return false;
  }

  // Cursor is or was on this row
  if (prevRowIndex === prevCursorRow || nextRowIndex === nextCursorRow) {
    // Cursor has moved to or from this row
    if (prevCursorRow !== nextCursorRow) {
      return false;
    }

    // Editing on this row
    if (prevIsEditing !== nextIsEditing || prevNybbleHigh !== nextNybbleHigh) {
      return false;
    }
  }

  const prevOffsetEnd = prevOffset + prevColumns;
  const nextOffsetEnd = nextOffset + nextColumns;

  if (prevCursorOffset != null && nextCursorOffset != null) {
    if (hasSelection(prevOffset, prevOffsetEnd, prevCursorOffset)) {
      return false;
    }

    if (hasSelection(nextOffset, nextOffsetEnd, nextCursorOffset)) {
      return false;
    }
  }

  if (
    prevSelectionStart != null && prevSelectionEnd != null
    && nextSelectionStart != null && nextSelectionEnd != null
  ) {
    const prevHasSelection = hasSelection(prevOffset, prevOffsetEnd, prevSelectionStart, prevSelectionEnd);
    const nextHasSelection = hasSelection(nextOffset, nextOffsetEnd, nextSelectionStart, nextSelectionEnd);

    if (prevHasSelection !== nextHasSelection) {
      return false;
    }

    if (prevSelectionStart !== nextSelectionStart) {
      if (hasSelection(prevOffset, prevOffsetEnd, prevSelectionStart)) {
        return false;
      }

      if (hasSelection(nextOffset, nextOffsetEnd, nextSelectionStart)) {
        return false;
      }
    }

    if (prevSelectionEnd !== nextSelectionEnd) {
      if (hasSelection(prevOffset, prevOffsetEnd, prevSelectionEnd)) {
        return false;
      }

      if (hasSelection(nextOffset, nextOffsetEnd, nextSelectionEnd)) {
        return false;
      }
    }
  }

  return areEqual(prevRest, nextRest);
}

const HexEditorRow = ({
  asciiPlaceholder,
  className = '',
  classNames = EMPTY_CLASSNAMES,
  columns,
  cursorColumn,
  cursorOffset,
  cursorRow,
  data = [],
  disabled = false,
  formatOffset,
  formatValue,
  isEditing,
  isHeader = false,
  labelOffset,
  nybbleHigh,
  offset: dataOffset = 0,
  rowIndex,
  selectionDirection,
  selectionEnd = -1,
  selectionStart = -1,
  setSelectionEnd,
  setSelectionRange,
  setSelectionStart,
  showAscii = true,
  showLabel = true,
  style,
  styles = EMPTY_INLINE_STYLES,
}: HexEditorRowProps, ref: React.Ref<HTMLDivElement>) => {
  const dataOffsets = useMemo(() => {
    return new Array(columns == null ? data.length - dataOffset : columns)
      .fill(0)
      .map((_v, i) => (dataOffset + i));
  }, [dataOffset, columns, data.length]);

  const isSelecting = selectionEnd > selectionStart;
  const isCurrentRow = cursorRow != null && rowIndex === cursorRow;

  return (
    <div className={className} ref={ref} style={style}>
      {!showLabel ? null : (
        <>
          <HexOffsetLabel
            className={joinClassNames({
              [classNames.offsetLabelHeader || '']: isHeader,
              [classNames.offsetLabel || '']: !isHeader,
              [classNames.currentRow || '']: isCurrentRow,
            })}
            formatOffset={formatOffset}
            offset={labelOffset == null ? dataOffset : labelOffset}
            style={styles.offsetLabel}
          />
          <HexEditorGutter
            className={isHeader ? classNames.gutterHeader : classNames.gutter}
            style={styles.gutter}
          />
        </>
      )}
      {!(columns || data.length) ? null : (
        <div className={classNames.byteValues} style={styles.byteValues}>
          {dataOffsets.map((offset, columnIndex) => {
            const isCurrentColumn = cursorColumn != null && columnIndex === cursorColumn;
            const isCursor = offset === cursorOffset && !isSelecting;
            const isSelected = offset >= selectionStart && offset < selectionEnd;
            const isSelectionStart = offset === selectionStart;
            const isSelectionEnd = offset === selectionEnd - 1;
            const isSelectionCursor = isSelecting && (
              selectionDirection === SELECTION_DIRECTION_BACKWARD
                ? isSelectionStart
                : isSelectionEnd
            );

            let value = null;
            if (offset < data.length) {
              value = isCursor && nybbleHigh != null
                ? (nybbleHigh << 4) | (0x0f & data[offset])
                : data[offset];
            }

            return (
              <HexByteValue
                className={isHeader ? classNames.byteHeader : classNames.byte}
                classNames={classNames}
                columnIndex={columnIndex}
                isCurrentColumn={isCurrentColumn}
                isCurrentRow={isCurrentRow}
                isCursor={isCursor && !disabled}
                isEditing={isEditing && !disabled}
                isSelected={isSelected && !disabled}
                isSelectionCursor={isSelectionCursor && !disabled}
                isSelectionEnd={isSelectionEnd && !disabled}
                isSelectionStart={isSelectionStart && !disabled}
                key={offset}
                offset={offset}
                rowIndex={rowIndex}
                setSelectionEnd={setSelectionEnd}
                setSelectionRange={setSelectionRange}
                setSelectionStart={setSelectionStart}
                style={styles.byte}
                value={value}
              />
            );
          })}
        </div>
      )}
      {!showAscii ? null : (
        <>
          <HexEditorGutter
            className={isHeader ? classNames.gutterHeader : classNames.gutter}
            style={styles.gutter}
          />
          <div className={classNames.asciiValues} style={styles.asciiValues}>
            {dataOffsets.map((offset, columnIndex) => {
              const isCursor = offset === cursorOffset && !isSelecting;
              const isSelected = offset >= selectionStart && offset < selectionEnd;
              const isSelectionStart = offset === selectionStart;
              const isSelectionEnd = offset === selectionEnd - 1;
              const isSelectionCursor = isSelecting && (
                selectionDirection === SELECTION_DIRECTION_BACKWARD
                  ? isSelectionStart
                  : isSelectionEnd
              );

              const value = offset < data.length ? data[offset] : null;

              return (
                <HexAsciiValue
                  className={isHeader ? classNames.asciiHeader : classNames.ascii}
                  classNames={classNames}
                  columnIndex={columnIndex}
                  formatValue={formatValue}
                  isCursor={isCursor && !disabled}
                  isEditing={isEditing && !disabled}
                  isSelected={isSelected && !disabled}
                  isSelectionCursor={isSelectionCursor && !disabled}
                  isSelectionEnd={isSelectionEnd && !disabled}
                  isSelectionStart={isSelectionStart && !disabled}
                  key={offset}
                  offset={offset}
                  placeholder={asciiPlaceholder}
                  rowIndex={rowIndex}
                  setSelectionEnd={setSelectionEnd}
                  setSelectionRange={setSelectionRange}
                  setSelectionStart={setSelectionStart}
                  style={styles.ascii}
                  value={value}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

HexEditorRow.displayName = 'HexEditorRow';

export default memo(forwardRef(HexEditorRow), areRowPropsEquivalent);
