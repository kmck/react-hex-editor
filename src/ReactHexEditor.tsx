import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { HexEditorHandle } from './types';
import { EMPTY_INLINE_STYLES } from './constants';
import hexEditorStyles from './utils/styles';

import HexEditor, { HexEditorProps } from './components/HexEditor';
import AutoSizeHexEditor, { AutoSizeHexEditorProps } from './components/AutoSizeHexEditor';

const NoInlineStylesHexEditor: React.RefForwardingComponent<HexEditorHandle, HexEditorProps> = ({
  inlineStyles = EMPTY_INLINE_STYLES,
  ...restProps
}: HexEditorProps, ref) => (
  <HexEditor inlineStyles={inlineStyles} ref={ref} {...restProps} />
);
const ImperativeHexEditor = forwardRef(NoInlineStylesHexEditor);
const StyledHexEditor = styled(ImperativeHexEditor)`${hexEditorStyles}`;

const NoInlineStylesAutoSizeHexEditor: React.RefForwardingComponent<HexEditorHandle, AutoSizeHexEditorProps> = ({
  inlineStyles = EMPTY_INLINE_STYLES,
  ...restProps
}: AutoSizeHexEditorProps, ref) => (
  <AutoSizeHexEditor inlineStyles={inlineStyles} ref={ref} {...restProps} />
);
const ImperativeAutoSizeHexEditor = forwardRef(NoInlineStylesAutoSizeHexEditor);
const StyledAutoSizeHexEditor = styled(ImperativeAutoSizeHexEditor)`${hexEditorStyles}`;

export {
  AutoSizeHexEditor,
  HexEditor,
  StyledAutoSizeHexEditor,
  StyledHexEditor,
};
