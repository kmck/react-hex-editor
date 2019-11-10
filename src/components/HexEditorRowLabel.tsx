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
  formatOffset,
  offset,
}: HexEditorRowLabelProps) => (
  <div>{formatOffset && offset != null ? formatOffset(offset) : offset}</div>
);

HexEditorRowLabel.displayName = 'HexEditorRowLabel';

export default memo(HexEditorRowLabel, arePropsEquivalent);
