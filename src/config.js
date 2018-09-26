/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 3000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: { },
  development: {
    mongo: {
      uri: 'mongodb://localhost:27017/express-rest-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    port: process.env.PORT || 3000,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://mongo:27017/express-rest'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
