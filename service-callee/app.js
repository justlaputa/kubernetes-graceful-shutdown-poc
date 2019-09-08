const express = require('express')

const app = express()

const PORT = process.env.PORT || 3000
const APP_NAME = 'callee'

app.get('/api/ok', (req, res) => {
  res.send('ok')
})

const server = app.listen(PORT, () => {
  console.log('%s server started on :%d', APP_NAME, PORT)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM, calling server.close')

  server.close(() => {
    console.log('server closed, exit')
    process.exit(0)
  })
})
