#!/usr/bin/env node

import cli from '@magic/cli'
import log from '@magic/log'

import bumper from './index.mjs'

const cliArgs = {
  options: [
    '--major',
    '--minor',
    '--patch',
    '--alpha',
    '--beta',
    ['--dangerNoTest', '--danger-no-test'],
    ['--dangerNoDiff', '--danger-no-diff'],
    ['--no-bump', '--freeze'],
    ['--verbose', '--loud'],
    '--dev-deps',
    '--prod-deps',
    '--cwd',
  ],
  commands: [
    ['git', 'g'],
    ['update', 'up', 'u'],
    ['version', 'v'],
    ['write', 'doit', 'w'],
  ],
  help: {
    name: 'magic-bump',
    header: 'bump the version of an npm package, create a git commit and tag, then npm publish.',
    commands: {
      git: 'commit and push changes and tags using git',
      update: 'force update all dependencies.',
      version: 'bump version',
      write: 'actually write changes to files.',
    },
    options: {
      '--major': '1.x.x turns to 2.0.0',
      '--minor': '0.1.x turns to 0.2.0',
      '--patch': '0.0.3 turns into 0.0.4',
      '--alpha': '0.0.3-(alpha|beta).0 turns into 0.0.3-(alpha|beta).1',
      '--serious': 'actually write to files and publish',
      '--danger-no-test': 'do not run unit tests.',
      '--danger-no-diff': 'do not run git diff.',
      '--cwd': 'pass a directory to work on.',
      '--dev-deps': 'only update dev dependencies',
      '--prod-deps': 'only update prod dependencies',
    },
    default: {
      '--cwd': process.cwd(),
    },
    example: `
magic-bumper version update
# only output the changes that would be done

magic-bumper version update doit
# git diff, stop if uncomitted files exist
# npm install, optional, if --update is set
# npm test, stop if tests fail
# bump the version number with the lowest priority (patch or alpha)
# git commit and git tag it,
# git push
# npm publish

magic-bumper --(major|minor|patch)
# bump the version specified.

magic-bumper --install
# also delete package-lock.json and node_modules, then npm install to get the newest dependencies.
# it's slow, but faster then the alternatives that make sure all deps get updated.
`,
  },
}

const run = async () => {
  const startTime = log.hrtime()

  const { args, commands } = cli(cliArgs)

  if (args.verbose) {
    log.setLevel(0)
  } else {
    log.setLevel(1)
  }

  try {
    const result = await bumper({ args, commands })

    log.success('bumper finished.')
  } catch (e) {
    log.error(e.code || e.name, e.message, e.stack)
  }
}

run()
