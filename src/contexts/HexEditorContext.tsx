import { createContext } from 'react';

import {
  HexEditorClassNames,
  HexEditorInlineStyles,
  SelectionDirectionType,
  SetSelectionBoundaryCallback,
  SetSelectionRangeCallback,
  ValueFormatter,
} from '../types';
import { SELECTION_DIRECTION_NONE } from '../constants';
import { formatHex } from '../utils';

export interface HexEditorContextInterface {
  asciiPlaceholder: string | JSX.Element | null,
  classNames: HexEditorClassNames,
  columns: number,
  cursorColumn?: number,
  cursorOffset: number,
  cursorRow?: number,
  data: Uint8Array | number[],
  formatOffset: (offset: number) => string,
  formatValue: ValueFormatter,
  isEditing: boolean,
  nonce?: number | string,
  nybbleHigh: number | null,
  rows: number,
  selectionAnchor: number | null,
  selectionDirection: SelectionDirectionType,
  selectionEnd: number,
  selectionStart: number,
  setSelectionEnd: SetSelectionBoundaryCallback,
  setSelectionRange: SetSelectionRangeCallback,
  setSelectionStart: SetSelectionBoundaryCallback,
  showAscii: boolean,
  showRowLabels: boolean,
  styles: HexEditorInlineStyles,
}

const HexEditorContext = createContext<HexEditorContextInterface>({
  asciiPlaceholder: null,
  classNames: {},
  columns: 1,
  cursorColumn: undefined,
  cursorOffset: 0,
  cursorRow: undefined,
  data: [],
  formatOffset: formatHex,
  formatValue: formatHex,
  isEditing: false,
  nonce: undefined,
  nybbleHigh: null,
  rows: 1,
  selectionAnchor: null,
  selectionDirection: SELECTION_DIRECTION_NONE,
  selectionEnd: 0,
  selectionStart: 0,
  setSelectionEnd: () => {},
  setSelectionRange: () => {},
  setSelectionStart: () => {},
  showAscii: false,
  showRowLabels: false,
  styles: {},
})

export default HexEditorContext;
