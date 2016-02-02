# Tasks

The `package.json` file contains all of the tasks available to the application.
They are run through [npm][npm] which acts like a lightweight `Makefile`.
Besides `start`, `test` and `build` all tasks need to be prefixed with the `run`
command.

Command               | Description
--------------------- | ---------------------
`npm start`           | Start the web server (currently a dev server)
`npm build`           | Builds out static assets for delivery to a staging or production server
`npm test`            | Runs the `lint` and the `spec` tasks. This is the task that runs on CI
`npm run spec`        | Runs the test suite through mocha
`npm run lint`        | Runs the linter through [ESLint][eslint]


<!-- Markdown links -->
[npm]: https://www.npmjs.com
[mocha]: http://mochajs.org
[eslint]: http://eslint.org
[airbnb]: https://github.com/airbnb/javascript

