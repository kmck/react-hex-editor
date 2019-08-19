import { createContext } from 'react';

import {
  HexEditorClassNames,
  HexEditorInlineStyles,
  SelectionDirectionType,
  SetSelectionBoundaryCallback,
  SetSelectionRangeCallback,
} from '../types';
import { SELECTION_DIRECTION_NONE } from '../constants';
import { formatHex } from '../utils';

export interface IHexEditorContextInterface {
  classNames: HexEditorClassNames,
  columns: number,
  cursorColumn: number,
  cursorOffset: number,
  cursorRow: number,
  data: Uint8Array | number[],
  formatOffset: (offset: number) => string,
  formatValue: (offset: number) => string,
  isEditing: boolean,
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

const HexEditorContext = createContext<IHexEditorContextInterface>({
  classNames: {},
  columns: 1,
  cursorColumn: 0,
  cursorOffset: 0,
  cursorRow: 0,
  data: [],
  formatOffset: formatHex,
  formatValue: formatHex,
  isEditing: false,
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
