# ESLint

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

<!-- Markdown links -->
[babel]: https://babeljs.io
[eslint]: http://eslint.org
[airbnb]: https://github.com/airbnb/javascript



