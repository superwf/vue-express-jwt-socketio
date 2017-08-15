import getSocket from '../getSocket'
import { user } from '../../lib/models'
import proxy from './proxy'

const socket = getSocket()

export default proxy(user, socket)
