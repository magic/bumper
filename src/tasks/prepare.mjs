import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

const libName = '@magic/bumper.prepare:'

export const prepare = async (state = {}) => {
  if (!is.object(state)) {
    throw error(`${libName} expected state to be an object`, 'E_STATE_TYPE')
  }

  const startTime = log.hrtime()

  // state.cwd might be set from the cli
  state.cwd = state.cwd || process.cwd()

  // package.json
  state.pkgFile = path.join(state.cwd, 'package.json')

  const exists = await fs.exists(state.pkgFile)
  if (!exists) {
    throw error(`${libName} can not find package.json.`, 'E_PKG_FILE_MISSING')
  }

  const pkgContent = await fs.readFile(state.pkgFile, 'utf8')
  state.pkg = JSON.parse(pkgContent)

  if (!semver.isSemver(state.pkg.version)) {
    throw error(`${libName} package.json version is not a valid semver.`, 'E_PKG_VERSION_TYPE')
  }

  state.version = {
    old: state.pkg.version,
    new: semver.bump(state.pkg.version),
  }

  // package-lock.json
  state.lockFile = path.join(state.cwd, 'package-lock.json')

  const lockExists = await fs.exists(state.lockFile)
  if (!lockExists) {
    log.warn('W_PKG_LOCK_FILE_MISSING', `${libName} can not find package.json.`)

    return state
  }

  const pkgLockContent = await fs.readFile(state.lockFile, 'utf8')
  state.lock = JSON.parse(pkgLockContent)

  if (!semver.isSemver(state.lock.version)) {
    throw error(
      `${libName} package-lock.json version is not a valid semver.`,
      'E_PKG_LOCK_VERSION_TYPE',
    )
  }

  if (state.lock.version !== state.pkg.version) {
    throw error(
      `${libName}: package.json and package-lock.json versions are different.`,
      'E_VERSION_MISMATCH',
    )
  }

  log.timeTaken(startTime, log.paint.green('prepare'))

  return state
}
