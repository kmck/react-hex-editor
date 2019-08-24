import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useReducer,
} from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import {
  HexEditorHandle,
  HexEditorInlineStyles,
  HexEditorClassNames,
} from '../types';

import CLASS_NAMES from '../constants/classNames';
import INLINE_STYLES, {
  CONTAINER_STYLE,
  MEASURE_STYLE,
} from '../constants/inlineStyles';
import {
  formatHex,
  getScrollbarSize,
} from '../utils';

import HexEditor from './HexEditor';
import HexEditorMeasureRow from './HexEditorMeasureRow';

interface State {
  asciiWidth: number,
  byteWidth: number,
  columns: number,
  gutterWidth: number,
  labelWidth: number,
  rowHeight: number,
  rows: number,
};

interface Action {
  asciiWidth?: number,
  byteWidth?: number,
  columns?: number,
  gutterWidth?: number,
  labelWidth?: number,
  rowHeight?: number,
  rows?: number,
};

export interface AutoSizeHexEditorProps {
  asciiWidth?: number,
  byteWidth?: number,
  className?: string,
  classNames?: HexEditorClassNames,
  columns?: number,
  containerClassName?: string,
  containerStyle?: React.CSSProperties | null,
  data: Uint8Array | number[],
  formatValue?: (value: number) => string,
  gutterWidth?: number,
  height?: number,
  inlineStyles?: HexEditorInlineStyles,
  inputStyle?: React.CSSProperties | null,
  labelWidth?: number,
  measureStyle?: React.CSSProperties | null,
  nonce?: number | string,
  onBlur?: (e: React.FocusEvent) => void,
  onFocus?: (e: React.FocusEvent) => void,
  onSetValue?: (offset: number, value: number) => void,
  readOnly?: boolean,
  rowHeight?: number,
  rows?: number,
  showAscii?: boolean,
  showColumnLabels?: boolean,
  showRowLabels?: boolean,
  style?: React.CSSProperties | null,
  tabIndex?: number,
  width?: number,
};

const reducer = (prevState: State, mergeState: Action) => ({ ...prevState, ...mergeState });

