import Sequelize from 'sequelize'
import { isTest, isProduction } from '../config/env'
import config from '../config'

const dbConfig = config.mysql

const { database, username, password } = dbConfig

const db = new Sequelize(database, username, password, {
  logging: !isProduction,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 100000
  }
})

export const dbConnectPromise = db.authenticate().then(() => {
  // when test, use MEMORY engine for speedup
  if (isTest) {
    const syncOption = {
      engine: 'MEMORY',
    }
    db.sync(syncOption)
  } else {
    db.sync().then(() => {
      const User = require('./models/user').default
      User.createDefault()
    })
  }
  // console.log('db connect success')
}).catch(e => {
  console.info('db connect failed')
  console.error(e)
  process.exit(1)
})

export default db
