import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';

import App from './App';

const GlobalStyle = createGlobalStyle`
  body,
  html {
    margin: 0;
    padding: 0;
  }

  :root {
    --scrollbar-width: 20px;
    /* --scrollbar-width: calc(100vw - 100%); */
  }
`;

ReactDOM.render((
  <>
    <GlobalStyle />
    <App />
  </>
), document.getElementById('root'));
