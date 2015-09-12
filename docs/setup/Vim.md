# Vim

You're going to want the [JSX bundle][vimjsx] installed for syntax highlighting.

If your setup includes [Syntastic][syntastic], you'll want the linter and the
configurations installed globally through [npm][npm]. 

```
npm install -g babel-eslint eslint eslint-config-airbnb eslint-plugin-react
```

Within this repository we target the latest version release (`*`) for these
linters in the [package.json file][package]. It should make it easier to ensure
the project and your global installs stay in sync.


In your `.vimrc` tell [Syntastic][syntastic] to use [ESLint][eslint] as your
linter.

```vim
let g:syntastic_javascript_checkers = ['eslint']
```

In development you don't want to see errors related to using `console.log`, but
we also don't want these leaking into production. You may want to tell your
editor to ignore these (it'll still get checked on CI)

```vim
let g:syntastic_javascript_eslint_args = "--rule 'no-console: 0'"
```


<!-- Markdown links -->
[npm]: https://www.npmjs.com
[eslint]: http://eslint.org
[vimjsx]: https://github.com/mxw/vim-jsx
[syntastic]: https://github.com/scrooloose/syntastic
[package]: ./package.json

