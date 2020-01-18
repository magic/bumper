import child_process from 'child_process'

import log from '@magic/log'
import error from '@magic/error'

export const options = {
  windowsHide: true,
  encoding: 'utf8',
}

export const exec = (cmd, args = [], options = {}) => {
  const { silent = true } = options

  const child = child_process.spawn(cmd, args, options)

  let stdout = ''
  let stderr = ''

  child.stdout.on('data', data => {
    const str = data.toString()
    if (str) {
      if (!silent) {
        log.info(str)
      }
    }
    stdout += str
  })

  child.stderr.on('data', data => {
    const str = data.toString()
    console.log({str});
    if (str.includes('ExperimentalWarning: The ESM module loader is experimental')) {
      return
    }

    if (str) {
      if (!silent) {
        log.error('E_EXEC_CHILD', str)
      }
    }
    stderr += str
  })

  const promise = new Promise((resolve, reject) => {
    child.on('error', reject)

    child.on('exit', code => {
      if (code === 0 && !stderr) {
        resolve(stdout)
      } else {
        reject(error(stderr, 'spawn child'))
      }
    })
  })

  promise.child = child

  return promise
}
