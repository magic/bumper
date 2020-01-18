import path from 'path'
import child_process from 'child_process'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

import tasks from './tasks/index.mjs'

const libName = '@magic/bumper:'

export const bumper = async props => {
  const { args, commands } = props

  let state = {
    args,
    commands,
  }

  const startTime = log.hrtime()

  // read package.json and package-lock.json, initiate state
  state = await tasks.prepare(state)

  // git diff, stop if uncomitted changes exist
  if (!state.args.dangerNoDiff) {
    state = await tasks.diff(state)
  }

  // check for dependency updates,
  // update package.json versions with newest dependency versions.
  // rm package-lock.json node_modules && npm install
  if (commands.update) {
    state = await tasks.update(state)
  }

  // npm run test, stop if error
  if (!state.args.dangerNoTests) {
    state = await tasks.test(state)
  } else {
    log.warn('TESTS SKIPPED.', 'omit --danger-no-test to run the unit tests.')
  }

  // read package.json, bump the version.
  if (commands.version) {
    state = await tasks.bump(state)
  }

  if (commands.merge) {
    state = await tasks.commit(state)

    // state = await tasks.push(state)
  }

  log.timeTaken(startTime, 'magic-bump took a total of:')
}

export default bumper
