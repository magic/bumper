import https from 'https'

import error from '@magic/error'

const libName = '@magic/bumper.lib.httpGet'

export const httpGet = url =>
  new Promise((resolve, reject) => {
    https
      .get('https://github.com/', res => {
        res.statusCode === 200
          ? resolve(true)
          : reject(error('could not contact github.com.', 'E_NET_STATUSCODE'))
      })
      .on('error', reject)
  })
