import * as dotenv from 'dotenv'
import * as merge from 'merge-deep'
import { ConfigProperties } from './util'

const env = process.env.DEPLOY_ENV || 'local'
if (env === 'local') {
  // Local development will use .env, anything else will use .env.<NODE_ENV>
  const path = `src/config/.env${env !== 'local' ? `.${env}` : ''}`
  dotenv.config({ path })
}

const baseConfig = {
  app: {
    port: 8080
  },
  prometheus: {
    port: 9101,
    prefix: 'vote-polling'
  },
  debug: {
    benchmark: true
  },
  postgres: require('./ormconfig')
}

let envConfig
switch (process.env.DEPLOY_ENV) {
  case 'production':
    envConfig = require('./config.production').default
    break
  case 'dev':
    envConfig = require('./config.dev').default
    break
  default:
    envConfig = require('./config.local').default
}

export default merge(baseConfig, envConfig) as ConfigProperties
