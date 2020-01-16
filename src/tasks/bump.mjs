import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import semver from '@magic/semver'

const libName = '@magic/bumper:'

export const bump = async state => {
  const startTime = log.hrtime()

  // package.json
  const pkgFile = path.join(state.cwd, 'package.json')

  const exists = await fs.exists(pkgFile)
  if (!exists) {
    throw error(`${libName} can not find package.json.`, 'E_PKG_FILE_MISSING')
  }

  const pkgContent = await fs.readFile(pkgFile, 'utf8')
  const pkg = JSON.parse(pkgContent)

  state.version = {
    old: pkg.version,
    new: semver.bump(pkg.version),
  }

  pkg.version = state.version.new

  state.pkg = JSON.stringify(pkg, null, 2)

  // package-lock
  const pkgLockFile = path.join(state.cwd, 'package-lock.json')

  const lockExists = await fs.exists(pkgLockFile)

  if (!lockExists) {
    log.warn(
      'W_NO_PACKAGE_LOCK',
      `${libName} can not find package-lock.json. you may consider adding it.`,
    )
  } else {
    const pkgLockContent = await fs.readFile(pkgLockFile, 'utf8')
    const pkgLockParsed = JSON.parse(pkgLockContent)

    pkgLockParsed.version = state.version.new

    state.lock = JSON.stringify(pkgLockParsed, null, 2)
  }

  const logMsg = [
    log.paint.green('bump version'),
    `from ${state.version.old} to ${state.version.new}`,
  ].join(' ')
  log.timeTaken(startTime, logMsg)

  return state
}
