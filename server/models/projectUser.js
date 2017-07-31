import Sequelize from 'sequelize'
import db from '../db'

const ProjectUser = db.define('projectUser', {
  userId: Sequelize.INTEGER,
  projectId: Sequelize.INTEGER,
})

export default ProjectUser
