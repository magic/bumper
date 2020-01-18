import error from '@magic/error'
import is from '@magic/types'
import log from '@magic/log'
import semver from '@magic/semver'

import { exec } from '../lib/index.mjs'

import { diff } from './diff.mjs'

const libName = '@magic/bumper.commit'

const expectedChangedFiles = ['package.json', 'package-lock.json']

export const commit = async state => {
  state = await diff({ ...state, dangerNoDiff: true })

  const files = state.diff

  if (!is.empty(files)) {
    const unexpectedFiles = files.filter(f => !expectedChangedFiles.some(e => f.endsWith(e)))

    if (unexpectedFiles.length) {
      const msg = `
${libName} there are uncomitted changes.
to prevent data corruption, magic-bumper will not work on an unclean workspace.

unexpected changes (new/modified/deleted files):
${unexpectedFiles.join('\n')}

because the ${libName} task pushes to a remote git repository,
this error can not be ignored using a cli flag.
      `.trim()

      log.error('E_PRE_COMMIT_GIT_DIFF', msg)
      process.exit(1)
    }
  }

  const v = state.version
  if (!semver.isBigger(v.new, v.old)) {
    throw error(`version can not be reduced. old: ${v.old} new: ${v.new}`, 'E_DEBUMP_VERSION')
  }

  const commitCmd = `git commit -m \'bump version to ${v.new}\' ./package.json ./package-lock.json`

  const comm = await exec(commitCmd, { silent: false })
  console.log('commit done', comm)

  const commitTagCmd = `git tag -a v${v.new} -m \'v${v.new}\'`
  await exec(commitTagCmd, { silent: false })
  console.log('tag done')

  // const push = await exec(`git push`)
  // console.log(push.stdout)

  // const pushTags = await exec(`git push --tags`)
  // console.log(pushTags.stdout)

  return state
}
