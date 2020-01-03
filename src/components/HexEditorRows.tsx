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

import { HexEditorBodyChildren, HexEditorSectionRenderer } from '../types';

import HexEditorContextRow from './HexEditorContextRow';
import HexEditorRowLabel from './HexEditorRowLabel';
import HexEditorRowBytes from './HexEditorRowBytes';
import HexEditorRowAscii from './HexEditorRowAscii';

export interface HexEditorRowsProps<K extends string = string> {
  children?: HexEditorBodyChildren,
  className?: string,
  columns: number,
  height: number,
  onItemsRendered: (props: ListOnItemsRenderedProps) => any,
  onScroll?: (props: ListOnScrollProps) => any,
  overscanCount: number,
  rowCount: number,
  rowHeight: number,
  rows: number,
  sectionRenderers?: { [key in K]: HexEditorSectionRenderer },
  sections?: K[],
  showColumnLabels?: boolean,
  showRowLabels?: boolean,
  style?: React.CSSProperties,
  width: number,
};

const HexEditorRows: React.RefForwardingComponent<List, HexEditorRowsProps> = ({
  children: bodyChildren,
  className = undefined,
  columns,
  height,
  onItemsRendered,
  onScroll,
  overscanCount,
  rowCount,
  rowHeight,
  rows,
  sectionRenderers: customSectionRenderers,
  sections: customSections = ['ascii'],
  showColumnLabels = true,
  showRowLabels = true,
  style,
  width,
}, ref: React.Ref<List>) => {
  // This gets passed to `rowRenderer()` as `data`
  const itemData = useMemo(() => ({
    columns,
    rows,
  }), [columns, rows]);

  // Generate main sections of each row
  const {
    rowSectionRenderers,
    rowSections,
  } = useMemo(() => {
    const sectionRenderers: { [key: string]: HexEditorSectionRenderer } = {
      ascii: HexEditorRowAscii,
      bytes: HexEditorRowBytes,
      label: HexEditorRowLabel,
      ...customSectionRenderers,
    };

    const sections: string[] = ['bytes', ...customSections];

    if (showRowLabels) {
      sections.unshift('label');
    }

    return {
      rowSectionRenderers: sectionRenderers,
      rowSections: sections,
    };
  }, [showRowLabels, customSectionRenderers, customSections]);

  interface HexEditorRowsChildComponentProps extends ListChildComponentProps {
    data: typeof itemData
  }

  // Render a single row, honoring the column label row offset if in use
  const rowRenderer = useCallback(({ data: rowItemData, index, style }: HexEditorRowsChildComponentProps) => {
    const rowIndex = showColumnLabels ? index - 1 : index;
    const offset = rowIndex < 0 ? -1 : rowIndex * rowItemData.columns;
    return (
      <HexEditorContextRow
        {...rowItemData}
        offset={offset}
        rowIndex={rowIndex}
        rowSectionRenderers={rowSectionRenderers}
        rowSections={rowSections}
        style={{
          ...style,
          display: 'flex',
        }}
      />
    );
  }, [rowSectionRenderers, showColumnLabels]);

  // Render the HexEditor body, excluing the fixed row as necessary
  const bodyRowRenderer = useMemo(() => (showColumnLabels
    ? (props: ListChildComponentProps) => (props.index ? rowRenderer(props) : null)
    : rowRenderer
  ), [showColumnLabels]);

  // Render the list of HexEditorRow components as well as the fixed row, if needed
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
