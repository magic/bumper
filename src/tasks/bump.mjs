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

  if (state.commands.write) {
    await fs.writeFile(state.pkgFile, JSON.stringify(state.pkg, null, 2))

    if (!is.empty(state.lock)) {
      await fs.writeFile(state.lockFile, JSON.stringify(state.lock, null, 2))
    }
  }

  const logMsgHeader = log.paint.green('bump version')
  const logMsg = [logMsgHeader, `from ${version.old} to ${version.new}`].join(' ')

  log.timeTaken(startTime, logMsg)

  return state
}
