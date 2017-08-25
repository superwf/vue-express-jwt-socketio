import socket from '../socket'
import { user } from 'lib/models'
import proxy from './proxy'

export default proxy(user, socket())
