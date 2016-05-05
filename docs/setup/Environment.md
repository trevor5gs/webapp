# Development Environment
Setup the core tools.


## Node.js, npm, nvm

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
nvm install
npm install
npm start
```

1. Installs [nvm][nvm] which manages [Node.js][node] and [npm][npm] verions
- Installs the version of [Node.js][node] and [npm][npm] set by `.nvmrc`
- Installs the packages listed in `package.json` file
- Starts up the server at [`localhost:6660`](localhost:6660) :metal:


## Babel
JavaScript is compiled through the [Babel transpiler][babel]. The current setting is
at [Strawman Stage 0](http://babeljs.io/docs/usage/experimental/). The
`.babelrc` file also provides the transforms performed.


## ESLint
On CI, [ESLint][eslint] will be run prior to the tests (`npm test`). The builds
will fail if the linter fails but it will still run and print the results of the
tests.

[ESLint][eslint] enforces [Airbnb's style guide][airbnb] with a few minor
overrides found in the `.eslintrc` file.

The most notable are:

- No warnings on missing semi-colons - [Babel][babel] will insert these.
- Allow multiple classes within a single file - Used for icons, slides, etc.

_Prepare your [editor](Editors.md)._


## Webpack
- Need to describe [Webpack][webpack]
- Need to describe [Webpack's][webpack] concept of loaders (once we get deeper into it)
- Need to describe hot loader and potential gotchas


## Sass & Autoprefixer
CSS is generated using the [indented Sass
syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html) and sent
through [Autoprefixer][autoprefixer] for taking care of the missing vendor
prefixes.

## Emoji autocompleter in dev
To get the emojis.json file run:
`curl -o public/static/emojis.json https://ello.co/emojis.json`
To turn it on add this to your `.env`:
`USE_LOCAL_EMOJI=true`

:metal:


<!-- Markdown links -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.
[nvm]: https://github.com/creationix/nvm
[babel]: https://babeljs.io
[eslint]: http://eslint.org
[airbnb]: https://github.com/airbnb/javascript
[webpack]: http://webpack.github.io
[autoprefixer]: https://github.com/postcss/autoprefixer

