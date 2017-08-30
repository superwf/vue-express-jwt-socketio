import getSocket from '@/socket'
import router from '@/router'
import config from '@/config'
import axios from 'axios'
import { waitTime } from '../../helpers'

describe('test router beforeHook', () => {
  it('router should emit join and leave room when changing', async () => {
    const socket = getSocket()
    const spy = expect.spyOn(socket, 'emit').andCallThrough()
    expect(spy.calls.length).toBe(0)
    router.mode = 'abstract'
    // await waitForNextTick()
    // when socket not open, do not emit
    router.push({ name: 'Users' })
    expect(spy.calls.length).toBe(0)

    // login
    await axios.post('/login', {
      ...config.defaultUser,
      captcha: 'wang'
    }).then(result => {
      socket.io.opts.query = {
        token: result.data.token
      }
      return new Promise(resolve => {
        socket.connect()
        socket.once('connect', resolve)
      })
    })
    router.push({ name: 'News' })
    await waitTime(16)
    expect(spy).toHaveBeenCalledWith('join', 'News')
    // vue-router delay router switch for some time
    router.push({ name: 'Users' })
    await waitTime(16)
    expect(spy).toHaveBeenCalledWith('leave', 'News')
    expect(spy).toHaveBeenCalledWith('join', 'Users')

    router.mode = 'histroy'
    spy.restore()
    socket.close()
  })
})
