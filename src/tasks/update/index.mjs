import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'

import { exec } from '../../lib/index.mjs'

import { updateDependencies } from './dependencies.mjs'

export const update = async state => {
  const startTime = log.hrtime()

  state = await updateDependencies(state)

  // await fs.rmrf('package-lock.json')
  // await fs.rmrf('node_modules')

  // const { stdout, stderr } = await exec('npm install')
  // if (stderr) {
  // if (!stderr.includes('npm notice created a lockfile')) {
  // throw error(stderr, 'E_NPM_INSTALL')
  // }
  // } else if (stdout) {
  // log.info(stdout)
  // }

  log.timeTaken(startTime, log.paint.green('npm update took'))

  return state
}