const AutoSizeHexEditor: React.RefForwardingComponent<HexEditorHandle, AutoSizeHexEditorProps> = ({
  asciiWidth: explicitAsciiWidth,
  byteWidth: explicitByteWidth,
  classNames = CLASS_NAMES,
  columns: explicitColumns,
  containerClassName,
  containerStyle = CONTAINER_STYLE,
  gutterWidth: explicitGutterWidth,
  height: explicitHeight,
  inlineStyles = INLINE_STYLES,
  labelWidth: explicitLabelWidth,
  measureStyle = MEASURE_STYLE,
  rowHeight: explicitRowHeight,
  rows: explicitRows,
  width: explicitWidth,
  ...props
}, ref) => {
  const [scrollbarWidth] = useMemo(() => getScrollbarSize(), []);

  const [state, setState] = useReducer(reducer, {
    asciiWidth: explicitAsciiWidth || 10,
    byteWidth: explicitByteWidth || 20,
    columns: explicitColumns || 0x10,
    gutterWidth: explicitGutterWidth || 0,
    labelWidth: explicitLabelWidth || 80,
    rowHeight: explicitRowHeight || 20,
    rows: explicitRows || 0x10,
  });

  const handleMeasure = useCallback(({ asciiWidth, byteWidth, gutterWidth, labelWidth, rowHeight }: {
    asciiWidth: number,
    byteWidth: number,
    gutterWidth: number,
    labelWidth: number,
    rowHeight: number,
  }) => {
    setState({
      asciiWidth: explicitAsciiWidth == null ? asciiWidth : explicitAsciiWidth,
      byteWidth: explicitByteWidth == null ? byteWidth : explicitByteWidth,
      gutterWidth: explicitGutterWidth == null? gutterWidth : explicitGutterWidth,
      labelWidth: explicitLabelWidth == null ? labelWidth : explicitLabelWidth,
      rowHeight: explicitRowHeight == null ? rowHeight : explicitRowHeight,
    });
  }, [explicitAsciiWidth, explicitByteWidth, explicitGutterWidth, explicitLabelWidth, explicitRowHeight]);

  const formatOffset = useMemo(() => {
    const padToLength = 2 * Math.ceil(formatHex(Math.max(0, props.data.length - 1)).length / 2);
    return (offset: number) => formatHex(offset, padToLength);
  }, [props.data.length]);

  const measureStyles = useMemo(() => ({
    ascii: { ...measureStyle, ...inlineStyles.ascii },
    byte: { ...measureStyle, ...inlineStyles.byte },
    gutter: { ...measureStyle, ...inlineStyles.gutter },
    offsetLabel: { ...measureStyle, ...inlineStyles.offsetLabel },
  }), [inlineStyles, measureStyle]);

  return (
    <>
      <HexEditorMeasureRow
        asciiValue={0x41}
        asciiWidth={explicitAsciiWidth}
        byteWidth={explicitByteWidth}
        className={props.className}
        classNames={classNames}
        formatOffset={formatOffset}
        formatValue={props.formatValue}
        gutterWidth={explicitGutterWidth}
        labelWidth={explicitLabelWidth}
        offset={props.data.length}
        onMeasure={handleMeasure}
        style={measureStyle}
        styles={measureStyles}
        value={0x00}
      />
      <AutoSizer
        disableWidth={explicitWidth != null || explicitColumns != null}
        disableHeight={explicitHeight != null || explicitRows != null}
      >
        {({ width: autoSizerWidth, height: autoSizerHeight }) => {
          // Horizontal
          let width = explicitWidth == null ? autoSizerWidth : explicitWidth;
          let columns = explicitColumns;
          if (columns != null && width == null) {
            // Calculate width from the columns and component measurements
            width = scrollbarWidth;
            if (props.showRowLabels) {
              width += state.labelWidth + state.gutterWidth;
            }
            width += columns * state.byteWidth;
            if (props.showAscii) {
              width += (columns * state.asciiWidth) + state.gutterWidth;
            }
            width = Math.ceil(width);
          } else if (width != null) {
            // Determine the number of columns using the width
            let remainingWidth = width - scrollbarWidth;
            if (props.showRowLabels) {
              remainingWidth -= state.labelWidth + state.gutterWidth;
            }
            if (props.showAscii) {
              remainingWidth -= state.gutterWidth;
            }
            const columnMinimumWidth = props.showAscii
              ? state.asciiWidth + state.byteWidth
              : state.byteWidth;
            columns = Math.max(1, Math.floor(remainingWidth / columnMinimumWidth));
          } else {
            console.warn('Horizontal size inference failed!');
            columns = 1;
          }

          // Vertical
          let height = explicitHeight == null ? autoSizerHeight : explicitHeight;
          let rows = explicitRows;
          const rowHeight = explicitRowHeight == null ? state.rowHeight : explicitRowHeight;
          if (rows != null && height == null) {
            // Calculate height from the columns and component measurements
            height = rows * rowHeight;
            if (props.showColumnLabels) {
              height += rowHeight;
            }
            height = Math.ceil(height);
          } else if (height != null) {
            // Determine the number of rows using the height
            rows = Math.max(1, height && rowHeight && Math.floor(height / rowHeight));
            if (rows && props.showColumnLabels) {
              rows -= 1;
            }
          } else {
            console.warn('Vertical size inference failed!');
            rows = 1;
          }

          return (
            <HexEditor
              classNames={classNames}
              columns={columns}
              height={height}
              inlineStyles={inlineStyles}
              ref={ref}
              rowHeight={rowHeight}
              rows={rows}
              width={width}
              {...props}
              style={{
                ...props.style,
                width,
                height,
              }}
            />
          );
        }}
      </AutoSizer>
    </>
  );
};

AutoSizeHexEditor.displayName = 'AutoSizeHexEditor';

export default memo(forwardRef(AutoSizeHexEditor));
