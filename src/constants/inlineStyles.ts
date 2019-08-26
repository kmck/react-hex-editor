import { HexEditorInlineStyles } from '../types';

export const EDITOR_STYLE: React.CSSProperties = {
  fontFamily: 'monospace',
  position: 'relative',
};

export const INPUT_STYLE: React.CSSProperties = {
  border: 0,
  bottom: 0,
  cursor: 'text',
  display: 'block',
  height: '100%',
  left: 0,
  opacity: 0,
  outline: 0,
  padding: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
  width: '100%',
};

export const MEASURE_STYLE: React.CSSProperties = {
  opacity: 0,
  pointerEvents: 'none',
  position: 'absolute',
  fontFamily: 'monospace',
};

export const ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};

export const CELL_STYLE: React.CSSProperties = {
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  flexShrink: 0,
  justifyContent: 'center',
};

export const ROWS_STYLE: React.CSSProperties = {
  boxSizing: 'border-box',
  minWidth: '100%',
  overflowX: 'hidden',
  overflowY: 'scroll',
};

const INLINE_STYLES: HexEditorInlineStyles = {
  ascii: CELL_STYLE,
  asciiValues: ROW_STYLE,
  body: ROWS_STYLE,
  byte: CELL_STYLE,
  byteValues: ROW_STYLE,
  editor: EDITOR_STYLE,
  header: ROWS_STYLE,
  offsetLabel: CELL_STYLE,
  row: ROW_STYLE,
};

export default INLINE_STYLES;
