import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

import { makeRequests } from './makeRequests.mjs'

const libName = '@magic/bumper.update.dependencies:'

export const updateDependencies = async (state = {}) => {
  if (!is.object(state)) {
    throw error(`${libName} expected state to be an object`, 'E_STATE_TYPE')
  }

  const startTime = log.hrtime()

  const { dependencies, devDependencies } = state.pkg

  const dependencyNames = Object.keys(dependencies)
  const newDependencies = await makeRequests(dependencyNames)

  const updatedDependencies = Object.entries(newDependencies)
    .filter(([k, v]) => v > dependencies[k])
    .map(([key, val]) => `${key}: ${dependencies[key]} >> ${val}`)
    .join('\n')

  if (updatedDependencies.length) {
    let updated = state.commands.write ? log.paint.green('updated') : log.paint.red('outdated')
    log(`\n${updated} dependencies`)
    log(updatedDependencies)
  }

  const devDependencyNames = Object.keys(devDependencies)
  const newDevDependencies = await makeRequests(devDependencyNames)

  let longestDepDependencyName = 0
  const updatedDevDependencies = Object.entries(newDevDependencies)
    .filter(([k, v]) => v > devDependencies[k])
    .map(([k,v]) => {
      if (k.length > longestDepDependencyName) {
        longestDepDependencyName = k.length
      }

      return [k, v]
    })
    .map(([key, val]) => {
      console.log({k:key.length, longestDepDependencyName});
      return `${key}: ${devDependencies[key]} >> ${val}`
    })
    .join('\n')

  if (updatedDependencies.length) {
    let updated = state.commands.write ? log.paint.green('updated') : log.paint.red('outdated')
    log(`\n${updated} devDependencies`)
    log(updatedDevDependencies)
  }

  state.pkg.dependencies = newDependencies
  state.pkg.devDependencies = newDevDependencies

  // only write package.json and package-lock.json if the user wants to write.
  if (state.commands.write) {
    await fs.writeFile(pkgFile, JSON.stringify(pkg, null, 2))

    if (!is.empty(lock) && !is.empty(lockFile)) {
      await fs.writeFile(lockFile, JSON.stringify(lock, null, 2))
    }
  }

  log.timeTaken(startTime, log.paint.green('updateDependencies'))

  return state
}
