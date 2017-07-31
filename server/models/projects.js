import Sequelize from 'sequelize'
import db from '../db'

const Project = db.define('project', {
  name: Sequelize.STRING
})

export default Project
