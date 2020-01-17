import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'

export const bump = async state => {
  const startTime = log.hrtime()

  const { version } = state

  state.pkg.version = version.new

  if (!is.empty(state.lock)) {
    state.lock.version = version.new
  }

  if (state.commands.write) {
    await fs.writeFile(state.pkgFile, JSON.stringify(state.pkg, null, 2))

    if (!is.empty(state.lock)) {
      await fs.writeFile(state.lockFile, JSON.stringify(state.lock, null, 2))
    }
  }

  const logMsgHeader = log.paint.green('bump version')
  const logMsg = [logMsgHeader, `from ${version.old} to ${version.new}`].join(' ')

  log.timeTaken(startTime, logMsg)

  return state
}
