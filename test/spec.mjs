import is from '@magic/types'

import bumper from '../src/index.mjs'

export default [
  { fn: () => bumper, expect: is.function },
  // { fn: false, expect: true },
]
