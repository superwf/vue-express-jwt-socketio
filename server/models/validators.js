import db from '../db'
import errorMessage from '../../lib/errorMessage'

/*
 * @param db
 * @return Function
 * */
export const isUnique = (model, field) => function (val, next) {
  const Model = db.models[model]
  Model.findOne({ where: { [field]: val } }).then((row) => {
    const msg = errorMessage[Model.name][field].unique
    if (this.isNewRecord) {
      if (row) {
        return next(new Error(msg))
      } else {
        next()
      }
    } else {
      if (!row || this.id === row.id) {
        next()
      } else {
        return next(new Error(msg))
      }
    }
  })
}
