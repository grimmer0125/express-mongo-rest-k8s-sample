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

// NOTE: if no file exists, it will throw excepction
/* istanbul ignore next */
// if (process.env.NODE_ENV !== 'production') {
//   const dotenv = require('dotenv-safe')
//   dotenv.load({
//     path: path.join(__dirname, '../.env'),
//   sample: path.join(__dirname, '../.env.example')
//   })
// }

const config = {
  all: {
    env: process.env.NODE_ENV || 'development', // orig: 'development'
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 3000, // orig: 9000
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    // masterKey: requireProcessEnv('MASTER_KEY'),
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
      uri: 'mongodb://localhost:27017/express-rest-dev', // add exact 27017 port
      options: {
        debug: true
      }
    }
  },
  production: {
    port: process.env.PORT || 3000, // orig: 8080
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://mongo:27017/express-rest'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
