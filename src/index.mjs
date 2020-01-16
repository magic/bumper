import path from 'path'
import child_process from 'child_process'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'

import semver from '@magic/semver'

const libName = '@magic/bumper:'

const cwd = process.cwd()

export const bumper = async args => {
  const pkgFile = path.join(cwd, 'package.json')
  const pkgContent = await fs.readFile(pkgFile, 'utf8')
  const pkg = JSON.parse(pkgContent)
  const version = pkg.version

  const newVersion = semver.bump(version)

  if (args.serious) {
    pkg.version = newVersion

    const pkgString = JSON.stringify(pkg, null, 2)
    await fs.writeFile(pkgFile, pkgString)

    const pkgLockFile = path.join(cwd, 'package-lock.json')
    const pkgLockContent = await fs.readFile(pkgLockFile, 'utf8')
    const pkgLock = JSON.parse(pkgLockContent)

    pkgLock.version = newVersion

    const pkgLockString = JSON.stringify(pkgLock, null, 2)
    await fs.writeFile(pkgLockFile, pkgLockString)
  }

  return version
}

export default bumper
