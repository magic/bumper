# @magic/bumper

bump package version, git tag, commit and push, npm test, update, and publish, all in one cli script.

[![NPM version][npm-image]][npm-url]
[![Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

[npm-image]: https://img.shields.io/npm/v/@magic/bumper.svg
[npm-url]: https://www.npmjs.com/package/@magic/bumper
[travis-image]: https://img.shields.io/travis/com/magic/bumper/master
[travis-url]: https://travis-ci.com/magic/bumper
[appveyor-image]: https://img.shields.io/appveyor/ci/magic/bumper/master.svg
[appveyor-url]: https://ci.appveyor.com/project/magic/bumper/branch/master
[coveralls-image]: https://coveralls.io/repos/github/magic/bumper/badge.svg
[coveralls-url]: https://coveralls.io/github/magic/bumper
[greenkeeper-image]: https://badges.greenkeeper.io/magic/bumper.svg
[greenkeeper-url]: https://badges.greenkeeper.io/magic/bumper.svg
[snyk-image]: https://snyk.io/test/github/magic/bumper/badge.svg
[snyk-url]: https://snyk.io/test/github/magic/bumper

#### installation:
```javascript
npm install -g @magic/bumper
```

#### usage:
be in a node repository (package.json exists)

```bash
magic-bumper --help
# show a detailed help text

magic-bumper
# will only output the changes that would be done

magic-bumper --serious
# will actually bump the version number with the lowest priority (patch or alpha)
# then git commit and git tag it,
# then git push
# then npm publish

magic-bumper --(major|minor|patch)
# bump the version specified.

magic-bumper --install
# also delete package-lock.json and node_modules, then npm install to get the newest dependencies.
# it's slow, but faster then the alternatives that make sure all deps get updated.

```

##### changelog

##### 0.0.1 - unreleased
first commit

##### 0.0.2 - unreleased
...
