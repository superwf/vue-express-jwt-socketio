import Sequelize from 'sequelize'
import db from '../db'

const User = db.define('user', {
  name: Sequelize.STRING,
  password: Sequelize.STRING,
})

// User.sync()

export default User
