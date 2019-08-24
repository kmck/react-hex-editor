import React, {
  forwardRef,
  memo,
} from 'react';
import {
  ListChildComponentProps,
  ListOnItemsRenderedProps,
  ListOnScrollProps,
  FixedSizeList as List,
} from 'react-window';

import HexEditorBodyRow from './HexEditorBodyRow';

export interface HexEditorProps {
  className?: string,
  height: number,
  itemRenderer?: React.ComponentType<ListChildComponentProps>,
  onItemsRendered?: (props: ListOnItemsRenderedProps) => any,
  onScroll?: (props: ListOnScrollProps) => any,
  overscanCount: number,
  rowCount: number,
  rowHeight: number,
  rows: number,
  style?: React.CSSProperties,
  width: number,
};

const HexEditorBody: React.RefForwardingComponent<List, HexEditorProps> = ({
  className = undefined,
  height,
  itemRenderer = HexEditorBodyRow,
  onItemsRendered,
  onScroll,
  overscanCount,
  rowCount,
  rowHeight,
  rows,
  style,
  width,
}, ref) => {
  return (
    <List
      className={className}
      height={height}
      itemCount={rowCount}
      itemSize={rowHeight}
      layout="vertical"
      onItemsRendered={onItemsRendered}
      onScroll={onScroll}
      overscanCount={overscanCount}
      ref={ref}
      style={{ ...style, overflowY: 'scroll' }}
      width={width}
    >
      {itemRenderer}
    </List>
  );
};

HexEditorBody.displayName = 'HexEditorBody';

export default memo(forwardRef(HexEditorBody));
