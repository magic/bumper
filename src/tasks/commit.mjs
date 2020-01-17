import error from '@magic/error'
import is from '@magic/types'
import log from '@magic/log'

import { exec } from '../lib/index.mjs'

import { diff } from './diff.mjs'

const libName = '@magic/bumper.commit:'

export const commit = async state => {
  console.log('commit', Object.keys(state))

  return state
}
