import React, { useLayoutEffect, useRef } from 'react';

import {
  HexEditorClassNames,
  HexEditorInlineStyles,
  ValueFormatter,
} from '../types';

import {
  EMPTY_CLASSNAMES,
  EMPTY_INLINE_STYLES,
} from '../constants';

import { getScrollbarSize } from '../utils';

import HexOffsetLabel from './HexOffsetLabel';
import HexEditorGutter from './HexEditorGutter';
import HexByteValue from './HexByteValue';
import HexAsciiValue from './HexAsciiValue';

interface Props {
  asciiPlaceholder?: string | JSX.Element | null,
  asciiValue?: number,
  asciiWidth?: number,
  byteWidth?: number,
  className?: string,
  classNames?: HexEditorClassNames,
  data?: Uint8Array | number[],
  formatOffset?: (offset: number) => string | number,
  formatValue?: ValueFormatter,
  gutterWidth?: number,
  labelWidth?: number,
  offset?: number,
  onMeasure?: (measurements: {
    asciiWidth: number,
    byteWidth: number,
    gutterWidth: number,
    labelWidth: number,
    rowHeight: number,
    scrollbarWidth: number,
  }) => void,
  rowHeight?: number,
  style?: React.CSSProperties | null,
  styles?: HexEditorInlineStyles,
  value?: number,
};

const HexEditorMeasureRow = ({
  asciiPlaceholder,
  asciiValue,
  asciiWidth: explicitAsciiWidth,
  byteWidth: explicitByteWidth,
  className,
  classNames = EMPTY_CLASSNAMES,
  formatOffset,
  formatValue,
  gutterWidth: explicitGutterWidth,
  styles = EMPTY_INLINE_STYLES,
  labelWidth: explicitLabelWidth,
  offset,
  onMeasure,
  rowHeight: explicitRowHeight,
  style,
  value = 0,
}: Props) => {
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const measureGutterRef = useRef<HTMLDivElement>(null);
  const measureLabelRef = useRef<HTMLDivElement>(null);
  const measureByteRef = useRef<HTMLDivElement>(null);
  const measureAsciiRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let scrollbarWidth = 0;
    let gutterWidth = 0;
    let asciiWidth = 0;
    let byteWidth = 0;
    let labelWidth = 0;
    let rowHeight = 0;

    if (measureContainerRef.current) {
      [scrollbarWidth] = getScrollbarSize(measureContainerRef.current);
    }
    if (measureGutterRef.current) {
      const gutterRect = measureGutterRef.current.getBoundingClientRect();
      gutterWidth = gutterRect.width;
      rowHeight = Math.max(rowHeight, gutterRect.height);
    }
    if (measureAsciiRef.current) {
      const asciiRect = measureAsciiRef.current.getBoundingClientRect();
      asciiWidth = asciiRect.width;
      rowHeight = Math.max(rowHeight, asciiRect.height);
    }
    if (measureByteRef.current) {
      const byteRect = measureByteRef.current.getBoundingClientRect();
      byteWidth = byteRect.width;
      rowHeight = Math.max(rowHeight, byteRect.height);
    }
    if (measureLabelRef.current) {
      const labelRect = measureLabelRef.current.getBoundingClientRect();
      labelWidth = labelRect.width;
      rowHeight = Math.max(rowHeight, labelRect.height);
    }

    if (onMeasure) {
      onMeasure({
        asciiWidth,
        byteWidth,
        gutterWidth,
        labelWidth,
        rowHeight,
        scrollbarWidth,
      });
    }
  }, [onMeasure]);

  return (
    <div className={className} style={style || undefined} ref={measureContainerRef}>
      <HexEditorGutter
        className={classNames.gutter}
        ref={measureGutterRef}
        style={{ width: explicitGutterWidth, height: explicitRowHeight, ...styles.gutter }}
      />
      <HexOffsetLabel
        className={classNames.offsetLabel}
        formatOffset={formatOffset}
        ref={measureLabelRef}
        offset={offset}
        style={{ width: explicitLabelWidth, height: explicitRowHeight, ...styles.offsetLabel }}
      />
      <HexByteValue
        className={classNames.byte}
        classNames={classNames}
        ref={measureByteRef}
        style={{ width: explicitByteWidth, height: explicitRowHeight, ...styles.byte }}
        value={value}
      />
      <HexAsciiValue
        className={classNames.ascii}
        classNames={classNames}
        formatValue={formatValue}
        placeholder={asciiPlaceholder}
        ref={measureAsciiRef}
        style={{ width: explicitAsciiWidth, height: explicitRowHeight, ...styles.ascii }}
        value={asciiValue == null ? value : asciiValue}
      />
    </div>
  );
};

HexEditorMeasureRow.displayName = 'HexEditorMeasureRow';

export default HexEditorMeasureRow;
