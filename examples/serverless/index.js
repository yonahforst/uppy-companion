'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const awsServerlessExpress = require('aws-serverless-express')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const uppy = require('@uppy/companion')

const app = express()

app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

const host = process.env.DOMAIN.split('://')[1]
const protocol = process.env.DOMAIN.split('://')[0]

const options = {
  providerOptions: {
    s3: {
      getKey: (req, filename) => filename,
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION
    },
    instagram: {
      key: process.env.INSTAGRAM_KEY,
      secret: process.env.INSTAGRAM_SECRET
    },
    google: {
      key: process.env.GOOGLE_KEY,
      secret: process.env.GOOGLE_SECRET
    },
    dropbox: {
      key: process.env.DROPBOX_KEY,
      secret: process.env.DROPBOX_SECRET
    }
  },
  server: {
    host: host,
    protocol: protocol
  }
}

app.use(uppy.app(options))

const server = awsServerlessExpress.createServer(app)

exports.uppy = (event, context) =>
  awsServerlessExpress.proxy(server, event, context)
