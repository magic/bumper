import error from '@magic/error'
import is from '@magic/types'
import log from '@magic/log'

import { exec } from '../lib/index.mjs'

const libName = '@magic/bumper.diff:'

export const diff = async state => {
  const startTime = log.hrtime()

  let err = false

  const { stdout, stderr } = await exec('git status --short')

  if (stdout || stderr) {
    if (stdout) {
      log.info(stdout)
    }

    if (stderr) {
      log.info(stderr)
    }

    err = error(
      `
${libName} there are uncomitted changes.
magic-bumper will not work on an unclean workspace.
please clean up and then rerun magic-bumper.
`.trim(),
      'GIT_DIFF',
    )
  }

  log.timeTaken(startTime, log.paint.green('diff took'))

  if (is.error(err)) {
    throw err
  }

  return state
}
