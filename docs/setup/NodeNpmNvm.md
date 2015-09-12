# Node.js, npm, and nvm

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


<!-- Markdown links -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.
[nvm]: https://github.com/creationix/nvm
[package]: ./package.json

