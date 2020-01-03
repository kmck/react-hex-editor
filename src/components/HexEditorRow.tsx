import React, { createElement, memo, useMemo } from 'react';
import { areEqual } from 'react-window';

import {
  HexEditorRowProps,
  HexEditorSectionProps,
} from '../types';

import { hasSelection } from '../utils';

function areRowPropsEquivalent(prevProps: HexEditorRowProps, nextProps: HexEditorRowProps) {
  const {
    columns: prevColumns = prevProps.data ? prevProps.data.length : 0,
    cursorColumn: prevCursorColumn, ///
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
    cursorColumn: nextCursorColumn, ///
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

const HexEditorRow = (props: HexEditorRowProps) => {
  const {
    columns = 1,
    // cursorColumn,
    // cursorOffset,
    cursorRow,
    data = [],
    // disabled = false,
    // isEditing,
    nonce,
    // nybbleHigh,
    offset: dataOffset = 0,
    rowIndex,
    rowSections,
    rowSectionRenderers,
    // selectionDirection,
    selectionEnd = -1,
    selectionStart = -1,
    // setSelectionEnd,
    // setSelectionRange,
    // setSelectionStart,
  } = props;

  const {
    style,
    ...restProps
  } = props;

  const rowDataLength = columns == null ? data.length - Math.max(0, dataOffset) : columns;
  const isColumnLabel = dataOffset < 0;

  const dataOffsets = useMemo(() => {
    const nextDataOffsets = new Array(rowDataLength).fill(-1);
    return dataOffset < 0
      ? nextDataOffsets
      : nextDataOffsets.map((_v, i) => (isColumnLabel ? -1 : dataOffset + i));
  }, [dataOffset, rowDataLength]);

  const isSelecting = selectionEnd > selectionStart;
  const isCurrentRow = cursorRow != null && rowIndex === cursorRow;

  const sectionProps: HexEditorSectionProps = {
    ...restProps,
    dataOffsets,
    isColumnLabel,
    isCurrentRow,
    isSelecting,
  };

  return (
    <div style={style}>
      {rowSections.map(key => (
        <React.Fragment key={key}>
          {createElement(rowSectionRenderers[key], sectionProps)}
        </React.Fragment>
      ))}
    </div>
  );
};

HexEditorRow.displayName = 'HexEditorRow';

export default memo(HexEditorRow, areRowPropsEquivalent);
