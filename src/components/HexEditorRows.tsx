import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import {
  ListChildComponentProps,
  ListOnItemsRenderedProps,
  ListOnScrollProps,
  FixedSizeList as List,
} from 'react-window';

import { HexEditorBodyChildren } from '../types';

import HexEditorRow from './HexEditorRow';
import HexEditorRowLabel from './HexEditorRowLabel';
import HexEditorRowBytes from './HexEditorRowBytes';
// import HexEditorRowAscii from './HexEditorRowAscii';

export interface HexEditorRowsProps {
  children?: HexEditorBodyChildren,
  className?: string,
  height: number,
  onItemsRendered: (props: ListOnItemsRenderedProps) => any,
  onScroll?: (props: ListOnScrollProps) => any,
  overscanCount: number,
  rowCount: number,
  rowHeight: number,
  rows: number,
  showColumnLabels?: boolean,
  showRowLabels?: boolean,
  style?: React.CSSProperties,
  width: number,
};

const HexEditorRows: React.RefForwardingComponent<List, HexEditorRowsProps> = ({
  children: bodyChildren,
  className = undefined,
  height,
  onItemsRendered,
  onScroll,
  overscanCount,
  rowCount,
  rowHeight,
  rows,
  showColumnLabels = true,
  showRowLabels = true,
  style,
  width,
}, ref: React.Ref<List>) => {
  const itemData = useMemo(() => ({
    foo: 'bar'
  }), []);

  const {
    rowSectionRenderers,
    rowSections,
  } = useMemo(() => {
    const sections = ['label', 'bytes'];
    // const sections = ['label', 'bytes', 'ascii'];
    const sectionRenderers = {
      // ascii: HexEditorRowLabel,
      byte: HexEditorRowBytes,
      label: HexEditorRowLabel,
    };
    return {
      rowSectionRenderers: sectionRenderers,
      rowSections: sections,
    };
  }, [showRowLabels]);

  const rowRenderer = useCallback(({ data, index, style }: ListChildComponentProps) => {
    const rowIndex = showColumnLabels ? index - 1 : index;
    return (
      <HexEditorRow
        rowIndex={rowIndex}
        rowSectionRenderers={rowSectionRenderers}
        rowSections={rowSections}
        style={style}
      />
    );
  }, [rowSectionRenderers, showColumnLabels]);

  const bodyRowRenderer = useMemo(() => (showColumnLabels
    ? (props: ListChildComponentProps) => (props.index ? rowRenderer(props) : null)
    : rowRenderer
  ), [showColumnLabels]);

  const innerElementType = useMemo(() => {
    const stickyStyle: React.CSSProperties = { position: 'sticky', top: 0, left: 0 };
    return forwardRef(({
      children: listChildren,
      ...props
    }, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} {...props}>
        {(showColumnLabels
          ? rowRenderer({ data: itemData, index: 0, style: stickyStyle })
          : null
        )}
        {listChildren}
        {(
          typeof bodyChildren === 'function'
            ? bodyChildren()
            : bodyChildren
        )}
      </div>
    ));
  }, [bodyChildren, itemData, rowRenderer, showColumnLabels]);

  return (
    <List
      className={className}
      height={height}
      innerElementType={innerElementType}
      itemCount={rowCount}
      itemData={itemData}
      itemSize={rowHeight}
      layout="vertical"
      onItemsRendered={onItemsRendered}
      onScroll={onScroll}
      overscanCount={overscanCount}
      ref={ref}
      style={{ ...style, overflowY: 'scroll' }}
      width={width}
    >
      {bodyRowRenderer}
    </List>
  );
};

HexEditorRows.displayName = 'HexEditorRows';

export default memo(forwardRef(HexEditorRows));
