const axios = require('axios')

const APP_NAME = 'caller'

//callee's server url
const CALLEE_URL = process.env.CALLEE_URL || 'http://localhost:3000'
const CLIENT_TIMEOUT = process.env.CLIENT_TIMEOUT || 2000

//number of request per second caller should call the callee's api
const REQUEST_RATE = process.env.REQUEST_RATE || 1

const apiClient = axios.create({
  baseURL: CALLEE_URL,
  timeout: CLIENT_TIMEOUT,
})

function start() {
  const interval = Math.floor(1000 / REQUEST_RATE)
  setInterval(calling, interval)

  console.log('%s server starts calling callee on %s', APP_NAME, CALLEE_URL)
}

async function calling() {
  try {
    const resp = await apiClient.get('/api/ok')
    //console.log('got response: %d: %s', resp.status, resp.data)
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        'err: %s: got non 2xx response: %s',
        error.code,
        error.response.status
      )
      console.error(error.response.headers)
      console.error(error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(
        'err: %s: request was made, but no response received: %s',
        error.code,
        error.message
      )
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('err: %s: %s', error.code, error.message)
    }
  }
}

start()
