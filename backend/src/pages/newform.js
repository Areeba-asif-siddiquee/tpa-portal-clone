const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

let totalRequests = 0
const requests = []

app.post('/requests', (req, res) => {
  const requestData = req.body

  requests.push(requestData)

  totalRequests++

  console.log('New Request:', requestData)
  console.log('Total Requests:', totalRequests)

  res.status(201).json({ message: 'Request saved', totalRequests })
})

app.get('/requests/total', (req, res) => {
  res.json({ totalRequests })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
