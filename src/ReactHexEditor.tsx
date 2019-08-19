import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { HexEditorHandle } from './types';

import hexEditorStyles from './utils/styles';

import HexEditor, { IHexEditorProps } from './components/HexEditor';
import AutoSizeHexEditor, { IAutoSizeHexEditorProps } from './components/AutoSizeHexEditor';

const NoInlineStylesHexEditor: React.RefForwardingComponent<HexEditorHandle, IHexEditorProps> = ({
  inlineStyles = {},
  ...restProps
}: IHexEditorProps, ref) => (
  <HexEditor inlineStyles={inlineStyles} ref={ref} {...restProps} />
);
const ImperativeHexEditor = forwardRef(NoInlineStylesHexEditor);
const StyledHexEditor = styled(ImperativeHexEditor)`${hexEditorStyles}`;

const NoInlineStylesAutoSizeHexEditor: React.RefForwardingComponent<HexEditorHandle, IAutoSizeHexEditorProps> = ({
  inlineStyles = {},
  ...restProps
}: IAutoSizeHexEditorProps, ref) => (
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
