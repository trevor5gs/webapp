# Ello Web Application

We're working on it.


## Development Setup

1. Install [nvm][nvm] which manages the [Node][node] and [npm][npm] verions
- Install the version of [Node][node] and [npm][npm] set by [`.nvmrc`](./.nvmrc)
- Install the packages listed in [`package.json`][package] file
- Start up the server at [`localhost:6660`](localhost:6660) :metal:

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
nvm install
npm install
npm start
```

The [package.json][package] file contains a few more tasks that might be
of interest.


### ES6 & Babel
We're running our JavaScript through the [Babel transpiler][babel]. They have
some pretty good docs to get you up to speed. It's nice, trust us. Don't worry,
you can still make shit weird with JavaScript. We rock that thing experimental
style at [Strawman Stage 0](http://babeljs.io/docs/usage/experimental/). Some
bleeding edge shit that will make it to browsers sometime before 2036 A.D.


### Linting
We run all of the JavaScript through [ESLint][eslint] on CI (`npm run lint`)
prior to the tests (`npm test`) executing. You're builds will fail if the linter
fails (it'll still run the tests though). With around 24k stars on Github, we
follow the lead from [Airbnb's style guide][airbnb]. If you're not familiar with
[ESLint][eslint] it's not only a linter but enforces some common styling
conventions established by [Airbnb][airbnb]. We have a [couple minor
overrides](./.eslintrc) in place, most notably no warnings on missing
semi-colons. You don't need them, [Babel][babel] and
[ASI](http://eslint.org/docs/rules/semi) will take care of that for you. Prepare
your editors. We also allow multiple classes within a single file. Use this
sparingly please for items like icons, slides, modifiers, etc.


### Sass & Autoprefixer
We rock the [indented
syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html) and send
the compiled CSS through [Autoprefixer][autoprefixer].


### Editor Setup
It's still puzzling to think people use other editors besides Vim but if you do,
add some notes here on what your setup is like. I'm sure it's similar just with
way more mouse clicking, hand cramping keyboard shortcuts that you have to be an
elephant to remember.


#### Vim

You're going to want the [JSX bundle][vimjsx] installed for syntax highlighting.

If your setup includes [Syntastic][syntastic], you'll want the linter and
the configurations installed globally through [npm][npm]. 

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

In development you don't want to see errors related to using
`console.log`, but we also don't want these leaking into production. You may
want to tell your editor to ignore these (it'll still get checked on CI)

```vim
let g:syntastic_javascript_eslint_args = "--rule 'no-console: 0'"
```


## Todo
- Need to describe [Webpack][webpack] a bit (once we get deeper into it)
- Need to describe [Webpack's][webpack] concept of loaders (once we get deeper into it)
- Need to describe the hot loader thingy and how it does it's thing
- Are there any other dependencies we're missing? 


<!-- Markdown links -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.
[nvm]: https://github.com/creationix/nvm
[babel]: https://babeljs.io
[eslint]: http://eslint.org
[airbnb]: https://github.com/airbnb/javascript
[autoprefixer]: https://github.com/postcss/autoprefixer
[vimjsx]: https://github.com/mxw/vim-jsx
[syntastic]: https://github.com/scrooloose/syntastic
[package]: ./package.json
[webpack]: http://webpack.github.io

