#!/usr/bin/env node

import cli from '@magic/cli'
import is from '@magic/types'
import error from '@magic/error'
import log from '@magic/log'
import fs from '@magic/fs'

import bump from './index.mjs'

import util from 'util'
import child_process from 'child_process'

const exec = util.promisify(child_process.exec)

const cliArgs = {
  options: [
    '--major',
    '--minor',
    '--patch',
    '--alpha',
    '--beta',
    ['--serious', '--doit', '--shia'],
    ['--update', '--install'],
  ],
  help: {
    name: 'magic-bumper',
    header: 'bump the version of an npm package, create a git commit and tag, then npm publish.',
    options: {
      '--major': '1.x.x turns to 2.0.0',
      '--minor': '0.1.x turns to 0.2.0',
      '--patch': '0.0.3 turns into 0.0.4',
      '--alpha': '0.0.3-(alpha|beta).0 turns into 0.0.3-(alpha|beta).4',
      '--update': 'also install the newest version of all dependencies',
      '--serious': 'actually write to files and publish',
    },
    example: `
magic-bumper
# only output the changes that would be done

magic-bumper --serious
# git diff, stop if uncomitted files exist
# npm install, optional, if --update is set
# npm test, stop if tests fail
# 3bump the version number with the lowest priority (patch or alpha)
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

  const { args } = cli(cliArgs)

  if (args.verbose) {
    log.setLevel(0)
  } else {
    log.setLevel(1)
  }

  try {
    const diff = await exec('git status --short')
    if (diff.stdout || diff.stderr) {
      throw error(
        'there are uncomitted changes. Please clean up and then rerun magic-bumper.',
        'GIT_DIFF',
      )
    }

    if (args.update) {
      await fs.rmrf('package-lock.json')
      await fs.rmrf('node_modules')

      await cli.exec('npm install')
    }

    const result = await exec('npm run test')

    if (result.stderr) {
      const stderr = result.stderr
        .split('\n')
        .filter(a => !a.includes('ExperimentalWarning: The ESM module loader is experimental.'))
        .filter(a => a)

      if (!is.empty(stderr)) {
        log.error('E_TESTS', 'tests failed to pass.', stderr.join('\n'))
        process.exit(1)
      }
    }

    log(log.paint.green('tests passed'))
    log.info(result.stdout)

    const version = await bump(args)

    log.success(log.paint.green('bumped version'), version)

    log.timeTaken(startTime, 'publishing took a total of:')
  } catch (e) {
    log.error(e.code || e.name, e.message)
  }
}

run()
