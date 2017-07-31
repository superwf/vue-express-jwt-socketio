import Vue from 'vue'
import { ApolloClient, createBatchingNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

const networkInterface = createBatchingNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  batchInterval: 100,
  // transportBatching: true,
})

export const wsClient = new SubscriptionClient('ws://localhost:8080/subscriptions', {
  reconnect: true,
  // reconnectionAttempts: 10,
  connectionParams: {
    token: localStorage.getItem('token')
  }
})
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
)
// console.log(networkInterfaceWithSubscriptions)
// wsClient.use([{
//   applyMiddleware (req, next) {
//     console.log(req)
//     console.log(req.headers)
//     next()
//   }
// }])

networkInterface.use([{
  applyBatchMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = localStorage.getItem('token')
    if (token) {
      req.options.headers.authorization = `Bearer ${token}`
      next()
    } else {
      alert('no auth')
    }
  },
}]).useAfter([{
  applyBatchAfterware ({ response }, next) {
    // if (response.status === 401) {
    //   logout()
    // }
    next()
  }
}])

export const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  shouldBatch: true,
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueApollo, {
  apolloClient
})

export default apolloProvider
