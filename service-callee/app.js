const express = require('express')

const app = express()

const PORT = process.env.PORT || 3000
const APP_NAME = 'callee'
const WAIT_BEFORE_SERVER_CLOSE = parseInt(process.env.WAIT_BEFORE_SERVER_CLOSE) || 0

app.get('/api/ok', (req, res) => {
  res.send('ok')
})

app.get('/health', (req, res) => {
  if (app.locals.shutdown) {
    console.log('unhealthy!!')
    res.status(400).end()
    return
  }

  console.log('healthy :)')
  res.send('ok')
})

const server = app.listen(PORT, () => {
  console.log('%s server started on :%d', APP_NAME, PORT)
})

process.on('SIGTERM', () => {
  console.log('received SIGTERM')
  app.locals.shutdown = true

  console.log('waiting for %d sec to close server', WAIT_BEFORE_SERVER_CLOSE)

  setTimeout(() => {
    console.log('calling server close')

    server.close(() => {
      console.log('server closed, exit')
      process.exit(0)
    })
  }, WAIT_BEFORE_SERVER_CLOSE*1000)
})
