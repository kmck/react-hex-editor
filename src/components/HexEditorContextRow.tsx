import React, { useContext } from 'react';

import { HexEditorRowProps } from '../types';

import HexEditorContext from '../contexts/HexEditorContext';

import HexEditorRow from './HexEditorRow';

const HexEditorContextRow = (props: HexEditorRowProps) => {
  const hexEditorContext = useContext(HexEditorContext);
  return (
    <HexEditorRow {...hexEditorContext} {...props} />
  );
};

export default HexEditorContextRow;
