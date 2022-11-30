const express = require('express')
const helmet = require('helmet')
const routes = require('./routes/nft-metadata-route')
const configVars = require('./config')

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(helmet())
app.disable('x-powered-by')
app.timeout = 1000 * 60 * configVars.api_timeout_seconds

app.use('/', routes)

// npm run local
// app.listen(configVars.port)
// console.log(`NFT API listening on ${configVars.port} with timeout ${app.timeout / 1000 / 60} seconds  \r\n`)

module.exports = app
