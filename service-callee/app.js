const express = require('express')

const app = express()

const PORT = process.env.PORT || 3000
const APP_NAME = 'callee'
const WAIT_BEFORE_SERVER_CLOSE = parseInt(process.env.WAIT_BEFORE_SERVER_CLOSE) || 10

app.get('/api/ok', (req, res) => {
  res.send('ok')
})

const server = app.listen(PORT, () => {
  console.log('%s server started on :%d', APP_NAME, PORT)
})

process.on('SIGTERM', () => {
  console.log('received SIGTERM')

  console.log('waiting for %d sec to close server', WAIT_BEFORE_SERVER_CLOSE)

  setTimeout(() => {
    console.log('calling server close')

    server.close(() => {
      console.log('server closed, exit')
      process.exit(0)
    })
  }, WAIT_BEFORE_SERVER_CLOSE*1000)
})
