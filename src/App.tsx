import React from 'react';
import styled from 'styled-components';

import { HexEditorHandle } from './types';

import defaultTheme from './themes/default';
import oneDarkProTheme from './themes/oneDarkPro';

import {
  AutoSizeHexEditor,
  HexEditor,
  StyledAutoSizeHexEditor,
  StyledHexEditor,
} from './ReactHexEditor';

const INITIAL_DATA = new Array(0x10000).fill(0)
  .map((_v, i) => (i & 0xff));

const App: React.FC<{ className?: string }> = ({ className = '' }) => {
  const hexEditorRef: React.Ref<HexEditorHandle> = React.useRef(null);
  const data = React.useRef<number[]>(INITIAL_DATA);
  const [nonce, update] = React.useReducer((v: number, _action: void) => v + 1, 0);
  const handleSetValue = React.useCallback((offset, value) => {
    data.current[offset] = value;
    update();
  }, []);

  React.useEffect(() => {
    if (hexEditorRef.current) {
      hexEditorRef.current.focus();
      (window as any).hexEditor = hexEditorRef.current;
    }
  });

  const theme = React.useMemo(() => ({
    hexEditor: oneDarkProTheme,
    // hexEditor: defaultTheme,
  }), []);

  return (
    <div className={className}>
      <div
        style={{
          width: '100vw',
          height: '100vh'
        }}
      >
        <StyledAutoSizeHexEditor
          autoFocus
          // columns={0x10}
          data={data.current}
          // height={400}
          nonce={nonce}
          onSetValue={handleSetValue}
          ref={hexEditorRef}
          // rowHeight={22}
          // rows={0x20}
          showAscii
          showColumnLabels
          showRowLabels
          theme={theme}
          // width={600}
        />
      </div>
      {/* <div>
        <StyledHexEditor
          columns={0x10}
          data={data.current}
          height={400}
          nonce={nonce}
          onSetValue={handleSetValue}
          ref={hexEditorRef}
          rowHeight={22}
          rows={0x10}
          showAscii
          showColumnLabels
          showRowLabels
          style={{
            // width: '100vw',
            // height: '100vh'
          }}
          // theme={{ hexEditor: defaultTheme }}
          theme={{ hexEditor: oneDarkProTheme }}
          width={600}
        />
      </div> */}
      {/* <div>
        <HexEditor
          className="hex-cheap-styles"
          columns={0x10}
          data={data.current}
          nonce={nonce}
          onSetValue={handleSetValue}
          style={{ height: '100vh' }}
        />
      </div> */}
    </div>
  );
}

export default styled(App)`
  display: flex;

  .hex-cheap-styles {
    .byteValue > .nybbleHighValue {
      padding: 1px 0 1px 2px;
    }

    .byteValue > .nybbleLowValue {
      padding: 1px 2px 1px 0;
    }

    .cursor {
      background-color: #008080;
      color: #fff;
    }

    .selection {
      background-color: #000080;
      color: #fff;
    }
  }
`;
