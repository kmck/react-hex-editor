import {
  KEY_0,
  KEY_1,
  KEY_2,
  KEY_3,
  KEY_4,
  KEY_5,
  KEY_6,
  KEY_7,
  KEY_8,
  KEY_9,
  KEY_A,
  KEY_B,
  KEY_C,
  KEY_D,
  KEY_E,
  KEY_F,
} from 'keycode-js';

import {
  HexEditorClassNames,
  HexEditorInlineStyles,
} from '../types';

export const EDIT_MODE_HEX = 'hex';
export const EDIT_MODE_ASCII = 'ascii';

export const SELECTION_DIRECTION_FORWARD = 'forward';
export const SELECTION_DIRECTION_BACKWARD = 'backward';
export const SELECTION_DIRECTION_NONE = 'none';

export const KEY_VALUES: { [key: number]: number } = {
  [KEY_0]: 0x0,
  [KEY_1]: 0x1,
  [KEY_2]: 0x2,
  [KEY_3]: 0x3,
  [KEY_4]: 0x4,
  [KEY_5]: 0x5,
  [KEY_6]: 0x6,
  [KEY_7]: 0x7,
  [KEY_8]: 0x8,
  [KEY_9]: 0x9,
  [KEY_A]: 0xa,
  [KEY_B]: 0xb,
  [KEY_C]: 0xc,
  [KEY_D]: 0xd,
  [KEY_E]: 0xe,
  [KEY_F]: 0xf,
};

export const EMPTY_CLASSNAMES: HexEditorClassNames = {};
export const EMPTY_INLINE_STYLES: HexEditorInlineStyles = {};
