import Sequelize from 'sequelize'
import { isTest } from '../config/env'
import config from '../config'

const dbConfig = config.mysql

const { database, username, password } = dbConfig

const db = new Sequelize(database, username, password, {
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 100000
  }
})

db.authenticate().then(() => {
  // when test, use MEMORY engine for speedup
  if (isTest) {
    const syncOption = { force: true, engine: 'MEMORY' }
    db.sync(syncOption)
  }
  console.log('db connect success')
})

export default db
