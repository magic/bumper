import https from 'https'

import error from '@magic/error'

const request = packageName =>
  new Promise((resolve, reject) => {
    const options = {
      hostname: 'registry.npmjs.org',
      port: 443,
      protocol: 'https:',
      path: `/${packageName}`,
      method: 'GET',
      headers: {
        Accept: 'application/vnd.npm.install-v1+json',
      },
    }

    const req = https.request(options, res => {
      if (res.statusCode !== 200) {
        throw error(
          `@magic/bumper.lib.makeRequest: res.statusCode not 200, ${res.statusCode}`,
          'E_REQ_STATUS_CODE',
        )
      }

      res.setEncoding('utf8')

      let data = ''
      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        const parsed = JSON.parse(data)
        resolve(parsed)
      })
    })

    req.on('error', reject)
    req.end()
  })

export const makeRequests = async urls => {
  const promises = urls.map(request)

  const results = await Promise.all(promises)

  const versions = {}

  results.forEach(res => {
    versions[res.name] = res['dist-tags'].latest
  })

  return versions
}
