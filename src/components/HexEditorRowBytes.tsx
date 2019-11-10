import React, { memo } from 'react';

import { HexEditorSectionProps, HexEditorValueProps } from '../types';
import { shallowDiffersForKeys, getOffsetProperties } from '../utils';

export interface HexEditorRowBytesProps extends HexEditorSectionProps {
  children: (props: HexEditorValueProps) => any,
  className?: string,
  dataOffsets: number[],
  formatValue?: (value: number) => string | number,
  isCurrentRow?: boolean,
  isSelecting?: boolean,
  style?: React.CSSProperties,
}

const checkProps: (keyof HexEditorRowBytesProps)[] = ['dataOffsets', 'offset'];

function arePropsEquivalent(prevProps: HexEditorRowBytesProps, nextProps: HexEditorRowBytesProps) {
  return !shallowDiffersForKeys(prevProps, nextProps, checkProps);
}

const HexEditorRowBytes = ({
  className,
  children: HexEditorByte,
  cursorColumn,
  cursorOffset,
  data,
  dataOffsets,
  disabled,
  isSelecting,
  formatValue,
  selectionDirection,
  selectionEnd,
  selectionStart,
  style,
}: HexEditorRowBytesProps) => {
  return (
    <div className={className} style={style}>
      {dataOffsets.map((offset, columnIndex) => {
        const {
          isCursor,
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

        const value = data && offset < data.length ? data[offset] : null;

        return (
          <HexEditorByte
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
            rowIndex={rowIndex}
            setSelectionEnd={setSelectionEnd}
            setSelectionRange={setSelectionRange}
            setSelectionStart={setSelectionStart}
            value={value}
          />
        );
      })}
    </div>
  );
};

HexEditorRowBytes.displayName = 'HexEditorRowBytes';

export default memo(HexEditorRowBytes, arePropsEquivalent);
