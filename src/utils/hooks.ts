import { useContext, useMemo } from 'react';

import HexEditorContext from '../contexts/HexEditorContext';

export function useData() {
  const { data } = useContext(HexEditorContext);
  return data;
}

export function useDataSlice(offset = 0, length = 1) {
  const { data } = useContext(HexEditorContext);
  const dataSlice = data.slice(offset, offset + length);
  return useMemo(() => dataSlice, Array.from(dataSlice));
}

export function useCursorOffset() {
  const { cursorOffset } = useContext(HexEditorContext);
  return cursorOffset;
}