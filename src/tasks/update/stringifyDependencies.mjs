export const stringifyDependencies = (deps, longestName = 0, longestVersion = 0) =>
  Object.entries(deps.new)
    .filter(([k]) => deps.new[k] > deps.old[k])
    .map(([k, v]) => {
      if (k.length > longestName) {
        longestName = k.length
      }

      if (deps.old[k].length > longestVersion) {
        longestVersion = deps.old[k].length
      }

      return [k, v]
    })
    .map(([key, val]) => {
      let k = key
      while (k.length < longestName) {
        k += ' '
      }

      let old = deps.old[key]
      while (old.length < longestVersion) {
        old += ' '
      }

      return `${k}: ${old} >> ${deps.new[key]}`
    })
    .join('\n')
