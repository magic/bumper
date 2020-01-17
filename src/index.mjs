import path from 'path'
import child_process from 'child_process'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

import tasks from './tasks/index.mjs'

const libName = '@magic/bumper:'

export const bumper = async state => {
  const startTime = log.hrtime()

  // read package.json and package-lock.json, initiate state
  state = await tasks.prepare(state)

  // git diff, stop if uncomitted changes exist
  if (!state.dangerNoDiff) {
    state = await tasks.diff(state)
  }

  // check for dependency updates,
  // update package.json versions with newest dependency versions.
  // rm package-lock.json node_modules && npm install
  if (state.update) {
    state = await tasks.update(state)
  }

  // npm run test, stop if error
  if (!state.dangerNoTests) {
    state = await tasks.test(state)
  }

  // read package.json, bump the version.
  if (!state.noBump) {
    state = await tasks.bump(state)
  }

  // actually write files to disk.
  state = await tasks.write(state)

  log.timeTaken(startTime, 'publishing took a total of:')
}

export default bumper
