import Sequelize from 'sequelize'
import db from '../db'
import crypto from 'crypto'

export const cryptPassword = password => {
  const hashers = crypto.getHashes()
  const cryptType = 'DSA'
  if (hashers.indexOf(cryptType) === -1) {
    throw new Error(`crypto does not support ${cryptType}`)
  }
  return crypto.createHash(cryptType).update(password).digest('base64')
}

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isLength: {
        min: 0,
        max: 50,
      },
    },
  },
  password: {
    type: Sequelize.STRING,
  },
}, {
  hooks: {
    beforeCreate (user) {
      user.password = cryptPassword(user.password)
    },
    beforeUpdate (user) {
      this.beforeCreate(user)
    }
  }
})

export default User
