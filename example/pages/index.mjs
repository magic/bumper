export const View = state => [
  h1(state.title),
  p(state.description),

  GitBadges('magic/bumper'),

  h3({ id: 'install' }, 'install'),
  Pre('npm i -g @magic/bumper'),

  h3({ id: 'usage' }, 'usage'),
  p('be in a node repository (package.json exists)'),

  h4({ id: 'usage-show-changes' }, 'show changes'),
  p('for safety, magic-bumper only outputs the changes that would be done'),

  Pre(`magic-bumper`),

  h4({ id: 'usage-serious' }, '--serious'),
  p('to actually make magic-bumper do something, use the --serious flag'),
  Pre(`magic-bumper --serious`),

  ol([
    li('git diff, stop if there are uncomitted changes'),
    li('if --update: update npm dependencies'),
    li('npm run tests, stop if tests fail'),
    li('bump the version number with the lowest priority (patch or alpha)'),
    li('if --serious: write changes to package.json and package-lock.json'),
    li('if --serious: git commit -m "bump version to 1.2.3"'),
    li('if --serious: git tag -a v1.2.3 -m "v1.2.3"'),
    li('if --serious: git push --tags'),
    li('if --serious: npm publish'),
  ]),

  h4({ id: 'usage-priority-no' }, 'no priority'),
  p('bumps'),
  p('0.0.1 to 0.0.2'),
  p('and'),
  p('0.0.1-alpha.0 to 0.0.1-alpha.1'),
  Pre('magic-bumper'),

  h4({ id: 'usage-priority' }),
  p('bump the version specified.'),
  Pre(`magic-bumper --(major|minor|patch)`),

  h5({ id: 'usage-priority-major' }, 'bump major'),
  p('bumps 0.x.x to 1.0.0'),
  Pre('magic-bumper --major'),

  h5({ id: 'usage-priority-minor' }, 'bump minor'),
  p('bumps 0.1.x to 0.2.0'),
  Pre('magic-bumper --minor'),

  h5({ id: 'usage-priority-patch' }, 'bump patch'),
  p('bumps 0.0.1-alpha.0 to 0.0.2'),
  Pre('magic-bumper --patch'),

  h5({ id: 'usage-priority-alpha' }, 'bump alpha'),
  p('bumps 0.1.1 to 0.0.1-alpha.0'),
  p('and'),
  p('0.1.1-alpha.0 to 0.1.1-alpha.1'),
  Pre('magic-bumper --alpha'),

  h5({ id: 'usage-priority-beta' }, 'bump beta'),
  p('bumps 0.1.1 to 0.0.1-beta.0'),
  p('0.1.1-alpha.0 to 0.1.1-beta.0'),
  p('0.1.1-beta.0 to 0.1.1-beta.1'),
  Pre('magic-bumper --beta'),

  h4({ id: 'usage-update' }, 'update dependencies'),
  p('delete package-lock.json and node_modules, then npm install to get the newest dependencies.'),
  p(
    "it's slow, but faster then the alternatives that make sure all deps (including git repos) get updated.",
  ),
  Pre('magic-bumper --update'),

  h2({ id: 'source' }, 'source'),
  p([
    'the source for this page is in the ',
    Link({ to: 'https://github.com/magic/bumper/tree/master/example' }, 'example directory'),
    ' and gets built and published to github using ',
    Link({ to: 'https://github.com/magic/core' }, '@magic/core'),
  ]),
]
