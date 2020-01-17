import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

const libName = '@magic/bumper.write:'

export const write = async state => {
  if (is.empty(state)) {
    throw error(`${libName} expected state to be non-empty`, 'E_STATE_EMPTY')
  }

  if (!is.object(state)) {
    throw error(`${libName} expected state to be an object`, 'E_STATE_TYPE')
  }

  if (is.empty(state.pkg)) {
    throw error(`${libName} expected state.pkg to be non-empty`, 'E_PKG_EMPTY')
  }

  const { pkg, pkgFile, lock, lockFile, version } = state

  if (!is.object(pkg)) {
    throw error(`${libName} expected state.pkg to be a object`, 'E_PKG_STRING_TYPE')
  }

  if (!is.string(pkgFile)) {
    throw error(`${libName} expected state.pkgFile to be a string`, 'E_PKG_STRING_TYPE')
  }

  const pkgExists = await fs.exists(pkgFile)
  if (!pkgExists) {
    throw error(
      `${libName} expected state.pkgFile to point to an existing package.json file`,
      'E_PKG_FILE_MISSING',
    )
  }

  if (!is.object(version)) {
    throw error(`${libName} expected state.version to be an object`, 'E_VERSION_TYPE')
  }

  if (!semver.isSemver(version.new)) {
    throw error(`${libName} expected state.version.new to be a semver string`, 'E_VERSION_TYPE')
  }

  if (!semver.isSemver(version.old)) {
    throw error(`${libName} expected state.version.old to be a semver string`, 'E_VERSION_TYPE')
  }

  const startTime = log.hrtime()

  // only write package.json if the user is serious. this is serious.
  if (state.serious) {
    await fs.writeFile(pkgFile, JSON.stringify(pkg, null, 2))

    if (!is.empty(lock) && !is.empty(lockFile)) {
      await fs.writeFile(lockFile, JSON.stringify(lock, null, 2))
    }
  }

  log.timeTaken(startTime, log.paint.green('wrote package files'))

  return state
}
