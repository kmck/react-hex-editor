import { SELECTION_DIRECTION_BACKWARD, SELECTION_DIRECTION_NONE } from '../constants';

export const ASCII_LOOKUP = new Array(0x100).fill(0)
  .map((_v, i: number) => (i >= 0x20 && i < 0x80 ? String.fromCodePoint(i) : '.'));

const REGEX_MAC_LIKE = /Mac|iPhone|iPod|iPad/;

export function isMacLike() {
  return REGEX_MAC_LIKE.test(navigator.platform);
}

export function getScrollbarSize(parentNode = document.body) {
  const outer = document.createElement('div');
  outer.setAttribute('data-measure-scrollbar', 'true');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  outer.style.msOverflowStyle = 'scrollbar';
  parentNode.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  const scrollbarHeight = outer.offsetHeight - inner.offsetHeight;

  parentNode.removeChild(outer);

  return [scrollbarWidth, scrollbarHeight];
}

export function formatHex(value: number, padToLength?: number) {
  const hexValue = value.toString(16);
  return padToLength ? hexValue.padStart(padToLength, '0') : hexValue;
}

export function formatHexByte(value: number) {
  return (value & 0xff).toString(16).padStart(2, '0');
}

export function byteToAscii(value: number) {
  return ASCII_LOOKUP[value & 0xff];
}

export function hasSelection(
  start: number,
  end: number,
  selectionStart: number,
  selectionEnd: number = selectionStart,
) {
  // Selection contains range
  if (selectionStart <= start && selectionEnd >= end) {
    return true;
  }
  // Selection starts in range
  if (selectionStart >= start && selectionStart <= end) {
    return true;
  }
  // Selection ends in range
  if (selectionEnd >= start && selectionEnd <= end) {
    return true;
  }
  // Selection does not overlap range
  return false;
}

// Pulled from react-compat
// https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
export function shallowDiffers(
  prev: { [key: string]: any },
  next: { [key: string]: any },
): boolean {
  for (let attribute in prev) {
    if (!(attribute in next)) {
      return true;
    }
  }
  for (let attribute in next) {
    if (prev[attribute] !== next[attribute]) {
      return true;
    }
  }
  return false;
}

export function shallowDiffersForKeys(
  prev: { [key: string]: any },
  next: { [key: string]: any },
  attributes: string[],
): boolean {
  for (let attribute in attributes) {
    if (attribute in prev !== attribute in next) {
      return true;
    }
    if (prev[attribute] !== next[attribute]) {
      return true;
    }
  }
  return false;
}

export function dataDiffers(
  prevData: Uint8Array | number[] | null | undefined,
  nextData: Uint8Array | number[] | null | undefined,
  dataOffsets: number[],
) {
  if (!prevData && prevData === nextData) {
    return false;
  }
  if (!prevData || !nextData) {
    return true;
  }
  const changedIndex = dataOffsets.findIndex(offset => prevData[offset] !== nextData[offset]);
  if (changedIndex) {
    console.log({ changedIndex });
  }
  return changedIndex >= 0;
}

export function getOffsetProperties({
  columnIndex = -1,
  cursorColumn = -1,
  cursorOffset = -1,
  isSelecting = false,
  offset = -1,
  selectionDirection = SELECTION_DIRECTION_NONE,
  selectionEnd = -1,
  selectionStart = -1,
}) {
  const isCurrentColumn = cursorColumn != null && columnIndex === cursorColumn;
  const isCursor = offset === cursorOffset && !isSelecting;
  const isSelected = offset >= selectionStart && offset < selectionEnd;
  const isSelectionStart = offset === selectionStart;
  const isSelectionEnd = offset === selectionEnd - 1;
  const isSelectionCursor = isSelecting && (
    selectionDirection === SELECTION_DIRECTION_BACKWARD
      ? isSelectionStart
      : isSelectionEnd
  );

  return {
    isCurrentColumn,
    isCursor,
    isSelected,
    isSelectionStart,
    isSelectionEnd,
    isSelectionCursor
  };
}
