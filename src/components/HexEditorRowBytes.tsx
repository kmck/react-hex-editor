import React, { memo } from 'react';

import { HexEditorSectionProps, HexEditorValueProps } from '../types';
import { shallowDiffersForKeys } from '../utils';

import HexEditorContextValue from './HexEditorContextValue';
import HexByteValue from './HexByteValue';

export interface HexEditorRowBytesProps extends HexEditorSectionProps {
  children?: (props: HexEditorValueProps) => any,
  className?: string,
  style?: React.CSSProperties,
}

const checkProps: (keyof HexEditorRowBytesProps)[] = [
  'children',
  'className',
  'dataOffsets',
  'rowIndex',
  'style',
];

function arePropsEquivalent(prevProps: HexEditorRowBytesProps, nextProps: HexEditorRowBytesProps) {
  return !shallowDiffersForKeys(prevProps, nextProps, checkProps);
}

const HexEditorRowBytes = ({
  children: HexEditorValue = HexByteValue,
  className,
  dataOffsets,
  isColumnLabel,
  rowIndex,
  style,
}: HexEditorRowBytesProps) => (
  <div className={className} style={style}>
    {dataOffsets.map((offset, columnIndex) => (
      <HexEditorContextValue
        columnIndex={columnIndex}
        key={columnIndex}
        offset={offset}
        rowIndex={rowIndex}
        useNybbleValue
        value={isColumnLabel ? columnIndex : undefined}
      >
        {HexEditorValue}
      </HexEditorContextValue>
    ))}
  </div>
);

HexEditorRowBytes.displayName = 'HexEditorRowBytes';

export default memo(HexEditorRowBytes, arePropsEquivalent);
