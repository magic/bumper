import path from 'path'
import child_process from 'child_process'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

import tasks from './tasks/index.mjs'

const libName = '@magic/bumper:'

const cwd = process.cwd()

export const bumper = async state => {
  const startTime = log.hrtime()

  state = {
    ...state,
    cwd,
  }

  state = await tasks.diff(state)

  state = await tasks.test(state)

  state = await tasks.bump(state)

  log.timeTaken(startTime, 'publishing took a total of:')
}

export default bumper
