import fs from '@magic/fs'
import log from '@magic/log'

import { exec } from '../lib/index.mjs'

export const update = async state => {
  if (!state.update) {
    return
  }

  const startTime = log.hrtime()

  await fs.rmrf('package-lock.json')
  await fs.rmrf('node_modules')

  await exec('npm install')

  log.timeTaken(startTime, log.paint.green('npm update took'))

  return {
    ...state,
    install: true,
  }
}
