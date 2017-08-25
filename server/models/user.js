import Sequelize from 'sequelize'
import db from '../db'
import crypto from 'crypto'
import messages from '../../lib/messages'
import config from '../../config'
import jwt from 'jsonwebtoken'
import { user as tableName } from '../../lib/models'

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

const User = db.define(tableName, {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      name: 'emailIndex',
      msg: 'Email不能重复'
    },
    defaultValue: '',
    validate: {
      isEmail: {
        msg: messages.user.email.type
      },
      isLength: {
        min: 5,
        max: 50,
        msg: messages.user.email.length(5, 50),
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
    validate: {
      isLength: {
        min: 5,
        max: 50,
        msg: messages.user.password.length(5, 50),
      },
    },
  },
  locked: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
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
  },
})

// 根据config中的配置创建默认用户
User.createDefault = () => {
  return User.findOne({ where: { email: config.defaultUser.email } }).then(user => {
    if (!user) {
      return User.create(config.defaultUser)
    }
    return user
  })
}

User.isAdmin = user => !!user && (user.email === config.defaultUser.email)

User.me = token => {
  try {
    const user = jwt.verify(token, config.jwtSecret)
    user.isAdmin = User.isAdmin(user)
    return Promise.resolve(user)
  } catch (e) {
    return Promise.reject(e)
  }
}

User.regist = user => {
  return User.create({
    email: user.email,
    password: user.password
  })
}

export default User
