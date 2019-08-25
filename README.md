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
  const data = React.useMemo(() => new Array(100).fill(0), []);
  // If `data` is large, you probably want it to be mutable rather than cloning it over and over.
  // `nonce` can be used to update the editor when `data` is reference that does not change.
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

If you'd rather provide your own CSS and skip the `styled-components` depenency, that's okay too.
There are a few inline styles baked into the component, but you're free to modify the fonts and
colors to suit your tastes.

```jsx
import HexEditor from 'react-hex-editor/unstyled';

const YourApp = () => {
  return (
    <HexEditor
      className="your-hex-editor"
      columns={0x10}
      data={data.current}
      nonce={nonce}
      onSetValue={handleSetValue}
    />
  )
};
```

Your styles might look something like this:

```css
.your-hex-editor .byteValue > .nybbleHighValue {
  padding: 1px 0 1px 2px;
}

.your-hex-editor .byteValue > .nybbleLowValue {
  padding: 1px 2px 1px 0;
}

.your-hex-editor .cursor {
  background-color: #0cc;
  color: #fff;
}

.your-hex-editor .selection {
  background-color: #0cc;
  color: #fff;
}
```


## API

### HexEditor

##### Standard Props

###### `className`

Classname applied to the Hex Editor's root element.

###### `data` (required)

`Uint8Array` or array of integerss (0-255) to display in the hex editor.

##### `nonce`

If `data` is mutable, update the `nonce` when there is a change so that the editor re-renders
with the latest data.

###### `onSetValue`

Callback that is invoked with `offset` and `value` when attempting to write a value. Typically,
you'd want to set `data[offset] = value` here.


##### Sizing Props

###### `columns`

Number of columns to display. Inferred from the width if not explicitly provided.

###### `rows`

Number of rows to display. Inferred from the height if not explicitly provided.

###### `byteHeight`

Pixel height of a single byte. Inferred if not explicitly provided.

###### `byteWidth`

Pixel width of a single byte. Inferred if not explicitly provided.


##### Styling Props

###### `theme.hexEditor` (only for `styled-components` version)

Includes various keys that are used for fonts and colors of the Hex Editor.

###### `editorStyle`

Inline styles applied to the editor root. Used for setting `position` and the `font-family`.

Set to `null` to disable the default styles.

###### `byteStyle`

Inline styles applied to a single byte. Used for setting flexbox alignment.

Set to `null` to disable the default styles.

###### `measureByteStyle`

Inline styles applied to the sample byte used to infer its size. Used for making it invisible and non-interactive.

Set to `null` to disable the default styles.

###### `inputStyle`

Did you know? There is an input that handles key events, focus, and copy/paste for the Hex Editor!
These are the inline styles applied to the input element that make it invisible and cover the editor.

Set to `null` to disable the default styles.

###### `style`

Inline styles applied to the editor root. These styles override but do not replace styles in `editorStyle`.


##### Various Input Props

###### `onBlur`

Callback for when focus is lost.

###### `onFocus`

Callback for when focus is gained.

###### `readOnly`

Set to `true` if the Hex Editor is more of a Hex Viewer.

###### `tabIndex`

Set it, if you want!


## @TODO

- Improve clipboard support
- Undo/redo history
- Text/byte search


## Contributing

Thank you for your interest! If you find a bug or want to add a new feature, open an issue or create
a pull request, and we'll figure it out from there.


## License

ISC © [Keith McKnight](https://github.com/kmck)

[yarn]: https://yarnpkg.com/lang/en/docs/install

[npm]: https://docs.npmjs.com/cli/install