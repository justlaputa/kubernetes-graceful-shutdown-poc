const axios = require('axios')

const APP_NAME = 'caller'

//callee's server url
const CALLEE_URL = process.env.CALLEE_URL || 'http://localhost:3000'

//number of request per second caller should call the callee's api
const REQUEST_RATE = process.env.REQUEST_RATE || 1

const apiClient = axios.create({
  baseURL: CALLEE_URL
})

function start() {
  const interval = Math.floor(1000 / REQUEST_RATE)
  setInterval(calling, interval)

  console.log('%s server starts calling callee on %s', APP_NAME, CALLEE_URL)
}

async function calling() {
  try {
    const resp = await apiClient.get('/api/ok')
    const now = new Date().toISOString()
    console.log('%s: got response: %d: %s', now, resp.status, resp.data)
  } catch (error) {
    const now = new Date().toISOString()

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(
        'now: err: %s: got non 2xx response: %s',
        now,
        error.code,
        error.response.status
      )
      console.log(error.response.headers)
      console.log(error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(
        '%s: err: %s: request was made, but no response received: %s',
        now,
        error.code,
        error.message
      )
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('%s: err: %s: %s', now, error.code, error.message)
    }
  }
}

start()
