import React, { memo } from 'react';

import { HexEditorSectionProps } from '../types';
import { shallowDiffersForKeys } from '../utils';

export interface HexEditorRowAsciiProps extends HexEditorSectionProps {
  formatValue?: (offset: number) => string | number,
}
const checkProps: (keyof HexEditorRowAsciiProps)[] = ['formatValue', 'offset'];

function arePropsEquivalent(prevProps: HexEditorRowAsciiProps, nextProps: HexEditorRowAsciiProps) {
  return !shallowDiffersForKeys(prevProps, nextProps, checkProps);
}

const HexEditorRowAscii = ({
  // formatValue,
  // offset,
}: HexEditorRowAsciiProps) => (
  <div>foo</div>
);

HexEditorRowAscii.displayName = 'HexEditorRowAscii';

export default memo(HexEditorRowAscii, arePropsEquivalent);
