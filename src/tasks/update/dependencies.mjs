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
  const startTime = log.hrtime()

  const { dependencies, devDependencies } = state.pkg

  const dependencyNames = Object.keys(dependencies)
  const newDependencies = await makeRequests(dependencyNames)

  const updatedDependencies = stringifyDependencies({
    state,
    old: dependencies,
    new: newDependencies,
  })

  if (updatedDependencies.length) {
    let updated = state.commands.update ? log.paint.green('updated') : log.paint.red('outdated')
    log(`\n${updated} dependencies`)
    log(updatedDependencies)
  }

  const devDependencyNames = Object.keys(devDependencies)
  const newDevDependencies = await makeRequests(devDependencyNames)

  const updatedDevDependencies = stringifyDependencies({
    old: devDependencies,
    new: newDevDependencies,
  })

  if (updatedDevDependencies.length) {
    let updated = state.commands.update ? log.paint.green('updated') : log.paint.red('outdated')
    log(`\n${updated} devDependencies`)
    log(updatedDevDependencies)
  }

  state.pkg.dependencies = newDependencies
  state.pkg.devDependencies = newDevDependencies

  // make sure user wants to update
  if (state.commands.update && !state.args.noWrite) {
    await fs.writeFile(state.pkgFile, JSON.stringify(state.pkg, null, 2))
  }

  log.timeTaken(startTime, log.paint.green('updateDependencies'))

  return state
}
