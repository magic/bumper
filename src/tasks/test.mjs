import error from '@magic/error'
import is from '@magic/types'
import log from '@magic/log'

import { exec } from '../lib/index.mjs'

export const test = async state => {
  if (state.noTest) {
    log.warn('TESTS SKIPPED.', 'omit --no-test to run the unit tests.')
    return
  }

  const startTime = log.hrtime()

  const result = await exec('npm run test')

  if (result.stderr) {
    const stderr = result.stderr
      .split('\n')
      .filter(a => !a.includes('ExperimentalWarning: The ESM module loader is experimental.'))
      .filter(a => a)

    if (!is.empty(stderr)) {
      throw error('tests failed to pass.\n' + stderr.join('\n'), 'E_TESTS_FAIL')
    }
  }

  log.info(result.stdout)

  log.timeTaken(startTime, log.paint.green('tests passed'))

  return {
    ...state,
    test: true,
  }
}
