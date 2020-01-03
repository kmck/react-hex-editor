import React, { memo } from 'react';

import { HexEditorSectionProps, HexEditorValueProps } from '../types';
import { shallowDiffersForKeys, byteToAscii } from '../utils';

import HexEditorContextValue from './HexEditorContextValue';

export interface HexEditorRowAsciiProps extends HexEditorSectionProps {
  children?: (props: HexEditorValueProps) => any,
  className?: string,
  dataOffsets: number[],
  isCurrentRow?: boolean,
  isSelecting?: boolean,
  style?: React.CSSProperties,
}
const checkProps: (keyof HexEditorRowAsciiProps)[] = ['dataOffsets', 'offset'];

function arePropsEquivalent(prevProps: HexEditorRowAsciiProps, nextProps: HexEditorRowAsciiProps) {
  return !shallowDiffersForKeys(prevProps, nextProps, checkProps);
}

const defaultByteRenderer = ({ value }: HexEditorValueProps) => (
  <span>{value == null ? '\u00A0' : byteToAscii(value)}</span>
);

const HexEditorRowAscii = ({
  children: HexEditorValue = defaultByteRenderer,
  className,
  dataOffsets,
  isColumnLabel,
  rowIndex,
  style,
}: HexEditorRowAsciiProps) => (
  <div className={className} style={style}>
    {dataOffsets.map((offset, columnIndex) => (
      <HexEditorContextValue
        columnIndex={columnIndex}
        key={columnIndex}
        offset={offset}
        rowIndex={rowIndex}
        useNybbleValue={false}
        value={isColumnLabel ? null : undefined}
      >
        {HexEditorValue}
      </HexEditorContextValue>
    ))}
  </div>
);

HexEditorRowAscii.displayName = 'HexEditorRowAscii';

export default memo(HexEditorRowAscii, arePropsEquivalent);
