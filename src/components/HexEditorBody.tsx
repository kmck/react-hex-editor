import React, {
  forwardRef,
  memo,
} from 'react';
import {
  ListChildComponentProps,
  FixedSizeList as List,
} from 'react-window';

import HexEditorBodyRow from './HexEditorBodyRow';

export interface IHexEditorProps {
  className?: string,
  height: number,
  itemRenderer?: React.ComponentType<ListChildComponentProps>,
  rowCount: number,
  rowHeight: number,
  rows: number,
  style?: React.CSSProperties,
  width: number,
};

const HextEditorBody: React.RefForwardingComponent<List, IHexEditorProps> = ({
  className = undefined,
  height,
  itemRenderer = HexEditorBodyRow,
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
      overscanCount={rows}
      ref={ref}
      style={{ ...style, overflowY: 'scroll' }}
      width={width}
    >
      {itemRenderer}
    </List>
  );
};

const ImperativeHexEditorBody = forwardRef(HextEditorBody);

export default memo(ImperativeHexEditorBody);
