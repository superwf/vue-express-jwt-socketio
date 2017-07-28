import Sequelize from 'sequelize'

const db = new Sequelize('test', 'test', 'test', {
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 100000
  }
})

db.authenticate().then(() => {
  console.log('db connect success')
})

export default db
