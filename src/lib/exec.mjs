import util from 'util'
import child_process from 'child_process'

export const exec = util.promisify(child_process.exec)
