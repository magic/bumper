import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import semver from '@magic/semver'

const libName = '@magic/bumper.tasks.write:'

export const bump = async state => {
  if (is.empty(state)) {
    throw error(`${libName} expected state to be non-empty`, 'E_STATE_EMPTY')
  }

  if (!is.object(state)) {
    throw error(`${libName} expected state to be an object`, 'E_STATE_TYPE')
  }

  if (is.empty(state.pkg)) {
    throw error(`${libName} expected state.pkg to be non-empty`, 'E_PKG_EMPTY')
  }

  const { pkg, lock } = state

  if (!is.object(pkg)) {
    throw error(`${libName} expected state.pkg to be an object`, 'E_PKG_TYPE')
  }

  if (!is.string(pkg.string)) {
    throw error(`${libName} expected state.pkg.string to be a string`, 'E_PKG_STRING_TYPE')
  }

  if (!is.string(pkg.path)) {
    throw error(`${libName} expected state.pkg.path to be a string`, 'E_PKG_STRING_TYPE')
  }

  const pkgExists = await fs.exists(pkg.path)
  if (!pkgExists) {
    throw error(
      `${libName} expected state.pkg.path to point to an existing package.json file`,
      'E_PKG_FILE_MISSING',
    )
  }

  const startTime = log.hrtime()

  // only write package.json if the user is serious. this is serious.
  if (args.serious) {
    await fs.writeFile(pkg.file, pkg.string)
  }

  if (!is.string(lock.string)) {
    throw error(`${libName} expected state.lock.string to be a string`, 'E_PKG_LOCK_STRING_TYPE')
  }

  if (!is.string(lock.path)) {
    throw error(`${libName} expected state.lock.path to be a string`, 'E_PKG_LOCK_PATH_TYPE')
  }

  const lockExists = await fs.exists(lock.path)
  if (!lockExists) {
    log.warn(
      'W_PACKAGE_LOCK_MISSING',
      `${libName} can not find package-lock.json. you should add it.`,
    )
  } else {
    // only write package-lock.json if the user is serious. this is serious.
    if (args.serious) {
      await fs.writeFile(lock.path, lock.string)
    }
  }

  const logMsg = [log.paint.green('bump version'), `from ${version} to ${newVersion}`].join(' ')
  log.timeTaken(startTime, logMsg)

  return newVersion
}
