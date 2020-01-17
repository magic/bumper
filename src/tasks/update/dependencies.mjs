import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

import { makeRequests } from './makeRequests.mjs'

const libName = '@magic/bumper.updateDependencies:'

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
    log('\nupdated dependencies')
    log(updatedDependencies)
  }

  const devDependencyNames = Object.keys(devDependencies)
  const newDevDependencies = await makeRequests(devDependencyNames)

  const updatedDevDependencies = Object.entries(newDevDependencies)
    .filter(([k, v]) => v > devDependencies[k])
    .map(([key, val]) => `${key}: ${devDependencies[key]} >> ${val}`)
    .join('\n')

  if (updatedDependencies.length) {
    log('\nupdated devDependencies:')
    log(updatedDevDependencies)
  }

  state.pkg.dependencies = newDependencies
  state.pkg.devDependencies = newDevDependencies

  log.timeTaken(startTime, log.paint.green('updateDependencies'))

  return state
}
