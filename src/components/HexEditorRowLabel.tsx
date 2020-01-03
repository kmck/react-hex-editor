import React, { memo } from 'react';

import { HexEditorSectionProps } from '../types';
import { shallowDiffersForKeys } from '../utils';

export interface HexEditorRowLabelProps extends HexEditorSectionProps {
  formatOffset?: (offset: number) => string | number,
}

const checkProps: (keyof HexEditorRowLabelProps)[] = ['formatOffset', 'offset'];

function arePropsEquivalent(prevProps: HexEditorRowLabelProps, nextProps: HexEditorRowLabelProps) {
  return !shallowDiffersForKeys(prevProps, nextProps, checkProps);
}

const HexEditorRowLabel = ({
  data = [],
  // formatOffset,
  offset,
}: HexEditorRowLabelProps) => {
  const maxOffsetLength = 2 * Math.ceil(data.length.toString(16).length / 2);
  const formatOffset = (offset?: number) => (
    offset == null || offset < 0
      ? ''.padStart(maxOffsetLength, '\u00A0')
      : offset.toString(16).padStart(maxOffsetLength, '0'
  ));
  return (
    <div>{formatOffset && offset != null ? formatOffset(offset) : offset}</div>
  );
}

HexEditorRowLabel.displayName = 'HexEditorRowLabel';

export default memo(HexEditorRowLabel, arePropsEquivalent);
