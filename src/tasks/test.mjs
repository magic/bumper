import error from '@magic/error'
import is from '@magic/types'
import log from '@magic/log'

import { exec } from '../lib/index.mjs'

const libName = '@magic/bumper.test'

export const test = async state => {
  const startTime = log.hrtime()

  const additional = state.verbose ? '' : '-- -p'

  const result = await exec('npm', ['run', 'test', additional], { silent: true })

  if (result.stderr) {
    const stderr = result.stderr
      .split('\n')
      .filter(a => !a.includes('ExperimentalWarning: The ESM module loader is experimental.'))
      .filter(a => a)

    if (!is.empty(stderr)) {
      const msg = `${libName}: tests failed.\n${stderr.join('\n')}`
      throw error(msg, 'E_TESTS_FAIL')
    }
  }

  let stdout = ''

  if (result.stdout) {
    const std = result.stdout.split('\n').filter(a => a)
    stdout = std[std.length - 1]
  }

  log.timeTaken(startTime, log.paint.green('tests took:'), stdout)

  return state
}
