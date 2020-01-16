import { bump as b } from './bump.mjs'
import { diff as d } from './diff.mjs'
import { prepare as p } from './prepare.mjs'
import { test as t } from './test.mjs'
import { update as u } from './update.mjs'
import { updateDependencies as uD } from './updateDependencies.mjs'
import { write as w } from './write.mjs'

export const bump = b
export const diff = d
export const prepare = p
export const test = t
export const update = u
export const updateDependencies = uD
export const write = w

export default {
  bump,
  diff,
  prepare,
  test,
  update,
  updateDependencies,
  write,
}
