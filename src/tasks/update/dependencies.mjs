import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

import { makeRequests } from './makeRequests.mjs'
import { stringifyDependencies } from './stringifyDependencies.mjs'

const libName = '@magic/bumper.update.dependencies:'

export const updateDependencies = async (state = {}) => {
  if (!is.object(state)) {
    throw error(`${libName} expected state to be an object`, 'E_STATE_TYPE')
  }

  const startTime = log.hrtime()

  const { dependencies, devDependencies } = state.pkg

  const dependencyNames = Object.keys(dependencies)
  const newDependencies = await makeRequests(dependencyNames)

  const updatedDependencies = stringifyDependencies({ state, old: dependencies, new: newDependencies })

  if (updatedDependencies.length) {
    let updated = state.commands.write ? log.paint.green('updated') : log.paint.red('outdated')
    log(`\n${updated} dependencies`)
    log(updatedDependencies)
  }

  const devDependencyNames = Object.keys(devDependencies)
  const newDevDependencies = await makeRequests(devDependencyNames)

  const updatedDevDependencies = stringifyDependencies({ old: devDependencies, new: newDevDependencies })

  if (updatedDevDependencies.length) {
    let updated = state.commands.write ? log.paint.green('updated') : log.paint.red('outdated')
    log(`\n${updated} devDependencies`)
    log(updatedDevDependencies)
  }

  state.pkg.dependencies = newDependencies
  state.pkg.devDependencies = newDevDependencies

  // only write package.json and package-lock.json if the user wants to write.
  if (state.commands.write) {
    await fs.writeFile(state.pkgFile, JSON.stringify(state.pkg, null, 2))

    if (!is.empty(state.lock) && !is.empty(lockFile)) {
      await fs.writeFile(state.lockFile, JSON.stringify(state.lock, null, 2))
    }
  }

  log.timeTaken(startTime, log.paint.green('updateDependencies'))

  return state
}
