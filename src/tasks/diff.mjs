import error from '@magic/error'
import is from '@magic/types'
import log from '@magic/log'

import { exec } from '../lib/index.mjs'

export const diff = async state => {
  const startTime = log.hrtime()

  let err = false

  const { stdout, stderr } = await exec('git status --short')

  if (diff.stdout || diff.stderr) {
    if (stdout) {
      log.info(stdout)
    }

    if (stderr) {
      log.info(stderr)
    }

    err = error(
      'there are uncomitted changes. Please clean up and then rerun magic-bumper.',
      'GIT_DIFF',
    )
  }

  log.timeTaken(startTime, log.paint.green('diff took'))

  if (is.error(err)) {
    throw err
  }

  return {
    ...state,
    diff: true,
  }
}
