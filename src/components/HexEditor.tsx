import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import joinClassNames from 'classnames';
import {
  Align,
  ListOnItemsRenderedProps,
  FixedSizeList as List,
} from 'react-window';
import Keycoder from 'keycoder';

import {
  KEY_A,
  KEY_BACK_SPACE,
  KEY_DELETE,
  KEY_DOWN,
  KEY_E,
  KEY_END,
  KEY_HOME,
  KEY_LEFT,
  KEY_PAGE_DOWN,
  KEY_PAGE_UP,
  KEY_RIGHT,
  KEY_TAB,
  KEY_UP,
} from 'keycode-js';

import {
  EditModeType,
  HexEditorHandle,
  HexEditorProps,
  SelectionDirectionType,
} from '../types';

import {
  EDIT_MODE_ASCII,
  EDIT_MODE_HEX,
  KEY_VALUES,
  SELECTION_DIRECTION_BACKWARD,
  SELECTION_DIRECTION_FORWARD,
  SELECTION_DIRECTION_NONE,
} from '../constants';

import {
  byteToAscii,
  formatHex,
  formatHexByte,
  isMacLike,
} from '../utils';

import CLASS_NAMES from '../constants/classNames';

import INLINE_STYLES, { INPUT_STYLE } from '../constants/inlineStyles';

import HexEditorRow from './HexEditorRow';
import HexEditorContext, { HexEditorContextInterface } from '../contexts/HexEditorContext';
import HexEditorBody from './HexEditorBody';

interface HexEditorState {
  cursorOffset: number,
  editMode: EditModeType,
  isFocused: boolean,
  nybbleHigh: number | null,
  nybbleOffset: number,
  overscanStartIndex: number,
  overscanStopIndex: number,
  selectionAnchor: number | null,
  selectionDirection: SelectionDirectionType,
  selectionEnd: number,
  selectionStart: number,
  viewportRowOffset: number,
  visibleStartIndex: number,
  visibleStopIndex: number,
};

interface HexEditorAction {
  cursorOffset?: number,
  editMode?: EditModeType,
  isFocused?: boolean,
  nybbleHigh?: number | null,
  nybbleOffset?: number,
  selectionAnchor?: number | null,
  selectionDirection?: SelectionDirectionType,
  selectionEnd?: number,
  selectionStart?: number,
  viewportRowOffset?: number,
  visibleStartIndex?: number,
  visibleStopIndex?: number,
};

const reducer = (
  prevState: HexEditorState,
  mergeState: HexEditorAction,
) => ({ ...prevState, ...mergeState });

