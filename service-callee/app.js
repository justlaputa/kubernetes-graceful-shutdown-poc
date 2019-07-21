const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
const APP_NAME = 'callee'

app.get('/api/ok', (req, res) => {
  res.send('ok')
})

app.get('/health', (req, res) => {
  res.send('ok')
})

app.listen(PORT, () => {
  console.log('%s server started on :%d', APP_NAME, PORT)
})