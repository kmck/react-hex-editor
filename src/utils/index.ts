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
