import Sequelize from 'sequelize'
import db from '../db'
import crypto from 'crypto'
import errorMessage from '../../lib/errorMessage'
import config from '../../config'

// 加密密码方法，若更换则之前添加的用户密码均不可验证
// 更换之后的用户密码可验证正常
export const cryptPassword = password => {
  const hashers = crypto.getHashes()
  const cryptType = 'DSA'
  if (hashers.indexOf(cryptType) === -1) {
    throw new Error(`crypto does not support ${cryptType}`)
  }
  return crypto.createHash(cryptType).update(password).digest('base64')
}

const User = db.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    defaultValue: '',
    validate: {
      isLength: {
        min: 1,
        max: 50,
        msg: errorMessage.user.name,
      },
      isUnique (name, next) {
        this.isNewRecord && User.findOne({ where: { name } }).then(user => {
          if (user) {
            return next('用户名不能重复')
          }
          next()
        })
      }
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
    validate: {
      isLength: {
        min: 1,
        max: 50,
        msg: errorMessage.user.password,
      },
    },
  },
}, {
  // crypt password
  // do not use 'beforeSave', it does not work
  hooks: {
    beforeCreate (user) {
      user.password = cryptPassword(user.password)
    },
    beforeUpdate (user) {
      if (user.changed('password')) {
        user.password = cryptPassword(user.password)
      }
    }
  }
})

// 根据config中的配置创建默认用户
User.createDefault = () => {
  return User.findOne({ where: { name: config.defaultUser.name } }).then(user => {
    if (!user) {
      return User.create(config.defaultUser)
    }
    return user
  })
}

export default User
