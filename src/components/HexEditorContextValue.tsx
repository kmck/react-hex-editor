import React, { useContext } from 'react';

import { HexEditorContextValueProps } from '../types';
import { getOffsetProperties } from '../utils';

import HexEditorContext from '../contexts/HexEditorContext';

import HexByteValue from './HexByteValue';

const testStyle = { display: 'inline-block' };

const HexEditorContextValue = (props: HexEditorContextValueProps) => {
  const {
    children: HexEditorValue = HexByteValue,
    columnIndex,
    offset = 0,
    useNybbleValue = true,
  } = props;

  const {
    cursorColumn,
    cursorOffset,
    data,
    nybbleHigh,
    selectionDirection,
    selectionEnd,
    selectionStart,
  } = useContext(HexEditorContext);

  const isSelecting = selectionEnd > selectionStart;

  const {
    isCursor,
    isCurrentColumn,
    isSelected,
    isSelectionStart,
    isSelectionEnd,
    isSelectionCursor,
  } = getOffsetProperties({
    columnIndex,
    cursorColumn,
    cursorOffset,
    isSelecting,
    offset,
    selectionDirection,
    selectionEnd,
    selectionStart,
  });

  let value = props.value;
  if (typeof value === 'undefined') {
    value = offset >= 0 && offset < data.length ? data[offset] : null;
    // Replace high nybble
    if (value != null && useNybbleValue && isCursor && nybbleHigh != null) {
      value = (nybbleHigh << 4) | (0x0f & value);
    }
  }

  return (
    <HexEditorValue
      {...props}
      isCursor={isCursor}
      isCurrentColumn={isCurrentColumn}
      isSelected={isSelected}
      isSelectionStart={isSelectionStart}
      isSelectionEnd={isSelectionEnd}
      isSelectionCursor={isSelectionCursor}
      value={value}
      style={testStyle}
    />
  );
};

export default HexEditorContextValue;
