# Editor Setup
It's puzzling to think people use other editors besides Vim but if you do, feel
free to add some notes here on what your setup is like. It's probably similar
just with way more mouse clicking, hand cramping keyboard shortcuts.

## Vim
Install the [JSX bundle][vimjsx] for syntax highlighting.

If your Vim setup includes [Syntastic][syntastic], you will want the linter and
the configurations installed globally through [npm][npm]. 

```sh
npm install -g babel-eslint eslint eslint-config-airbnb eslint-plugin-react
```

The `package.json` targets the latest release (`*`) for these linters.
This should make it easier to keep in sync with the global installs.

_Todo: Figure out how to have [Syntastic][syntastic] utilize the `package.json` executables._

In a `.vimrc` tell [Syntastic][syntastic] to use [ESLint][eslint].

```vim
let g:syntastic_javascript_checkers = ['eslint']
```

To override any of the existing [ESLint][eslint] rules, pass them through
[Syntastic's][syntastic] `args` property.


```vim
let g:syntastic_javascript_eslint_args = "--rule 'no-console: 0'"
```
_This only pertains to the editor, the overridden rules will still be checked on
CI._

:metal:


<!-- Markdown links -->
[npm]: https://www.npmjs.com
[eslint]: http://eslint.org
[vimjsx]: https://github.com/mxw/vim-jsx
[syntastic]: https://github.com/scrooloose/syntastic

