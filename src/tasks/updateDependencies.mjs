import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

const libName = '@magic/bumper.updateDependencies:'

export const updateDependencies = async (state = {}) => {
  if (!is.object(state)) {
    throw error(`${libName} expected state to be an object`, 'E_STATE_TYPE')
  }

  const startTime = log.hrtime()

  state.cwd = process.cwd()

  // package.json
  state.pkgFile = path.join(state.cwd, 'package.json')

  const exists = await fs.exists(state.pkgFile)
  if (!exists) {
    throw error(`${libName} can not find package.json.`, 'E_PKG_FILE_MISSING')
  }

  const pkgContent = await fs.readFile(state.pkgFile, 'utf8')
  state.pkg = JSON.parse(pkgContent)

  state.version = {
    old: state.pkg.version,
    new: semver.bump(state.pkg.version),
  }

  // package-lock.json
  state.lockFile = path.join(state.cwd, 'package.json')

  const lockExists = await fs.exists(state.lockFile)
  if (!lockExists) {
    throw error(`${libName} can not find package.json.`, 'E_PKG_FILE_MISSING')
  }

  const pkgLockContent = await fs.readFile(state.lockFile, 'utf8')
  state.lock = JSON.parse(pkgLockContent)

  log.timeTaken(startTime, log.paint.green('updateDependencies'))

  return state
}
