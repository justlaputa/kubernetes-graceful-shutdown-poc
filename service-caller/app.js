const axios = require('axios')

const APP_NAME = 'caller'

const CALLEE_URL = process.env.CALLEE_URL || 'http://localhost:3000'

//number of request per second caller should call the callee's api
const REQUEST_RATE = parseInt(process.env.REQUEST_RATE) || 10

const apiClient = axios.create({
  baseURL: CALLEE_URL,
})

function start() {
  const interval = Math.floor(1000 / REQUEST_RATE)
  setInterval(calling, interval)

  console.log('%s server starts calling callee on %s, with request rate: %d rps',
    APP_NAME, CALLEE_URL, REQUEST_RATE)
}

async function calling() {
  try {
    await apiClient.get('/api/ok')
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        'err: %s: got non 2xx response: %s',
        error.code,
        error.response.status
      )
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
