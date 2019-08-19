import React, { useContext } from 'react';
import { ListChildComponentProps } from 'react-window';

import HexEditorContext from '../contexts/HexEditorContext';

import HexEditorRow from './HexEditorRow';

const HexEditorBodyRow = ({ index: rowIndex, style: itemStyle }: ListChildComponentProps) => {
  const {
    classNames,
    columns,
    cursorColumn,
    cursorOffset,
    cursorRow,
    data,
    formatOffset,
    formatValue,
    isEditing,
    nybbleHigh,
    selectionAnchor,
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
      nybbleHigh={nybbleHigh}
      offset={rowIndex * columns}
      rowIndex={rowIndex}
      selectionDirection={selectionDirection}
      selectionEnd={selectionEnd}
      selectionStart={selectionStart}
      setSelectionEnd={selectionAnchor ? setSelectionEnd : undefined}
      setSelectionRange={setSelectionRange}
      setSelectionStart={selectionAnchor ? undefined : setSelectionStart}
      showAscii={showAscii}
      showLabel={showRowLabels}
      style={styles.row ? { ...itemStyle, ...styles.row } : itemStyle}
      styles={styles}
    />
  );
};

export default HexEditorBodyRow;
