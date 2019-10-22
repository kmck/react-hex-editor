import React, { useContext } from 'react';
import { ListChildComponentProps } from 'react-window';

import HexEditorContext from '../contexts/HexEditorContext';

import HexEditorRow from './HexEditorRow';

const HexEditorBodyRow = ({ index: rowIndex, style: itemStyle }: ListChildComponentProps) => {
  const {
    asciiPlaceholder,
    classNames,
    columns,
    cursorColumn,
    cursorOffset,
    cursorRow,
    data,
    formatOffset,
    formatValue,
    isEditing,
    nonce,
    nybbleHigh,
    selectionDirection,
    selectionEnd,
    selectionStart,
    setSelectionEnd,
    setSelectionRange,
    setSelectionStart,
    showAscii,
    showRowLabels,
    styles,
  } = useContext(HexEditorContext);

  return (
    <HexEditorRow
      asciiPlaceholder={asciiPlaceholder}
      className={classNames.row}
      classNames={classNames}
      columns={columns}
      cursorColumn={cursorColumn}
      cursorOffset={cursorOffset}
      cursorRow={cursorRow}
      data={data}
      formatOffset={formatOffset}
      formatValue={formatValue}
      isEditing={isEditing}
      nonce={nonce}
      nybbleHigh={nybbleHigh}
      offset={rowIndex * columns}
      rowIndex={rowIndex}
      selectionDirection={selectionDirection}
      selectionEnd={selectionEnd}
      selectionStart={selectionStart}
      setSelectionEnd={setSelectionEnd}
      setSelectionRange={setSelectionRange}
      setSelectionStart={setSelectionStart}
      showAscii={showAscii}
      showLabel={showRowLabels}
      style={styles.row ? { ...itemStyle, ...styles.row } : itemStyle}
      styles={styles}
    />
  );
};

HexEditorBodyRow.displayName = 'HexEditorBodyRow';

export default HexEditorBodyRow;
