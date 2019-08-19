import { Align } from 'react-window';

import {
  EDIT_MODE_ASCII,
  EDIT_MODE_HEX,
  SELECTION_DIRECTION_BACKWARD,
  SELECTION_DIRECTION_FORWARD,
  SELECTION_DIRECTION_NONE,
} from './constants';

export type EditModeType = (
  typeof EDIT_MODE_ASCII
  | typeof EDIT_MODE_HEX
);

export type SelectionDirectionType = (
  typeof SELECTION_DIRECTION_FORWARD
  | typeof SELECTION_DIRECTION_BACKWARD
  | typeof SELECTION_DIRECTION_NONE
);

export type SetSelectionBoundaryCallback = (
  offset: number,
  editMode?: EditModeType,
  e?: React.MouseEvent,
) => void;

export type SetSelectionRangeCallback = (
  start: number | null,
  end?: number | null,
  direction?: SelectionDirectionType | null,
  takeFocus?: boolean,
) => void;

export type Color = string;

export type HexEditorTheme = {
  asciiPaddingX: string | number,
  bytePaddingX: string | number,
  rowPaddingY: string | number,
  colorBackground: Color,
  colorBackgroundColumnEven: Color,
  colorBackgroundColumnOdd: Color,
  colorBackgroundCursor: Color,
  colorBackgroundCursorHighlight: Color,
  colorBackgroundEven: Color,
  colorBackgroundInactiveCursor: Color,
  colorBackgroundInactiveCursorHighlight: Color,
  colorBackgroundInactiveSelection: Color,
  colorBackgroundInactiveSelectionCursor: Color,
  colorBackgroundLabel: Color,
  colorBackgroundLabelCurrent: Color,
  colorBackgroundOdd: Color,
  colorBackgroundRowEven: Color,
  colorBackgroundRowOdd: Color,
  colorBackgroundSelection: Color,
  colorBackgroundSelectionCursor: Color,
  colorScrollbackTrack: Color,
  colorScrollbackThumb: Color,
  colorScrollbackThumbHover: Color,
  colorText: Color,
  colorTextColumnEven: Color,
  colorTextColumnOdd: Color,
  colorTextCursor: Color,
  colorTextCursorHighlight: Color,
  colorTextEven: Color,
  colorTextInactiveCursor: Color,
  colorTextInactiveCursorHighlight: Color,
  colorTextInactiveSelection: Color,
  colorTextInactiveSelectionCursor: Color,
  colorTextLabel: Color,
  colorTextLabelCurrent: Color,
  colorTextOdd: Color,
  colorTextRowEven: Color,
  colorTextRowOdd: Color,
  colorTextSelection: Color,
  colorTextSelectionCursor: Color,
  fontFamily: string,
  fontSize: string | number,
  gutterWidth: string | number,
  labelPaddingX: string | number,
  textTransform: string,
};

export interface HexEditorHandle {
  blur(): void,
  focus(): void,
  scrollTo(scrollTop: number): void,
  scrollToItem(rowIndex: number, align: Align): void,
  setSelectionRange(
    start: number | null,
    end?: number | null,
    direction?: SelectionDirectionType | null,
    takeFocus?: boolean,
  ): void,
  setValue(offset: number, value: number): void,
};

export interface HexEditorClassNames {
  ascii?: string,
  asciiHeader?: string,
  asciiValues?: string,
  body?: string,
  byte?: string,
  byteHeader?: string,
  byteValues?: string,
  currentColumn?: string,
  currentRow?: string,
  cursor?: string,
  cursorHigh?: string,
  cursorLow?: string,
  editAscii?: string,
  editHex?: string,
  even?: string,
  gutter?: string,
  gutterHeader?: string,
  header?: string,
  highlight?: string,
  invalid?: string,
  notFocused?: string,
  nybbleHigh?: string,
  nybbleLow?: string,
  odd?: string,
  offsetLabel?: string,
  offsetLabelHeader?: string,
  row?: string,
  rowHeader?: string,
  selection?: string,
  selectionBackward?: string,
  selectionCursor?: string,
  selectionEnd?: string,
  selectionForward?: string,
  selectionStart?: string,
};

export interface HexEditorInlineStyles {
  ascii?: React.CSSProperties,
  asciiValues?: React.CSSProperties,
  body?: React.CSSProperties,
  byte?: React.CSSProperties,
  byteValues?: React.CSSProperties,
  editor?: React.CSSProperties,
  gutter?: React.CSSProperties,
  header?: React.CSSProperties,
  offsetLabel?: React.CSSProperties,
  row?: React.CSSProperties,
};
