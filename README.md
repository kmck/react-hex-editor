# React Hex Editor

View and edit binary data in React.

## Install

[yarn][]:

```bash
yarn add react-hex-editor
```

[npm][]:

```bash
npm install --save react-hex-editor
```


## Usage

This uses `styled-components` for ease of theming. It's a peer dependency, so don't forget to make
sure it's installed!

```jsx
import HexEditor from 'react-hex-editor';
import oneDarkPro from 'react-hex-editor/themes/oneDarkPro';

const YourApp = () => {
  // `data` contains the bytes to show. It can also be `Uint8Array`!
  // If `data` is large, you probably want it to be mutable rather than cloning
  // it over and over.
  const data = React.useMemo(() => new Array(100).fill(0), []);
  // `nonce` can be used to update the editor when `data` is reference that
  // does not change.
  const [nonce, setNonce] = useState(0);
  // The callback facilitates updates to the source data.
  const handleSetValue = React.useCallback((offset, value) => {
    data[offset] = value;
    setNonce(v => (v + 1));
  }, [data]);

  return (
    <HexEditor
      columns={0x10}
      data={data}
      nonce={nonce}
      onSetValue={handleSetValue}
      theme={{ hexEditor: oneDarkPro }}
    />
  )
};
```

### Custom Styling

If you'd rather provide your own CSS and skip the `styled-components` depenency, that's okay too.


There are a few inline styles baked into the component for the basic functionality, but you're free
to modify the fonts and colors to suit your tastes. If you'd like to disable the inline styles and
use an all-CSS solution, pass an empty object for the `inlineStyles` prop.

```jsx
import { UnstyleHexEditor } from 'react-hex-editor';

const YourApp = () => {
  /* ... */

  return (
    <UnstyleHexEditor
      className="your-hex-editor"
      columns={0x10}
      data={data.current}
      inlineStyles={{}} // Optional: override or disable inline styles
      nonce={nonce}
      onSetValue={handleSetValue}
    />
  )
};
```

Refer to [styles.ts](src/utils/styles.ts) for an example of how to style. The permutations of
combined classnames for each hex editor component really adds up, so you probably want to use a CSS
preprocessor that supports nesting.

### Explicit Sizing

The default `HexEditor` and `UnstyledHexEditor` components infer as much as necessary to calculate
various dimensions based on the provided props. Underlying this is a `BaseHexEditor` component that
needs everything spelled out.

```jsx
import { BaseHexEditor /* ot UnstyledBaseHexEditor */ } from 'react-hex-editor';

const YourApp = () => {
  /* ... */

  return (
    <BaseHexEditor
      className="your-hex-editor"
      columns={0x10} // REQUIRED
      data={data.current}
      height={500} // REQUIRED
      nonce={nonce}
      rowHeight={22} // REQUIRED
      rows={0x10} // REQUIRED
      onSetValue={handleSetValue}
      width={600} // REQUIRED
    />
  )
};
```

_You probably don't need to use this._

## API

### HexEditor

##### Standard Props

###### `className`

Classname applied to the Hex Editor's root element.

###### `classNames`

Classnames applied to various components of the Hex Editor that can be used for styling.

###### `data` (required)

`Uint8Array` or array of integerss (0-255) to display in the hex editor.

###### `nonce`

If `data` is mutable, update the `nonce` when there is a change so that the editor re-renders
with the latest data.

###### `onSetValue`

Callback that is invoked with `offset` and `value` when attempting to write a value. Typically,
you'd want to set `data[offset] = value` here.


##### Display Props

###### `showAscii`

Whether to show the ascii representation of the data.

###### `showColumnLabels`

Whether to show a fixed row at the top of the table for column offset labels.

###### `showRowLabels`

Whether to show row offset labels.

###### `highlightColumn`

Set to `true` to add a classname for the currently active column if you want to style it.
Note: This can lead to degraded performance when there are a lot of rows visible.

###### `formatValue`

Function that takes the byte value and converts it to its ASCII representation. You can override it
to change the ASCII output.

###### `overscanCount`