const HexEditor: React.RefForwardingComponent<HexEditorHandle, HexEditorProps> = ({
  asciiPlaceholder = <>&nbsp;</>,
  autoFocus = false,
  children,
  className,
  classNames = CLASS_NAMES,
  columns,
  data = [],
  formatValue = byteToAscii,
  height,
  highlightColumn = false,
  inlineStyles = INLINE_STYLES,
  inputStyle = INPUT_STYLE,
  nonce,
  onBlur,
  onFocus,
  onItemsRendered,
  onSetValue,
  overscanCount,
  readOnly = false,
  rowHeight,
  rows,
  showAscii = false,
  showColumnLabels = false,
  showRowLabels = false,
  style,
  tabIndex,
  width,
}, ref) => {
  const [state, setState] = useReducer(reducer, {
    cursorOffset: 0,
    editMode: EDIT_MODE_HEX,
    isFocused: false,
    nybbleHigh: null,
    nybbleOffset: 0,
    overscanStartIndex: 0,
    overscanStopIndex: 0,
    selectionAnchor: null,
    selectionDirection: SELECTION_DIRECTION_NONE,
    selectionEnd: 0,
    selectionStart: 0,
    viewportRowOffset: 0,
    visibleStartIndex: 0,
    visibleStopIndex: 0,
  });

  const columnData = useMemo(
    () => new Array(columns).fill(0).map((_v, i) => i),
    [columns],
  );

  const rowListRef = useRef<List>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stateRef = useRef({
    columns,
    data,
    readOnly,
    rows,
    showAscii,
    ...state,
  });

  useLayoutEffect(() => {
    stateRef.current = {
      columns,
      data,
      readOnly,
      rows,
      showAscii,
      ...state,
    };
  }, [columns, data, data.length, readOnly, rows, showAscii, state]);

  const blur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);

  const focus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  }, []);

  const setSelectionRange = useCallback((
    start: number | null,
    end?: number | null,
    direction?: SelectionDirectionType | null,
    takeFocus?: boolean,
  ) => {
    if (takeFocus) {
      focus();
    }

    const {
      data: currentData,
      editMode: currentEditMode,
      selectionStart: prevSelectionStart,
      selectionEnd: prevSelectionEnd,
      selectionDirection: prevSelectionDirection,
    } = stateRef.current;
    const dataLength = data.length;

    let selectionStart = start;
    let selectionEnd = end;
    let selectionDirection = direction;

    if (selectionStart == null) {
      // extend selection from anchor
      selectionStart = prevSelectionDirection === SELECTION_DIRECTION_BACKWARD
        ? prevSelectionEnd
        : prevSelectionStart;
    }

    selectionStart = Math.max(0, Math.min(selectionStart || 0, dataLength));
    selectionEnd = selectionEnd == null ? selectionStart : Math.max(0, Math.min(selectionEnd, dataLength));

    // Swap start/end if they are given backwards
    if (selectionEnd < selectionStart) {
      [selectionStart, selectionEnd] = [selectionEnd, selectionStart];
      if (selectionDirection == null) {
        selectionDirection = SELECTION_DIRECTION_BACKWARD;
      }
    }

    // Default selection direction
    if (selectionDirection == null) {
      selectionDirection = selectionEnd > selectionStart
        ? SELECTION_DIRECTION_FORWARD
        : SELECTION_DIRECTION_NONE;
    }

    const cursorOffset = selectionDirection === SELECTION_DIRECTION_BACKWARD
      ? selectionStart
      : selectionEnd;

    let selectedValue = '';
    for (let i = selectionStart; i < selectionEnd; i += 1) {
      selectedValue += currentEditMode === EDIT_MODE_ASCII
        ? String.fromCharCode(currentData[i])
        : formatHexByte(currentData[i]);
    }

    if (selectionStart === selectionEnd && selectionStart >= dataLength) {
      selectionStart = selectionEnd = dataLength - 1;
    }

    setState({
      cursorOffset,
      nybbleHigh: null,
      nybbleOffset: 0,
      selectionStart,
      selectionEnd,
      selectionDirection,
    });

    try {
      if (inputRef.current) {
        inputRef.current.value = selectedValue;
        inputRef.current.setSelectionRange(0, selectedValue.length);
      }
    } catch (e) {
      // shrug
    }
  }, [focus, data.length]);

  useEffect(() => {
    if (state.selectionAnchor != null) {
      const handleWindowMouseUp = (_e: MouseEvent) => {
        setState({ selectionAnchor: null });
        focus();
      };
      window.addEventListener('mouseup', handleWindowMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleWindowMouseUp);
      };
    }
  }, [state.selectionAnchor, focus]);

  const setSelectionStart = useCallback((
    offset: number,
    editMode?: EditModeType,
    _e?: React.MouseEvent,
  ) => {
    const {
      selectionAnchor,
    } = stateRef.current;

    if (selectionAnchor == null) {
      if (editMode != null) {
        setState({ editMode });
      }

      setState({ selectionAnchor: offset });
      setSelectionRange(offset, offset, null, false);
    }
  }, [setSelectionRange]);

  const setSelectionEnd = useCallback((
    offset: number,
    editMode?: EditModeType,
    e?: React.MouseEvent,
  ) => {
    const {
      editMode: prevEditMode,
      selectionAnchor,
      selectionEnd,
      selectionStart,
    } = stateRef.current;

    if (selectionAnchor != null) {
      if (e && editMode !== prevEditMode) {
        return;
      }

      if (editMode != null) {
        setState({ editMode });
      }

      const start = Math.min(selectionAnchor, offset);
      const end = Math.max(selectionAnchor, offset);
      const selectionDirection = offset > selectionAnchor
        ? SELECTION_DIRECTION_FORWARD
        : SELECTION_DIRECTION_BACKWARD;

      if (!e || start !== end || selectionStart !== selectionEnd || Math.abs(e.movementX) > 2) {
        setSelectionRange(start, end + 1, selectionDirection, false);
      }
    }
  }, [setSelectionRange]);

  const setValue = useCallback((offset: number, value: number) => {
    if (typeof onSetValue === 'function') {
      onSetValue(offset, value);
    }
  }, [onSetValue]);

  const scrollTo = useCallback((scrollTop: number) => {
    if (rowListRef.current) {
      rowListRef.current.scrollTo(scrollTop);
    }
  }, []);

  const scrollToItem = useCallback((rowIndex: number, align?: Align) => {
    if (rowListRef.current) {
      rowListRef.current.scrollToItem(rowIndex, align);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    blur,
    focus,
    scrollTo,
    scrollToItem,
    setSelectionRange,
    setValue,
  }), [blur, focus, scrollTo, scrollToItem, setSelectionRange, setValue]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setState({ isFocused: false });
    if (onBlur) {
      onBlur(e);
    }
  }, [onBlur]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setState({ isFocused: true });
    if (onFocus) {
      onFocus(e);
    }
  }, [onFocus]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const {
      which,
      shiftKey,
      ctrlKey,
      metaKey,
    } = e;

    const {
      columns,
      data,
      editMode,
      nybbleHigh,
      nybbleOffset,
      readOnly,
      rows,
      selectionStart,
      selectionEnd,
      selectionDirection,
      showAscii,
    } = stateRef.current;
    const dataLength = data.length;

    const isSelection = selectionStart !== selectionEnd;
    const isMacKeyboard = isMacLike();

    const offsetAmounts: { [key: number]: number } = {
      [KEY_DOWN]: columns,
      [KEY_LEFT]: 1,
      [KEY_PAGE_DOWN]: rows * columns,
      [KEY_PAGE_UP]: rows * columns,
      [KEY_RIGHT]: 1,
      [KEY_UP]: columns,
    };

    switch (true) {
      // Select all
      case !isMacKeyboard && ctrlKey && which === KEY_A:
      case isMacKeyboard && metaKey && which === KEY_A: {
        setSelectionRange(0, dataLength);
        e.preventDefault();
        return;
      }

      // Go to first character
      case isMacKeyboard && metaKey && which === KEY_UP:
      case !isMacKeyboard && ctrlKey && which === KEY_HOME: {
        if (shiftKey) {
          const end = selectionDirection === SELECTION_DIRECTION_BACKWARD
            ? selectionEnd
            : selectionStart;
          setSelectionRange(0, end, SELECTION_DIRECTION_BACKWARD);
        } else {
          setSelectionRange(0);
        }
        e.preventDefault();
        return;
      }

      // Go to last character
      case isMacKeyboard && metaKey && which === KEY_DOWN:
      case !isMacKeyboard && ctrlKey && which === KEY_END: {
        if (shiftKey) {
          const start = selectionDirection === SELECTION_DIRECTION_BACKWARD
            ? selectionEnd
            : selectionStart;
          setSelectionRange(start, dataLength, SELECTION_DIRECTION_FORWARD);
        } else {
          setSelectionRange(dataLength - 1);
        }
        e.preventDefault();
        return;
      }

      // Toggle between hex and ascii panes
      case (which === KEY_TAB): {
        if (!shiftKey && showAscii && editMode === EDIT_MODE_HEX) {
          setState({ editMode: EDIT_MODE_ASCII });
          e.preventDefault();
        } else if (shiftKey && editMode === EDIT_MODE_ASCII) {
          setState({ editMode: EDIT_MODE_HEX });
          e.preventDefault();
        }
        return;
      }

      // Go to start of line
      case isMacKeyboard && ctrlKey && which === KEY_A:
      case isMacKeyboard && metaKey && which === KEY_LEFT:
      case which === KEY_HOME: {
        const selectionAnchor = selectionDirection === SELECTION_DIRECTION_BACKWARD
          ? selectionStart
          : selectionEnd;
        if (shiftKey) {
          const cursorPosition = columns * Math.floor(Math.max(0, (selectionAnchor - 1)) / columns);
          if (selectionDirection === SELECTION_DIRECTION_BACKWARD) {
            setSelectionRange(selectionEnd, cursorPosition);
          } else {
            setSelectionRange(selectionStart, cursorPosition);
          }
        } else {
          const cursorPosition = columns * Math.floor(selectionAnchor / columns);
          setSelectionRange(cursorPosition);
        }
        e.preventDefault();
        return;
      }

      // Go to end of line
      case isMacKeyboard && ctrlKey && which === KEY_E:
      case isMacKeyboard && metaKey && which === KEY_RIGHT:
      case which === KEY_END: {
        const selectionAnchor = selectionDirection === SELECTION_DIRECTION_BACKWARD
          ? selectionStart
          : selectionEnd;
        if (shiftKey) {
          const cursorPosition = columns * (Math.floor(selectionAnchor / columns) + 1);
          if (selectionDirection === SELECTION_DIRECTION_BACKWARD) {
            setSelectionRange(selectionEnd, cursorPosition);
          } else {
            setSelectionRange(selectionStart, cursorPosition);
          }
        } else {
          const cursorPosition = columns * (Math.floor(selectionAnchor / columns) + 1) - 1;
          setSelectionRange(Math.min(cursorPosition, dataLength - 1));
        }
        e.preventDefault();
        return;
      }

      // Ignore modified keys
      case ctrlKey || metaKey:
        return;

      // Go back one row or column
      case which === KEY_PAGE_UP:
      case which === KEY_UP:
      case which === KEY_LEFT: {
        const offset = offsetAmounts[which] || 1;
        if (shiftKey) {
          if (selectionDirection === SELECTION_DIRECTION_BACKWARD) {
            setSelectionRange(selectionEnd, selectionStart - offset);
          } else {
            setSelectionRange(selectionStart, selectionEnd - offset);
          }
        } else {
          const cursorPosition = isSelection
            ? selectionStart
            : selectionStart - offset;
          setSelectionRange(Math.max(0, cursorPosition));
        }
        e.preventDefault();
        return;
      }

      // Go forward one row or column
      case which === KEY_PAGE_DOWN:
      case which === KEY_DOWN:
      case which === KEY_RIGHT: {
        const offset = offsetAmounts[which] || 1;
        if (shiftKey) {
          if (selectionDirection === SELECTION_DIRECTION_BACKWARD) {
            setSelectionRange(selectionEnd, selectionStart + offset);
          } else {
            setSelectionRange(selectionStart, selectionEnd + offset);
          }
        } else {
          const cursorPosition = isSelection
            ? selectionEnd - 1
            : selectionEnd + offset;
          setSelectionRange(Math.min(cursorPosition, data.length - 1));
        }
        e.preventDefault();
        return;
      }

      // Clear previous character
      case which === KEY_BACK_SPACE: {
        if (!readOnly) {
          if (nybbleOffset && nybbleHigh != null) {
            setState({
              nybbleHigh: null,
              nybbleOffset: 0,
            });
          } else if (shiftKey) {
            setValue(selectionEnd, 0x00);
            setSelectionRange(selectionEnd);
          } else {
            setValue(selectionEnd - 1, 0x00);
            setSelectionRange(selectionEnd - 1);
          }
        }
        e.preventDefault();
        return;
      }

      // Clear next character
      case which === KEY_DELETE: {
        if (!readOnly) {
          if (nybbleOffset && nybbleHigh != null) {
            setState({
              nybbleHigh: null,
              nybbleOffset: 0,
            });
          } else if (shiftKey) {
            setValue(selectionEnd, 0x00);
            setSelectionRange(selectionEnd);
          } else {
            setValue(selectionEnd, 0x00);
            setSelectionRange(selectionEnd + 1);
          }
        }
        e.preventDefault();
        return;
      }

      // Edit hex value
      case editMode === EDIT_MODE_HEX && which in KEY_VALUES: {
        if (!readOnly) {
          const nybbleValue = KEY_VALUES[which];
          if (nybbleOffset && nybbleHigh != null) {
            const value = (nybbleHigh << 4) | nybbleValue;
            setValue(selectionEnd, value);
            setSelectionRange(Math.min(selectionEnd + 1, dataLength - 1));
          } else {
            if (isSelection) {
              setSelectionRange((
                selectionDirection === SELECTION_DIRECTION_BACKWARD
                  ? selectionStart
                  : selectionEnd - 1
              ));
            }
            setState({
              nybbleOffset: 1,
              nybbleHigh: nybbleValue,
            });
          }
        }
        e.preventDefault();
        return;
      }

      // Edit ascii value
      case editMode === EDIT_MODE_ASCII: {
        if (!readOnly) {
          const key = Keycoder.fromEvent(e.nativeEvent);
          if (key.isPrintableCharacter && key.charCode != null) {
            const value = shiftKey ? key.shift.charCode : key.charCode;
            if (value != null) {
              setValue(selectionEnd, value);
              setSelectionRange(Math.min(selectionEnd + 1, dataLength - 1));
            }
          }
        }
        e.preventDefault();
        return;
      }

      // Ignore
      default:
        return;
    }
  }, [setValue, setSelectionRange]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const {
      cursorOffset,
      data,
      editMode: currentEditMode,
    } = stateRef.current;
    const dataLength = data.length;
    const maxOffset = dataLength - cursorOffset;
    e.preventDefault();
    const clipboardText = e.clipboardData.getData('Text');
    const values = currentEditMode === EDIT_MODE_ASCII
      ? clipboardText.split('').map(v => v.charCodeAt(0))
      : (clipboardText.replace(/[^0-9a-f]/gi, '').match(/.{2}/g) || []).map(v => parseInt(v, 16));
    values.forEach((value, i) => {
      if (i < maxOffset) {
        setValue(cursorOffset + i, value);
      }
    });
    setSelectionRange(Math.min(cursorOffset + values.length, dataLength - 1));
  }, [setValue, setSelectionRange]);

  const handleItemsRendered = useCallback((props: ListOnItemsRenderedProps) => {
    setState(props);
    if (onItemsRendered) {
      onItemsRendered(props);
    }
  }, [onItemsRendered]);

  useLayoutEffect(() => {
    if (autoFocus) {
      focus();
    }
  }, [autoFocus, focus]);

  useLayoutEffect(() => {
    if (rowListRef.current) {
      const {
        visibleStartIndex,
        visibleStopIndex,
      } = stateRef.current;
      const rowIndex = Math.floor(state.cursorOffset / columns);
      if (rowIndex <= visibleStartIndex) {
        rowListRef.current.scrollToItem(rowIndex, 'center');
      } else if (rowIndex >= visibleStopIndex) {
        rowListRef.current.scrollToItem(rowIndex, 'center');
      }
    }
  }, [columns, state.cursorOffset]);

  const rowCount = useMemo(
    () => Math.ceil(data.length / columns),
    [data.length, columns],
  );

  const formatOffset = useMemo(() => {
    const padToLength = 2 * Math.ceil(formatHex(Math.max(0, data.length - 1)).length / 2);
    return (offset: number) => formatHex(offset, padToLength);
  }, [data.length]);

  const { formatHeaderOffset, formatHeaderValue } = useMemo(() => ({
    formatHeaderOffset: () => formatOffset(0).replace(/./g, '\u00A0'),
    formatHeaderValue: () => '\u00A0',
  }), [formatOffset]);

  const {
    cursorColumn,
    cursorRow,
  } = useMemo(() => {
    const isForwardSelection = (
      state.selectionStart !== state.selectionEnd
      && state.selectionDirection !== SELECTION_DIRECTION_BACKWARD
    );
    const nextCursorColumn = isForwardSelection
      ? (state.cursorOffset - 1) % columns
      : state.cursorOffset % columns;
    const nextCursorRow = isForwardSelection
      ? Math.floor((state.cursorOffset - 1) / columns)
      : Math.floor(state.cursorOffset / columns);
    return {
      cursorColumn: nextCursorColumn,
      cursorRow: nextCursorRow,
    };
  }, [
    columns,
    state.cursorOffset,
    state.selectionStart,
    state.selectionEnd,
    state.selectionDirection,
  ]);

  const editorStyle = useMemo(() => (
    style && inlineStyles.editor
      ? { ...inlineStyles.editor, ...style }
      : (style || inlineStyles.editor || undefined)
  ), [style, inlineStyles.editor]);

  const headerStyle: React.CSSProperties = useMemo(() => ({
    ...inlineStyles.header,
    height: rowHeight,
    width,
  }), [inlineStyles.header, rowHeight, width]);

  const bodyStyle: React.CSSProperties = useMemo(() => ({
    ...inlineStyles.body,
    overflowY: 'scroll',
  }), [inlineStyles.body]);

  const hexEditorContext: HexEditorContextInterface = useMemo(() => ({
    asciiPlaceholder,
    classNames,
    columns,
    cursorColumn: highlightColumn ? cursorColumn : undefined,
    cursorOffset: state.cursorOffset,
    cursorRow,
    data,
    formatOffset,
    formatValue,
    isEditing: !!state.nybbleOffset,
    nonce,
    nybbleHigh: state.nybbleHigh,
    rows,
    selectionAnchor: state.selectionAnchor,
    selectionDirection: state.selectionDirection,
    selectionEnd: state.selectionEnd,
    selectionStart: state.selectionStart,
    setSelectionEnd,
    setSelectionRange,
    setSelectionStart,
    showAscii,
    showRowLabels,
    styles: inlineStyles,
  }), [
    asciiPlaceholder,
    classNames,
    columns,
    cursorColumn,
    cursorRow,
    data,
    formatOffset,
    formatValue,
    highlightColumn,
    inlineStyles,
    nonce,
    rows,
    setSelectionEnd,
    setSelectionRange,
    setSelectionStart,
    showAscii,
    showRowLabels,
    state.cursorOffset,
    state.nybbleHigh,
    state.nybbleOffset,
    state.selectionAnchor,
    state.selectionDirection,
    state.selectionEnd,
    state.selectionStart,
  ]);

  return (
    <HexEditorContext.Provider value={hexEditorContext}>
      <div
        className={joinClassNames(
          className,
          {
            [classNames.editAscii || '']: state.editMode === EDIT_MODE_ASCII,
            [classNames.editHex || '']: state.editMode === EDIT_MODE_HEX,
            [classNames.notFocused || '']: !state.isFocused && state.selectionAnchor == null,
          },
        )}
        style={editorStyle}
      >
        <input
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          ref={inputRef}
          style={inputStyle || undefined}
          tabIndex={tabIndex}
          type="text"
        />
        {!showColumnLabels ? null : (
          <div className={classNames.header} style={headerStyle}>
            <HexEditorRow
              className={classNames.rowHeader}
              classNames={classNames}
              columns={columns}
              cursorColumn={cursorColumn}
              data={columnData}
              disabled
              formatOffset={formatHeaderOffset}
              formatValue={formatHeaderValue}
              isHeader
              labelOffset={data.length}
              nonce={nonce}
              showAscii={showAscii}
              showLabel={showRowLabels}
              style={inlineStyles.row}
              styles={inlineStyles}
            />
          </div>
        )}
        <HexEditorBody
          className={classNames.body}
          height={showColumnLabels ? height - rowHeight : height}
          onItemsRendered={handleItemsRendered}
          overscanCount={overscanCount || rows}
          rowCount={rowCount}
          rowHeight={rowHeight}
          rows={rows}
          ref={rowListRef}
          style={bodyStyle}
          width={width}
        >
          {children}
        </HexEditorBody>
      </div>
    </HexEditorContext.Provider>
  );
};

HexEditor.displayName = 'HexEditor';

export default memo(forwardRef(HexEditor));
