import React, { useContext } from 'react';

import HexEditorContext from '../contexts/HexEditorContext';

const DebugContext = () => {
  const { classNames, data, styles, ...context } = useContext(HexEditorContext);
  // console.log(context, classNames, styles, data);
  return (
    <pre><code>{JSON.stringify(context, null, 2)}</code></pre>
  );
};

export default DebugContext;