Controls the number of rows rendered outside of the viewport. Higher numbers will reduce blank areas
when scrolling quickly, but may degrade performance.


##### Sizing Props (Can be inferred by auto-sizing component)

###### `columns`

Number of columns to display. (Can be inferred by auto-sizing component using width.)

###### `rows`

Number of rows to display. (Can be inferred by auto-sizing component using height.)

###### `width`

Pixel width of the overall hex editor.

###### `height`

Pixel height of the overall hex editor.

###### `rowHeight`

Pixel height of a single row.

###### `byteWidth` (auto-size only)

Pixel width of a single byte.

###### `asciiWidth` (auto-size only)

Pixel width of a single ASCII character.

###### `gutterWidth` (auto-size only)

Pixel width of the gutter between sections.

###### `scrollbarWidth` (auto-size only)

Pixel width of the scrollbar.


##### Styling Props

###### `theme.hexEditor` (`styled-components` only)

Includes various keys that are used for fonts and colors of the Hex Editor.

###### `measureStyle` (auto-size only)

Inline styles applied to the sample components used to infer size. Used for making them invisible
and non-interactive.

Set to `null` to disable the default styles.

###### `inputStyle`

Did you know? There is an input that handles key events, focus, and copy/paste for the Hex Editor!
These are the inline styles applied to that element that make it invisible and cover the editor.

Set to `null` to disable the default styles

###### `style`

Inline styles applied to the editor root.

###### `inlineStyles`

Inline styles for various editor components.

###### `inlineStyles.ascii`

Inline styles applied to a single ASCII character. Used for setting flexbox alignment.

###### `inlineStyles.asciiValues`

Inline styles applied to the ASCII section of a row. Used for setting flexbox alignment.

###### `inlineStyles.body`

Inline styles applied to Hex Editor body area. Used to force the scrollbar.

###### `inlineStyles.byte`

Inline styles applied to a single byte. Used for setting flexbox alignment.

###### `inlineStyles.byteValues`

Inline styles applied to the byte section of a row. Used for setting flexbox alignment.

###### `inlineStyles.editor`

Inline styles applied to the editor root. Used for setting `position` and the `font-family`.

###### `inlineStyles.gutter`

Inline styles applied to the gutter. Unstyled by default.

###### `inlineStyles.header`

Inline styles applied to Hex Editor header area. Used to force the scrollbar.

###### `inlineStyles.offsetLabel`

Inline styles applied to an offset label. Used for setting flexbox alignment.

###### `inlineStyles.row`

Inline styles applied to a single row. Used for setting flexbox alignment.


##### Input Behavior Props

###### `autoFocus`

Set to `true` to focus the Hex Editor on mount.

###### `onBlur`

Callback for when focus is lost.

###### `onFocus`

Callback for when focus is gained.

###### `readOnly`

Set to `true` if the Hex Editor is more of a Hex Viewer.

###### `tabIndex`

Set it, if you want!


#### Imperative Interface

The following functions are available is you use a `ref` on the Hex Editor.

###### `blur`

Drops focus from the Hex Editor.

###### `focus`

Takes focus for the Hex Editor.

###### `scrollTo(scrollTop)`

Scroll to the specified pixel offset.

###### `scrollToItem(rowIndex, [align = 'auto'])`

Scroll to the specified row offset. Align is from [react-window] and accepts `'auto'`, `'smart'`,
`'center'`, `'end'`, or `'start'`.

###### `setSelectionRange(start, [end = start], [direction = null], [takeFocus = false])`

Selects a range in the Hex Editor.

###### `setValue(offset, value)`

Sets a value in the Hex Editor.


## @TODO

- Improve documentation
- Improve clipboard support
- Undo/redo history
- Text/byte search
- Demo page


## Contributing

Thank you for your interest! If you find a bug or want to add a new feature, open an issue or create
a pull request, and we'll figure it out from there.


## License

ISC © [Keith McKnight](https://github.com/kmck)

[yarn]: https://yarnpkg.com/lang/en/docs/install

[npm]: https://docs.npmjs.com/cli/install

[react-window]: https://react-window.now.sh/#/api/FixedSizeList
