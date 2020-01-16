import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'

import { exec } from '../lib/index.mjs'

export const update = async state => {
  if (!state.update) {
    return state
  }

  log('updating dependencies')

  const startTime = log.hrtime()

  await fs.rmrf('package-lock.json')
  await fs.rmrf('node_modules')

  const { stdout, stderr } = await exec('npm install')
  if (stderr) {
    if (!stderr.includes('npm notice created a lockfile')) {
      throw error(stderr, 'E_NPM_INSTALL')
    }
  } else if (stdout) {
    log.info(stdout)
  }

  log.timeTaken(startTime, log.paint.green('npm update took'))

  return state
}
