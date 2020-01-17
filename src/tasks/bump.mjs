import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

const libName = '@magic/bumper.bump:'

export const bump = async state => {
  if (is.empty(state)) {
    throw error(`${libName} expected state to be non-empty`, 'E_STATE_EMPTY')
  }

  if (!is.object(state)) {
    throw error(`${libName} expected state to be an object`, 'E_STATE_TYPE')
  }

  const startTime = log.hrtime()

  const { version } = state

  // package.json
  state.pkg.version = version.new

  if (!is.empty(state.lock)) {
    state.lock.version = version.new
  }

  const logMsg = [log.paint.green('bump version'), `from ${version.old} to ${version.new}`].join(
    ' ',
  )
  log.timeTaken(startTime, logMsg)

  return state
}
